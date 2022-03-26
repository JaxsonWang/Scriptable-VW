import UIRender from './render/UIRender'
import Testing from './render/Testing'

class Widget extends UIRender {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Joiner 挂件'
    this.desc = 'Joiner 车辆桌面组件展示'
    this.version = '1.1.4'

    this.myCarPhotoUrl = 'https://cdn.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/assets/images/fvw_audi_default.png'
    this.myCarLogoUrl = 'https://cdn.jsdelivr.net/gh/JaxsonWang/Scriptable-VW@latest/build/assets/images/logo_20211127.png'
    this.logoWidth = 40
    this.logoHeight = 14

    this.defaultMyOne = '永远年轻，永远热泪盈眶'

    if (config.runsInApp) {
      this.registerAction('数据填充', this.actionFillSettings)
      if (this.settings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings)
      if (this.settings['isLogin']) this.registerAction('界面微调', this.actionUIRenderSettings)
      if (this.settings['isLogin']) this.registerAction('重置组件', this.actionLogOut)
      if (this.settings['isLogin']) this.registerAction('预览组件', this.actionTriggerPreview)
      this.registerAction('调试日志', this.actionDebug)
      this.registerAction('主题下载', this.actionDownloadThemes)
      this.registerAction('淮城一只猫', this.actionAuthor)
      this.registerAction('当前版本: v' + this.version, this.actionAbout)
    }
  }

  /**
   * 数据填充
   */
  async actionFillSettings() {
    const message = `
      Joiner 小组件是开源、并且完全免费的，当前版本是自定义版本，您可以设置想要的数据并且展示出来。\n\r
      开发者: 淮城一只猫\n\r
    `
    const present = await this.actionStatementSettings(message)
    if (present !== -1) {
      const alert = new Alert()
      alert.title = '车辆数据'
      alert.message = '请根据自己喜好填入对应的车辆数据'
      alert.addTextField('燃料续航里程（公里）', this.settings['fuelRange'])
      alert.addTextField('燃料剩余量（百分比）', this.settings['fuelLevel'])
      alert.addTextField('总里程（公里）', this.settings['mileage'])
      alert.addTextField('机油（百分比）', this.settings['oilLevel'])
      alert.addTextField('经度', this.settings['longitude'])
      alert.addTextField('纬度', this.settings['latitude'])
      alert.addAction('确定')
      alert.addCancelAction('取消')

      const id = await alert.presentAlert()
      if (id === -1) return
      this.settings['fuelRange'] = alert.textFieldValue(0)
      this.settings['fuelLevel'] = alert.textFieldValue(1)
      this.settings['mileage'] = alert.textFieldValue(2)
      this.settings['oilLevel'] = alert.textFieldValue(3)
      this.settings['longitude'] = alert.textFieldValue(4)
      this.settings['latitude'] = alert.textFieldValue(5)

      this.settings['updateTime'] = this.formatDate(new Date(), 'MM-dd HH:mm')
      this.settings['updateDate'] = this.formatDate(new Date(), 'yyyy年MM月dd日 HH:mm')
      this.settings['updateTimeStamp'] = new Date().valueOf()
      this.settings['isLogin'] = true
      await this.saveSettings(false)
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

    const data = {
      carPlateNo: this.settings['carPlateNo'],
      seriesName: this.settings['myCarName'] || 'Hello Joiner !',
      carModelName: this.settings['myCarModelName'] || 'O ever youthful, O ever weeping.',
      carVIN: '',
      myOne: this.settings['myOne'] || this.defaultMyOne,
      oilSupport: showOil,
      oilLevel: this.settings['oilLevel'] || false,
      parkingLights: '0',
      outdoorTemperature: '0',
      parkingBrakeActive: '0',
      fuelRange: this.settings['fuelRange'] || '0',
      fuelLevel: this.settings['fuelLevel'] || false,
      socLevel: false,
      mileage: this.settings['mileage'] || '0',
      updateNowDate: new Date().valueOf(),
      updateTimeStamp: this.settings['updateTimeStamp'] || new Date().valueOf(),
      isLocked: true,
      doorStatus: [],
      windowStatus: [],
      showLocation,
      showPlate,
      // 获取车辆经纬度
      ...(showLocation ? {
        longitude: this.settings['longitude'],
        latitude: this.settings['latitude']
      } : {}),
      // 获取车辆位置信息
      ...(showLocation ? await this.getCarAddressInfo(debug) : {}),
      // 获取静态位置图片
      largeLocationPicture: showLocation ? this.getCarAddressImage(debug) : this.myCarLogoUrl,
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
   * 检查更新
   */
  async actionCheckUpdate() {
    await this.checkUpdate('comfort-version')
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
}

await Testing(Widget)
