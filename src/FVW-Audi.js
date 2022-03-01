import DataRender from './render/DataRender'
import Testing from './render/Testing'

class Widget extends DataRender {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Audi 挂件'
    this.desc = 'Audi 车辆桌面组件展示'
    this.version = '2.3.3'

    this.appName = 'MyAuDi'
    this.appVersion = '3.0.2'

    this.myCarPhotoUrl = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png'
    this.myCarLogoUrl = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/logo_20211127.png'
    this.logoWidth = 40
    this.logoHeight = 14

    this.defaultMyOne = '世间美好，与您环环相扣'

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
      url: 'https://audi2c.faw-vw.com/capi/v1/user/login',
      method: 'POST',
      headers: this.requestHeader(),
      body: JSON.stringify({
        loginChannelEnum: 'APP',
        loginTypeEnum: 'ACCOUNT_PASSWORD',
        account: this.settings['username'],
        password: this.settings['password']
      })
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('登录接口返回数据：')
        console.log(response)
      }
      if (response.code === 0) {
        await this.notify('登录成功', '正在从服务器获取车辆数据，请耐心等待！')
        // 解构数据
        const { accessToken, idToken } = response.data
        this.settings['userAccessToken'] = accessToken
        this.settings['userIDToken'] = idToken
        await this.saveSettings(false)
        console.log('账户登录成功，存储用户 accessToken, idToken 密钥信息，准备交换验证密钥数据和获取个人基础信息')
        // 准备交换验证密钥数据
        await this.getTokenRequest('refreshAuthToken', debug)
        // 获取个人中心数据
        await this.getUserMineRequest(debug)
      } else {
        console.error('账户登录失败：' + response.message)
        await this.notify('账户登录失败', '账户登录失败：' + response.message)
      }
    } catch (error) {
      // Error: 似乎已断开与互联网到连接。
      console.error(error)
    }
  }

  /**
   * 获取密钥数据
   * @param {'refreshAuthToken' | 'authAccessToken'} type
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<void>}
   */
  async getTokenRequest(type, debug = false) {
    // 根据交换token请求参数不同
    let requestParams = ''
    switch (type) {
      case 'refreshAuthToken':
        requestParams = `grant_type=${encodeURIComponent('id_token')}&token=${encodeURIComponent(this.settings['userIDToken'])}&scope=${encodeURIComponent('sc2:fal')}`
        break
      case 'authAccessToken':
        requestParams = `grant_type=${encodeURIComponent('refresh_token')}&token=${encodeURIComponent(this.settings['refreshAuthToken'])}&scope=${encodeURIComponent('sc2:fal')}&vin=${this.settings['carVIN']}`
        break
    }

    const requestHeader = JSON.parse(JSON.stringify(this.requestHeader()))
    delete requestHeader.Accept
    delete requestHeader['Content-Type']
    requestHeader['X-Client-ID'] = 'de6d8b23-792f-47b8-82f4-e4cc59c2916e'

    const options = {
      url: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/oauth2/v1/token',
      method: 'POST',
      headers: requestHeader,
      body: requestParams
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log(`${type} 密钥接口返回数据：`)
        console.log(response)
        console.warn('请注意不要公开此密钥信息，否则会有被丢车、被盗窃等的风险！')
      }
      // 判断接口状态
      if (response.error) {
        switch (response.error) {
          case 'invalid_grant':
            if (/expired/g.test(response.error_description)) {
              console.warn('IDToken 数据过期，正在重新获取数据中，请耐心等待...')
              await this.getTokenRequest('refreshAuthToken', debug)
            } else {
              console.error('Token 授权无效，请联系开发者：')
              console.error(`${response.error_description} - ${response.error_description}`)
            }
            break
          default:
            console.error('交换 Token 请求失败：' + response.error + ' - ' + response.error_description)
        }
      } else {
        // 获取密钥数据成功，存储数据
        if (type === 'refreshAuthToken') {
          this.settings['refreshAuthToken'] = response.refresh_token
          await this.saveSettings(false)
          console.log('refreshAuthToken 密钥数据获取成功并且存储到本地')
        }
        if (type === 'authAccessToken') {
          this.settings['authToken'] = response.access_token
          await this.saveSettings(false)
          console.log('authToken 密钥数据获取成功并且存储到本地')
          // 设置访问接口
          await this.getApiBaseURI(debug)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取用户信息
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<void>}
   */
  async getUserMineRequest(debug = false) {
    const options = {
      url: 'https://audi2c.faw-vw.com/capi/v1/user/mine',
      method: 'GET',
      headers: {
        ...{
          'X-ACCESS-TOKEN': this.settings['userAccessToken'],
          'X-CHANNEL': 'IOS',
          'x-mobile': this.settings['username']
        },
        ...this.requestHeader()
      }
    }
    try {
      const response = await this.http(options)
      console.log('个人中心接口返回数据：')
      console.log(response)
      // 判断接口状态
      if (response.code === 0) {
        const { vehicleDto } = response.data
        const { plateNo, seriesName, carModelName, vin } = vehicleDto
        this.settings['carPlateNo'] = plateNo
        this.settings['seriesName'] = seriesName
        this.settings['carModelName'] = carModelName
        this.settings['carVIN'] = vin
        await this.saveSettings(false)
        console.log('获取用户基本信息成功并将存储本地')
        if (debug) {
          console.log('获取个人信息：')
          console.log('车牌号码：' + plateNo)
          console.log('车系名称：' + seriesName)
          console.log('车型名称：' + carModelName)
          console.log('车架号码：' + vin)
        }
        // 准备交换验证密钥数据
        await this.getTokenRequest('authAccessToken', debug)
      } else {
        console.error('获取个人信息失败，请登出重置后再进行小组件登录！')
        await this.notify('个人信息获取失败', '获取个人信息失败，请登出重置后再进行小组件登录！')
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
      Joiner 小组件是开源、并且完全免费的，由奥迪车主开发，所有责任与一汽奥迪公司无关\n\r
      开发者: 淮城一只猫\n\r
      温馨提示：由于一汽奥迪应用支持单点登录，即不支持多终端应用登录，建议在一汽奥迪应用「用车 - 更多功能 - 用户管理」进行添加用户，这样 Joiner 组件和应用独立执行。
    `
    const present = await this.actionStatementSettings(message)
    if (present !== -1) {
      const alert = new Alert()
      alert.title = 'Joiner 登录'
      alert.message = '使用一汽奥迪账号登录进行展示数据'
      alert.addTextField('一汽奥迪账号', this.settings['username'])
      alert.addSecureTextField('一汽奥迪密码', this.settings['password'])
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
    await this.checkUpdate('fvw-audi-version')
  }

  /**
   * 预览组件
   * @returns {Promise<void>}
   */
  async actionTriggerPreview() {
    await this.actionPreview(Widget)
  }

  /**
   * 请求头信息
   * @returns {Object}
   */
  requestHeader() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'MyAuDi/3.0.2 CFNetwork/1325.0.1 Darwin/21.1.0',
      'X-Client-ID': this.settings['clientID']
    }
  }
}

await Testing(Widget)
