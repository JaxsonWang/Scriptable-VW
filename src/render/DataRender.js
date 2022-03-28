import UIRender from './UIRender'

class DataRender extends UIRender {
  constructor(args = '') {
    super(args)

    this.appName = ''
    this.appVersion = ''
  }

  /**
   * 处理车辆状态信息
   * @param {Array} data 状态数据
   */
  handleVehiclesData(data) {
    // region 机油信息
    const oilSupport = data.find(i => i.id === '0x0204FFFFFF')?.field
    let oilLevel = false
    // 有些车辆不一定支持机油显示，需要判断下 机油单位百分比
    if (oilSupport) oilLevel = oilSupport.find(i => i.id === '0x0204040003')?.value
    // endregion
    const statusArr = data.find(i => i.id === '0x0301FFFFFF')?.field
    // region 驻车灯
    // '2' = 已关闭
    const parkingLights = statusArr.find(i => i.id === '0x0301010001')?.value
    // endregion
    // region 室外温度
    const kelvinTemperature = statusArr.find(i => i.id === '0x0301020001')?.value
    // 开尔文单位转换成摄氏度
    const outdoorTemperature = (parseInt(kelvinTemperature, 10) / 10 + -273.15).toFixed(1)
    // endregion
    // region 驻车制动
    // '1' = 已激活 / '0' = 未激活
    const parkingBrakeActive = statusArr.find(i => i.id === '0x0301030001')?.value
    // endregion
    // region 续航里程
    // 单位 km
    const fuelRange = parseInt(statusArr.find(i => i.id === '0x0301030005')?.value, 10) || parseInt(statusArr.find(i => i.id === '0x0301030006')?.value, 10)
    // endregion
    // region 汽油油量
    // 单位 %
    const fuelLevel = statusArr.find(i => i.id === '0x030103000A')?.value
    // endregion
    // region 电池容量
    // 单位 %
    const socLevel = statusArr.find(i => i.id === '0x0301030002')?.value
    // endregion
    // region 总里程和更新时间
    const mileageArr = data.find(i => i.id === '0x0101010002')?.field
    const mileage = mileageArr.find(i => i.id === '0x0101010002')?.value
    const dateTime = mileageArr.find(i => i.id === '0x0101010002')?.tsCarSentUtc
    const updateTimeStamp = new Date(dateTime).valueOf()
    // endregion
    // region 锁车状态
    const isLocked = this.getVehiclesLocked(statusArr)
    // endregion
    // region 车门状态
    const doorStatus = this.getVehiclesDoorStatus(statusArr).map(i => i.name)
    // endregion
    // region 车窗状态
    const windowStatus = this.getVehiclesWindowStatus(statusArr).map(i => i.name)
    // endregion

    return {
      oilSupport: oilSupport !== undefined,
      oilLevel,
      parkingLights,
      outdoorTemperature,
      parkingBrakeActive,
      fuelRange,
      fuelLevel,
      socLevel,
      mileage,
      updateTimeStamp,
      isLocked,
      doorStatus,
      windowStatus
    }
  }

  /**
   * 获取车辆锁车状态
   * @param {Array} arr
   * @returns {boolean} true = 锁车 false = 没有完全锁车
   */
  getVehiclesLocked(arr) {
    // 先判断车辆是否锁定
    const lockArr = ['0x0301040001', '0x0301040004', '0x0301040007', '0x030104000A', '0x030104000D']
    // 筛选出对应的数组 并且过滤不支持检测状态
    const filterArr = arr.filter(item => lockArr.some(i => i === item.id)).filter(item => item.value !== '0')
    // 判断是否都锁门
    // value === 0 不支持
    // value === 2 锁门
    // value === 3 未锁门
    return filterArr.every(item => item.value === '2')
  }

