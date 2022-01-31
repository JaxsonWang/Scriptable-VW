import UIRender from './UIRender'
import Testing from './Testing'

const SCRIPT_VERSION = '2.2.2'

class Widget extends UIRender {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Audi 挂件'
    this.desc = 'Audi 车辆桌面组件展示'

    this.myCarPhotoUrl = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png'

    if (config.runsInApp) {
      if (!this.settings['isLogin']) this.registerAction('账户登录', this.actionAccountLogin)
      if (this.settings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings)
      if (this.settings['isLogin']) this.registerAction('刷新数据', this.actionRefreshData)
      if (this.settings['isLogin']) this.registerAction('登出重置', this.actionLogOut)
      if (this.settings['isLogin']) this.registerAction('调试日志', this.actionDebug)
      this.registerAction('主题下载', this.actionDownloadThemes)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('当前版本: v' + SCRIPT_VERSION, this.actionAbout)
    }
  }

  /**
   * 获取数据
   * @param {boolean} debug 开启日志输出
   * @return {Promise<Object>}
   */
  async getData(debug = false) {
    // 日志追踪
    if (this.settings['trackingLogEnabled']) {
      if (this.settings['debug_bootstrap_date_time']) {
        this.settings['debug_bootstrap_date_time'] += this.formatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss 更新\n')
      } else {
        this.settings['debug_bootstrap_date_time'] = '\n' + this.formatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss 更新\n')
      }
      await this.saveSettings(false)
    }

    const showLocation = this.settings['aMapKey'] !== '' && this.settings['aMapKey'] !== undefined
    const showPlate = this.settings['showPlate'] || false
    const showOil = this.settings['showOil'] || false

    const getVehiclesStatusData = await this.getVehiclesStatus(debug)

    const data = {
      isLogin: this.settings['isLogin'] === true,
      carPlateNo: this.settings['carPlateNo'],
      seriesName: this.settings['myCarName'] || this.settings['seriesName'],
      carModelName: this.settings['myCarModelName'] || this.settings['carModelName'],
      carVIN: this.settings['carVIN'],
      myOne: this.settings['myOne'] || '世间美好，与您环环相扣',
      oilSupport: showOil ? getVehiclesStatusData.oilSupport : false,
      oilLevel: getVehiclesStatusData.oilLevel || false,
      parkingLights: getVehiclesStatusData.parkingLights || '0',
      outdoorTemperature: getVehiclesStatusData.outdoorTemperature || '0',
      parkingBrakeActive: getVehiclesStatusData.parkingBrakeActive || '0',
      fuelRange: getVehiclesStatusData.fuelRange || '0',
      fuelLevel: getVehiclesStatusData.fuelLevel || false,
      socLevel: getVehiclesStatusData.socLevel || false,
      mileage: getVehiclesStatusData.mileage || '0',
      updateTime: getVehiclesStatusData.updateTime || this.formatDate(),
      updateDate: getVehiclesStatusData.updateDate || this.formatDate(),
      updateNowDate: this.formatDate(),
      updateTimeStamp: getVehiclesStatusData.updateTimeStamp || new Date().valueOf(),
      isLocked: getVehiclesStatusData.isLocked || false,
      doorStatus: getVehiclesStatusData.doorStatus || [],
      windowStatus: getVehiclesStatusData.windowStatus || [],
      showLocation,
      showPlate,
      // 获取车辆经纬度
      ...(showLocation ? await this.getVehiclesPosition(debug) : {}),
      // 获取车辆位置信息
      ...(showLocation ? await this.getCarAddressInfo(debug) : {}),
      // 获取静态位置图片
      largeLocationPicture: showLocation ? this.getCarAddressImage(debug) : 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/fvw_audi_joiner/audi_logo.png',
    }
    // 保存数据
    this.settings['widgetData'] = data
    await this.saveSettings(false)
    if (debug) {
      console.log('获取组件所需数据')
      console.log(data)
    }
    return data
  }

  /**
   * 获取设备编码
   * @returns {Promise<void>}
   */
  async getDeviceId() {
    const options = {
      url: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/register/v1',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'MyAuDi/3.0.2 CFNetwork/1325.0.1 Darwin/21.1.0'
      },
      body: JSON.stringify({
        appId: 'com.tima.aftermarket',
        client_brand: 'VW',
        appName: 'MyAuDi',
        client_name: 'Maton',
        appVersion: '3.0.2',
        platform: 'iOS'
      })
    }
    try {
      const response = await this.http(options)
      if (response.client_id) {
        this.settings['clientID'] = response.client_id
        await this.saveSettings(false)
        console.log('获取设备编码成功，准备进行账户登录')
        await this.handleLoginRequest()
      } else {
        console.error('获取设备编码失败，请稍后再重试！')
        await this.notify('系统通知', '获取设备编码失败，请稍后再重试！')
      }
    } catch (error) {
      console.error(error)
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
      if (response.code === 0) {
        await this.notify('登录成功', '正在从服务器获取车辆数据，请耐心等待！')
        // 解构数据
        const { accessToken, idToken } = response.data
        this.settings['userAccessToken'] = accessToken
        this.settings['userIDToken'] = idToken
        await this.saveSettings(false)
        console.log('账户登录成功，存储用户 accessToken, idToken 密钥信息，准备交换验证密钥数据和获取个人基础信息')
        if (debug) {
          console.log('登录接口返回数据：')
          console.log(response)
        }
        // 准备交换验证密钥数据
        await this.getTokenRequest('refreshAuthToken', debug)
        // 获取个人中心数据
        await this.getUserMineRequest()
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
      // 判断接口状态
      if (response.error) {
        switch (response.error) {
          case 'invalid_grant':
            if (/expired/g.test(response.error_description)) {
              console.warn('IDToken 数据过期，正在重新获取数据中，请耐心等待...')
              await this.getTokenRequest('refreshAuthToken')
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
        if (debug) {
          console.log(`${type} 密钥接口返回数据：`)
          console.log(response)
          console.warn('请注意不要公开此密钥信息，否则会有被丢车、被盗窃等的风险！')
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
          console.log('个人中心接口返回数据：')
          console.log(response)
        }
        // 准备交换验证密钥数据
        await this.getTokenRequest('authAccessToken')
      } else {
        console.error('获取个人信息失败，请登出重置后再进行小组件登录！')
        await this.notify('个人信息获取失败', '获取个人信息失败，请登出重置后再进行小组件登录！')
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 根据车架号查询基础访问域
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<void>}
   */
  async getApiBaseURI(debug = false) {
    const options = {
      url: `https://mal-1a.prd.cn.vwg-connect.cn/api/cs/vds/v1/vehicles/${this.settings['carVIN']}/homeRegion`,
      method: 'GET',
      headers: {
        ...this.requestHeader(),
        'Authorization': 'Bearer ' + this.settings['authToken'],
      }
    }
    try {
      const response = await this.http(options)
      // 判断接口状态
      if (response.error) {
        // 接口异常
        console.error('getApiBaseURI 接口异常' + response.error.errorCode + ' - ' + response.error.description)
      } else {
        // 接口获取数据成功
        const { baseUri } = response.homeRegion
        this.settings['ApiBaseURI'] = baseUri.content
        this.settings['isLogin'] = true
        await this.saveSettings(false)
        console.log(`根据车架号查询基础访问域成功：${baseUri.content}`)
        if (debug) {
          console.log('基础访问域接口返回数据：')
          console.log(response)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取车辆状态
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<Object>}
   */
  async getVehiclesStatus(debug = false) {
    const options = {
      url: `${this.settings['ApiBaseURI']}/bs/vsr/v1/vehicles/${this.settings['carVIN']}/status`,
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + this.settings['authToken'],
          'X-App-Name': 'MyAuDi',
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...this.requestHeader()
      }
    }
    try {
      const response = await this.http(options)
      // 判断接口状态
      if (response.error) {
        // 接口异常
        switch (response.error.errorCode) {
          case 'gw.error.authentication':
            console.error(`获取车辆状态失败：${response.error.errorCode} - ${response.error.description}`)
            await this.getTokenRequest('authAccessToken')
            await this.getVehiclesStatus()
            break
          case 'mbbc.rolesandrights.unauthorized':
            await this.notify('unauthorized 错误', '请检查您的车辆是否已经开启车联网服务，请到一汽奥迪应用查看！')
            break
          case 'mbbc.rolesandrights.unknownService':
            await this.notify('unknownService 错误', '请联系开发者！')
            break
          case 'mbbc.rolesandrights.unauthorizedUserDisabled':
            await this.notify('unauthorizedUserDisabled 错误', '未经授权的用户已禁用！')
            break
          default:
            await this.notify('未知错误' + response.error.errorCode, '未知错误:' + response.error.description)
        }
        return this.settings['vehicleData']
      } else {
        // 接口获取数据成功
        const vehicleData = response.StoredVehicleDataResponse.vehicleData.data
        this.settings['vehicleData'] = this.handleVehiclesData(vehicleData)
        await this.saveSettings(false)
        if (debug) {
          console.log('当前车辆状态接口返回数据：')
          console.log(response)
        }
        return this.handleVehiclesData(vehicleData)
      }
    } catch (error) {
      console.error(error)
      return this.settings['vehicleData']
    }
  }

  /**
   * 获取车辆经纬度
   * @param {boolean} debug 开启日志输出
   * @return {Promise<{latitude: number, longitude: number}>}
   */
  async getVehiclesPosition(debug = false) {
    const options = {
      url: `${this.settings['ApiBaseURI']}/bs/cf/v1/vehicles/${this.settings['carVIN']}/position`,
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + this.settings['authToken'],
          'X-App-Name': 'MyAuDi',
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...this.requestHeader()
      }
    }
    try {
      const response = await this.http(options)
      // 判断接口状态
      if (response.error) {
        // 接口异常
        switch (response.error.errorCode) {
          case 'gw.error.authentication':
            console.error(`获取车辆经纬度失败：${response.error.errorCode} - ${response.error.description}`)
            await this.getTokenRequest('authAccessToken')
            await this.getVehiclesPosition(debug)
            break
          case 'CF.technical.9031':
            console.error('获取数据超时，稍后再重试')
            break
          case 'mbbc.rolesandrights.servicelocallydisabled':
            console.error('请检查车辆位置是否开启')
            break
          default:
            console.error('获取车辆经纬度接口异常' + response.error.errorCode + ' - ' + response.error.description)
        }
      } else {
        // 接口获取数据成功储存接口数据
        let longitude = 0
        let latitude = 0
        if (response.storedPositionResponse) {
          longitude = response.storedPositionResponse.position.carCoordinate.longitude
          latitude = response.storedPositionResponse.position.carCoordinate.latitude
        } else if (response.findCarResponse) {
          longitude = response.findCarResponse.Position.carCoordinate.longitude
          latitude = response.findCarResponse.Position.carCoordinate.latitude
        }
        if (longitude === 0 || latitude === 0) {
          console.warn('获取车辆经纬度失败')
          this.settings['longitude'] = 0
          this.settings['latitude'] = 0
          return {
            longitude: this.settings['longitude'],
            latitude: this.settings['latitude']
          }
        } else {
          // 转换正常经纬度信息
          longitude = parseInt(longitude, 10) / 1000000
          latitude = parseInt(latitude, 10) / 1000000
          this.settings['longitude'] = longitude
          this.settings['latitude'] = latitude
          await this.saveSettings(false)
          console.log('获取车辆经纬度信息')
          if (debug) {
            console.log('当前车辆经纬度：')
            console.log('经度：' + longitude)
            console.log('纬度：' + latitude)
            console.log('车辆经纬度接口返回数据：')
            console.log(response)
          }
          return {
            longitude,
            latitude
          }
        }
      }
    } catch (error) {
      console.error(error)
      this.settings['longitude'] = -1
      this.settings['latitude'] = -1
      return {
        longitude: this.settings['longitude'],
        latitude: this.settings['latitude']
      }
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
    const UPDATE_FILE = 'FVW-Audi-Joiner.js'
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    const request = new Request('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/fvw-audi-version.json')
    const response = await request.loadJSON()
    console.log(`远程版本：${response?.version}`)
    if (response?.version === SCRIPT_VERSION) return this.notify('无需更新', '远程版本一致，暂无更新')
    console.log('发现新的版本')

    const log = response?.changelog.join('\n')
    const alert = new Alert()
    alert.title = '更新提示'
    alert.message = `是否需要升级到${response?.version.toString()}版本\n\r${log}`
    alert.addAction('更新')
    alert.addCancelAction('取消')
    const id = await alert.presentAlert()
    if (id === -1) return
    await this.notify('正在更新中...')
    const REMOTE_REQ = new Request(response?.download)
    const REMOTE_RES = await REMOTE_REQ.load()
    FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), UPDATE_FILE), REMOTE_RES)

    await this.notify('Audi 桌面组件更新完毕！')
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
