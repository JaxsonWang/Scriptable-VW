import DataRender from './render/DataRender'
import Testing from './render/Testing'

class Widget extends DataRender {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = '一汽大众挂件'
    this.desc = '一汽大众车辆桌面组件展示'
    this.version = '2.2.2'

    this.appName = 'BootstrapApp'
    this.appVersion = '1.0'

    this.myCarPhotoUrl = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/vw_default_1.png'
    this.myCarLogoUrl = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/vw_logo.png'
    this.logoWidth = 14
    this.logoHeight = 14

    this.defaultMyOne = '与你一路同行'

    if (config.runsInApp) {
      if (!this.settings['isLogin']) this.registerAction('账户登录', this.actionAccountLogin)
      if (this.settings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings)
      if (this.settings['isLogin']) this.registerAction('界面微调', this.actionUIRenderSettings)
      if (this.settings['isLogin']) this.registerAction('刷新数据', this.actionRefreshData)
      if (this.settings['isLogin']) this.registerAction('登出重置', this.actionLogOut)
      if (this.settings['isLogin']) this.registerAction('预览组件', this.actionTriggerPreview)
      if (this.settings['isLogin']) this.registerAction('调试日志', this.actionDebug)
      this.registerAction('主题下载', this.actionDownloadThemes)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('当前版本: v' + this.version, this.actionAbout)
    }
  }

  /**
   * 登录账户
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<void>}
   */
  async handleLoginRequest(debug = false) {
    const options = {
      url: 'https://one-app-h5.faw-vw.com/prod-api/mobile/one-app/user/public/v1/login?appkey=6298289633',
      method: 'POST',
      headers: this.requestHeader(),
      body: JSON.stringify({
        password: this.settings['password'].trim(),
        account: this.settings['username'].trim(),
        scope: 'openid profile mbb'
      })
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('登录接口返回数据：')
        console.log(response)
      }
      if (response.returnStatus === 'SUCCEED') {
        await this.notify('登录成功', '正在从服务器获取车辆数据，请耐心等待！')
        // 解构数据
        const { tokenInfo } = response.data
        this.settings['userIDToken'] = tokenInfo.idToken
        await this.saveSettings(false)
        console.log('账户登录成功，存储用户 idToken 密钥信息，准备交换验证密钥数据和获取个人基础信息')
        // 获取个人中心数据
        await this.getTokenRequest(debug)
      } else {
        console.error('账户登录失败：' + response.description)
        await this.notify('账户登录失败', '账户登录失败：' + response.description)
      }
    } catch (error) {
      // Error: 似乎已断开与互联网到连接。
      console.error(error)
    }
  }

  /**
   * 获取密钥数据
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<void>}
   */
  async getTokenRequest(debug = false) {
    // 根据交换token请求参数不同
    // token 参数
    const requestParams = `grant_type=${encodeURIComponent('id_token')}&token=${encodeURIComponent(this.settings['userIDToken'])}&scope=${encodeURIComponent('t2_fawvw:fal')}`

    const options = {
      url: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/oauth2/v1/token',
      method: 'POST',
      headers: {
        'X-Client-Id': this.settings['clientID']
      },
      body: requestParams
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('密钥接口返回数据：')
        console.log(response)
        console.warn('请注意不要公开此密钥信息，否则会有被丢车、被盗窃等的风险！')
      }
      // 判断接口状态
      if (response.error) {
        switch (response.error) {
          case 'invalid_grant':
            if (/expired/g.test(response.error_description)) {
              console.warn('IDToken 数据过期，正在重新获取数据中，请耐心等待...')
              await this.getTokenRequest(debug)
            } else {
              console.error('Token 授权无效，请联系开发者：')
              console.error(`${response.error_description} - ${response.error_description}`)
            }
            break
          case 'invalid_request':
            console.warn('无效 Token，正在重新登录中，请耐心等待...')
            await this.handleLoginRequest(debug)
            break
          default:
            console.error('交换 Token 请求失败：' + response.error + ' - ' + response.error_description)
        }
      } else {
        // 获取密钥数据成功，存储数据
        this.settings['authToken'] = response.access_token
        await this.saveSettings(false)
        console.log('authToken 密钥数据获取成功并且存储到本地')
        // 设置访问接口
        await this.getVehiclesVIN(debug)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取车辆车架号
   * @param  debug 开启日志输出
   * @return {Promise<void>}
   */
  async getVehiclesVIN(debug = false) {
    const options = {
      url: 'https://mal-1a.prd.cn.vwg-connect.cn/api/usermanagement/users/v1/vehicles',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.settings['authToken']
      }
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('车架号接口返回数据：')
        console.log(response)
      }
      if (response?.userVehicles?.vehicle) {
        this.settings['carVIN'] = response.userVehicles.vehicle[0]
        // 提示：一汽大众无法获取车辆基本信息，暂时写死
        this.settings['seriesName'] = '嗨，一汽大众'
        this.settings['carModelName'] = 'set your car model'
        await this.saveSettings(false)
        await this.getApiBaseURI(debug)
      } else {
        console.log('获取车架号失败')
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 账户登录
   */
  async actionAccountLogin() {
    const message = `
      Joiner 小组件需要使用到您的一汽大众应用的账号，首次登录请配置账号、密码进行令牌获取\n\r
      Joiner 小组件不会收集您的个人账户信息，所有账号信息将存在 iCloud 或者 iPhone 上但也请您妥善保管自己的账号\n\r
      Joiner 小组件是开源、并且完全免费的，由大众粉丝车主开发，所有责任与一汽大众公司无关\n\r
      开发者: 淮城一只猫\n\r
      温馨提示：由于一汽大众应用支持单点登录，即不支持多终端应用登录，建议在一汽大众应用「爱车 - 用户授权」进行添加用户，这样 Joiner 组件和应用独立执行。
    `
    const present = await this.actionStatementSettings(message)
    if (present !== -1) {
      const alert = new Alert()
      alert.title = 'Joiner 登录'
      alert.message = '使用一汽大众账号登录进行展示数据'
      alert.addTextField('一汽大众账号', this.settings['username'])
      alert.addSecureTextField('一汽大众密码', this.settings['password'])
      alert.addAction('确定')
      alert.addCancelAction('取消')

      const id = await alert.presentAlert()
      if (id === -1) return
      this.settings['username'] = alert.textFieldValue(0)
      this.settings['password'] = alert.textFieldValue(1)
      console.log('您已经同意协议，并且已经储存账户信息，开始进行获取设备编码')
      await this.saveSettings(false)
      await this.getDeviceId()
    }
  }

  /**
   * 检查更新
   */
  async actionCheckUpdate() {
    await this.checkUpdate('fvw-version')
  }

  /**
   * 预览组件
   * @returns {Promise<void>}
   */
  async actionTriggerPreview() {
    await this.actionPreview(Widget)
  }

  /**
   * 重写车牌显示
   * 提示：因为一汽大众暂时没有办法自动获取车辆基础信息
   * @returns {Promise<void>}
   */
  async showPlate() {
    const alert = new Alert()
    alert.title = '设置车牌'
    alert.message = '请设置您的车辆牌照信息，不填牌照默认关闭牌照展示'
    alert.addTextField('车牌信息', this.settings['carPlateNo'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionUIRenderSettings()
    // 写入车牌信息
    const carPlateNo = alert.textFieldValue(0)
    if(carPlateNo) {
      this.settings['carPlateNo'] = alert.textFieldValue(0)
      this.settings['showPlate'] = true
    } else {
      this.settings['showPlate'] = false
    }
    await this.saveSettings()
    return await this.actionUIRenderSettings()
  }

  /**
   * 请求头信息
   * @returns {Object}
   */
  requestHeader() {
    return {
      Accept: 'application/json',
      OS: 'iOS',
      'Content-Type': 'application/json',
      'User-Agent': 'NewAfterMarket-ios/3.17.1 CFNetwork/1329 Darwin/21.3.0',
      'Did': `VW_APP_iPhone_${this.settings['clientID'].replace(/-/g, '')}_15.1_2.7.0`,
      'X-Client-Id': this.settings['clientID'],
      'deviceId': this.settings['clientID']
    }
  }
}

await Testing(Widget)