  /**
   * 获取车辆车门/引擎盖/后备箱状态
   * @param {Array} arr
   * @return Promise<[]<{
   *   id: string
   *   name: string
   * }>>
   */
  getVehiclesDoorStatus (arr) {
    const doorArr = [
      {
        id: '0x0301040002',
        name: '左前门'
      }, {
        id: '0x0301040005',
        name: '左后门'
      }, {
        id: '0x0301040008',
        name: '右前门'
      }, {
        id: '0x030104000B',
        name: '右后门'
      }, {
        id: '0x0301040011',
        name: '引擎盖'
      }, {
        id: '0x030104000E',
        name: '后备箱'
      }
    ]
    // 筛选出对应的数组
    const filterArr = arr.filter(item => doorArr.some(i => i.id === item.id))
    // 筛选出没有关门id
    // value === 0 不支持
    // value === 2 关门
    // value === 3 未关门
    const result = filterArr.filter(item => item.value === '2').filter(item => item.value !== '0')
    // 返回开门的数组
    return doorArr.filter(i => result.some(x => x.id === i.id))
  }

  /**
   * 获取车辆车窗/天窗状态
   * @param {Array} arr
   * @return Promise<[]<{
   *   id: string
   *   name: string
   * }>>
   */
  getVehiclesWindowStatus (arr) {
    const windowArr = [
      {
        id: '0x0301050001',
        name: '左前窗'
      }, {
        id: '0x0301050003',
        name: '左后窗'
      }, {
        id: '0x0301050005',
        name: '右前窗'
      }, {
        id: '0x0301050007',
        name: '右后窗'
      }, {
        id: '0x030105000B',
        name: '天窗'
      }
    ]
    // 筛选出对应的数组
    const filterArr = arr.filter(item => windowArr.some(i => i.id === item.id))
    // 筛选出没有关门id
    const result = filterArr.filter(item => item.value === '2').filter(item => item.value !== '0')
    // 返回开门的数组
    return windowArr.filter(i => result.some(x => x.id === i.id))
  }

  /**
   * 车辆操作
   */
  async actionOperations() {
    const alert = new Alert()
    alert.title = '控车操作'
    alert.message = '请求时间很慢，毕竟请求还有经过国外服务器，还不一定能响应，凑合用吧。'

    const menuList = [
      {
        type: 'HONK_ONLY',
        time: 10,
        text: '鸣笛10秒'
      },
      {
        type: 'HONK_ONLY',
        time: 20,
        text: '鸣笛20秒'
      },
      {
        type: 'HONK_ONLY',
        time: 30,
        text: '鸣笛30秒'
      },
      {
        type: 'FLASH_ONLY',
        time: 10,
        text: '闪灯10秒'
      },
      {
        type: 'FLASH_ONLY',
        time: 20,
        text: '闪灯20秒'
      },
      {
        type: 'FLASH_ONLY',
        time: 30,
        text: '闪灯30秒'
      },
      {
        type: 'HONK_AND_FLASH',
        time: 10,
        text: '鸣笛和闪灯10秒'
      },
      {
        type: 'HONK_AND_FLASH',
        time: 20,
        text: '鸣笛和闪灯20秒'
      },
      {
        type: 'HONK_AND_FLASH',
        time: 30,
        text: '鸣笛和闪灯30秒'
      }
    ]

    menuList.forEach(item => {
      alert.addAction(item.text)
    })

    alert.addCancelAction('退出菜单')
    const id = await alert.presentSheet()
    if (id === -1) return
    // 执行函数
    await this.handleHonkAndFlash(menuList[id].type, menuList[id].time)
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

    const location = await Location.current()
    const phonePosition = {
      longitude: location.longitude,
      latitude: location.latitude
    }
    this.settings['phoneLongitude'] = location.longitude
    this.settings['phoneLatitude'] = location.latitude
    const vehiclesPosition = await this.getVehiclesPosition(debug)

    const data = {
      carPlateNo: this.settings['carPlateNo'],
      seriesName: this.settings['myCarName'] || this.settings['seriesName'],
      carModelName: this.settings['myCarModelName'] || this.settings['carModelName'],
      carVIN: this.settings['carVIN'],
      myOne: this.settings['myOne'] || this.defaultMyOne,
      oilSupport: showOil ? getVehiclesStatusData.oilSupport : false,
      oilLevel: getVehiclesStatusData.oilLevel || false,
      parkingLights: getVehiclesStatusData.parkingLights || '0',
      outdoorTemperature: getVehiclesStatusData.outdoorTemperature || '0',
      parkingBrakeActive: getVehiclesStatusData.parkingBrakeActive || '0',
      fuelRange: getVehiclesStatusData.fuelRange || '0',
      fuelLevel: getVehiclesStatusData.fuelLevel || false,
      socLevel: getVehiclesStatusData.socLevel || false,
      mileage: getVehiclesStatusData.mileage || '0',
      updateNowDate: new Date().valueOf(),
      updateTimeStamp: getVehiclesStatusData.updateTimeStamp || new Date().valueOf(),
      isLocked: getVehiclesStatusData.isLocked || false,
      doorStatus: getVehiclesStatusData.doorStatus || [],
      windowStatus: getVehiclesStatusData.windowStatus || [],
      showLocation,
      showPlate,
      // 获取车辆经纬度 / 手机经纬度
      ...(showLocation ? vehiclesPosition : phonePosition),
      // 获取车辆位置信息 / 手机位置信息
      ...await this.getCarAddressInfo(showLocation ? vehiclesPosition : phonePosition, debug),
      // 获取静态位置图片
      largeLocationPicture: this.getCarAddressImage(showLocation ? vehiclesPosition : phonePosition, debug)
    }
    // 保存数据
    this.settings['widgetData'] = data
    this.settings['scriptName'] = Script.name()
    await this.saveSettings(false)
    if (debug) {
      console.log('获取组件所需数据：')
      console.log(data)
    }
    return data
  }

  /**
   * 获取设备编码
   * @returns {Promise<void>}
   */
  async getDeviceId(debug = false) {
    const options = {
      url: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/register/v1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appId: 'com.tima.aftermarket',
        client_brand: 'VW',
        appName: this.appName,
        client_name: 'Maton',
        appVersion: this.appVersion,
        platform: 'iOS'
      })
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('设备编码接口返回数据：')
        console.log(response)
      }
      if (response.client_id) {
        this.settings['clientID'] = response.client_id
        await this.saveSettings(false)
        console.log('获取设备编码成功，准备进行账户登录')
        await this.handleLoginRequest(debug)
      } else {
        console.error('获取设备编码失败，请稍后再重试！')
        await this.notify('系统通知', '获取设备编码失败，请稍后再重试！')
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
      if (debug) {
        console.log('基础访问域接口返回数据：')
        console.log(response)
      }
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
          'X-App-Name': this.appName,
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...this.requestHeader()
      }
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('当前车辆状态接口返回数据：')
        console.log(response)
      }
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
          'X-App-Name': this.appName,
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...this.requestHeader()
      }
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('车辆经纬度接口返回数据：')
        console.log(response)
      }
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
          this.settings['longitude'] = undefined
          this.settings['latitude'] = undefined
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
          }
          return {
            longitude,
            latitude
          }
        }
      }
    } catch (error) {
      console.error(error)
      this.settings['longitude'] = undefined
      this.settings['latitude'] = undefined
      return {
        longitude: this.settings['longitude'],
        latitude: this.settings['latitude']
      }
    }
  }

  /**
   * 车辆操作
   * @param type 类型
   * @param time 请求时间
   * @return {Promise<void>}
   */
  async handleHonkAndFlash(type, time) {
    const options = {
      url: `${this.settings['ApiBaseURI']}/bs/rhf/v1/vehicles/${this.settings['carVIN']}/honkAndFlash`,
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + this.settings['authToken'],
          'X-App-Name': this.appName,
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...this.requestHeader()
      },
      body: JSON.stringify({
        honkAndFlashRequest: {
          userPosition: {
            longitude: this.settings['longitude'],
            latitude: this.settings['latitude']
          },
          serviceOperationCode: type,
          serviceDuration: time
        }
      })
    }
    try {
      const response = await this.http(options)
      if (debug) {
        console.log('当前车辆状态接口返回数据：')
        console.log(response)
      }
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
        return this.handleVehiclesData(vehicleData)
      }
    } catch (error) {
      console.error(error)
      return this.settings['vehicleData']
    }
  }
}

export default DataRender
