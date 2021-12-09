// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: car;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: car;
//
// iOS 桌面组件脚本
// 开发说明：请从 Widget 类开始编写，注释请勿修改
//

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const { Base, Testing } = require('./depend')

// @组件代码开始
const AUDI_VERSION = '1.3.0'
const DEFAULT_LIGHT_BACKGROUND_COLOR_1 = '#FFFFFF'
const DEFAULT_LIGHT_BACKGROUND_COLOR_2 = '#B2D4EC'
const DEFAULT_DARK_BACKGROUND_COLOR_1 = '#404040'
const DEFAULT_DARK_BACKGROUND_COLOR_2 = '#1E1E1E'

const AUDI_SERVER_API = {
  login: 'https://audi2c.faw-vw.com/capi/v1/user/login',
  token: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/oauth2/v1/token',
  mine: 'https://audi2c.faw-vw.com/capi/v1/user/mine',
  mal1aVehiclesStatus: vin => `https://mal-1a.prd.cn.vwg-connect.cn/api/bs/vsr/v1/vehicles/${vin}/status`,
  mal1aVehiclesPosition: vin => `https://mal-1a.prd.cn.vwg-connect.cn/api/bs/cf/v1/vehicles/${vin}/position`,
  mal3aVehiclesStatus: vin => `https://mal-3a.prd.cn.dp.vwg-connect.cn/api/bs/vsr/v1/vehicles/${vin}/status`,
  mal3aVehiclesPosition: vin => `https://mal-3a.prd.cn.dp.vwg-connect.cn/api/bs/cf/v1/vehicles/${vin}/position`,
  vehicleServer: (appKey, nonce, sign, signt) => `https://audioneapp.faw-vw.com:443/v2/audi-vehicle-server/public/vehicleServer/queryDefaultVehicleDetails?appkey=${appKey}&nonce=${nonce}&sign=${sign}&signt=${signt}`
}
const SIGN_SERVER_API = {
  sign: 'https://api.zhous.cloud/audiServer/signature/getSignature'
}
const REQUEST_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'MyAuDi/3.0.2 CFNetwork/1325.0.1 Darwin/21.1.0',
  'X-Client-ID': 'de6d8b23-792f-47b8-82f4-e4cc59c2916e'
}
const DEFAULT_MY_CAR_PHOTO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png'
const DEFAULT_AUDI_LOGO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/logo_20211127.png'
const GLOBAL_USER_DATA = {
  size: '',
  seriesName: '',
  modelShortName: '',
  vin: '',
  plateNo: '', // 车牌号
  endurance: 0, // NEDC 续航
  fuelLevel: 0, // 汽油 单位百分比
  oilLevel: undefined, // 机油 单位百分比
  mileage: 0, // 总里程
  updateDate: new Date(), // 更新时间
  carSimpleLocation: '',
  carCompleteLocation: '',
  longitude: '',
  latitude: '',
  status: true, // false = 没锁车 true = 已锁车
  doorAndWindow: '', // 门窗状态
  myOne: '世间美好，与您环环相扣'
}
const AUDI_AMAP_KEY = 'c078fb16379c25bc0aad8633d82cf1dd'

const DEVICE_SIZE  = {
  '428x926': {
    small: { width: 176, height: 176 },
    medium: { width: 374, height: 176 },
    large: { width: 374, height: 391 }
  },
  '390x844': {
    small: { width: 161, height: 161 },
    medium: { width: 342, height: 161 },
    large: { width: 342, height: 359 }
  },
  '414x896': {
    small: { width: 169, height: 169 },
    medium: { width: 360, height: 169 },
    large: { width: 360, height: 376 }
  },
  '375x812': {
    small: { width: 155, height: 155 },
    medium: { width: 329, height: 155 },
    large: { width: 329, height: 345 }
  },
  '414x736': {
    small: { width: 159, height: 159 },
    medium: { width: 348, height: 159 },
    large: { width: 348, height: 357 }
  },
  '375x667': {
    small: { width: 148, height: 148 },
    medium: { width: 322, height: 148 },
    large: { width: 322, height: 324 }
  },
  '320x568': {
    small: { width: 141, height: 141 },
    medium: { width: 291, height: 141 },
    large: { width: 291, height: 299 }
  }
}

const Files = FileManager.local()

class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Audi 挂件'
    this.desc = 'Audi 车辆桌面组件展示'

    if (config.runsInApp) {
      if (!Keychain.contains('authToken')) this.registerAction('账户登录', this.actionStatementSettings)
      if (Keychain.contains('authToken')) this.registerAction('偏好配置', this.actionPreferenceSettings)
      this.registerAction('兼容设置', this.actionCompatible)
      this.registerAction('重置组件', this.actionLogOut)
      if (Keychain.contains('authToken')) this.registerAction('重载数据', this.actionLogAction)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('打赏作者', this.actionDonation)
      this.registerAction('当前版本: v' + AUDI_VERSION, this.actionAbout)
    }
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render() {
    const data = await this.getData()
    const screenSize = Device.screenSize()
    const size = DEVICE_SIZE[`${screenSize.width}x${screenSize.height}`] || DEVICE_SIZE['428x926']
    if (data) {
      if (typeof data === 'object') {
        switch (this.widgetFamily) {
          case 'large':
            data.size = size.large
            return await this.renderLarge(data)
          case 'medium':
            data.size = size.medium
            return await this.renderMedium(data)
          default:
            data.size = size.small
            return await this.renderSmall(data)
        }
      } else {
        // 返回组件错误信息
        return await this.renderError(data)
      }
    } else {
      return await this.renderEmpty()
    }
  }

  /**
   * 渲染小尺寸组件
   * @param {Object} data
   * @returns {Promise<ListWidget>}
   */
  async renderSmall(data) {
    const widget = new ListWidget()

    if (await this.isUsingDarkAppearance() === false && this.settings['myBackgroundPhotoSmallLight']) {
      widget.backgroundImage = await Files.readImage(this.settings['myBackgroundPhotoSmallLight'])
    } else if (await this.isUsingDarkAppearance() === true && this.settings['myBackgroundPhotoSmallDark']) {
      widget.backgroundImage = await Files.readImage(this.settings['myBackgroundPhotoSmallDark'])
    } else {
      widget.backgroundGradient = this.getBackgroundColor()
    }

    const width = data?.size?.width - 20
    const widgetSize = height => new Size(width, height)

    widget.addSpacer(20)

    const header = widget.addStack()
    header.size = widgetSize(header.size.height)
    header.layoutVertically()

    const _title = header.addText(data.seriesName)
    _title.textOpacity = 1
    _title.font = Font.systemFont(18)
    this.setWidgetTextColor(_title)
    _title.leftAlignText()

    const content = widget.addStack()
    content.bottomAlignContent()
    const _fuelStroke = content.addText( `${data.endurance}km`)
    _fuelStroke.font = Font.systemFont(20)
    this.setWidgetTextColor(_fuelStroke)
    const _cut = content.addText('/')
    _cut.font = Font.systemFont(16)
    _cut.textOpacity = 0.75
    this.setWidgetTextColor(_cut)

    const _fuelLevel = content.addText( `${data.fuelLevel}%`)
    _fuelLevel.font = Font.systemFont(16)
    _fuelLevel.textOpacity = 0.75
    this.setWidgetTextColor(_fuelLevel)

    const imageStack = widget.addStack()

    const _audiImage = imageStack.addImage(await this.getMyCarPhoto())
    _audiImage.imageSize = widgetSize(120)
    _audiImage.rightAlignImage()
    return widget
  }

  /**
   * 渲染中尺寸组件
   * @param {Object} data
   * @returns {Promise<ListWidget>}
   */
  async renderMedium(data) {
    const widget = new ListWidget()

    if (await this.isUsingDarkAppearance() === false && this.settings['myBackgroundPhotoMediumLight']) {
      widget.backgroundImage = await Files.readImage(this.settings['myBackgroundPhotoMediumLight'])
    } else if (await this.isUsingDarkAppearance() === true && this.settings['myBackgroundPhotoMediumDark']) {
      widget.backgroundImage = await Files.readImage(this.settings['myBackgroundPhotoMediumDark'])
    } else {
      widget.backgroundGradient = this.getBackgroundColor()
    }

    const width = data?.size?.width - 36
    const height = data?.size?.height
    const widgetSize = height => new Size(width, height)
    const headerStackHeight = 20
    const tipStackHeight = 14
    const contentStackHeight = height - headerStackHeight - tipStackHeight - 30

    // region headerStack start height = 20
    // 头部
    const headerStack = widget.addStack()
    headerStack.size = widgetSize(headerStackHeight)
    // headerStack.backgroundColor = Color.brown()

    const myCarStack = headerStack.addStack()
    myCarStack.size = new Size(width - 120, headerStack.size.height)
    // myCarStack.backgroundColor = Color.red()
    myCarStack.layoutVertically()
    const myCarText = myCarStack.addText(data.seriesName)
    myCarText.font = Font.systemFont(18)
    this.setWidgetTextColor(myCarText)

    const logoStack = headerStack.addStack()
    logoStack.size = new Size(120, headerStack.size.height)
    logoStack.layoutVertically()

    const audiLogoStack = logoStack.addStack()
    audiLogoStack.size = new Size(logoStack.size.width, logoStack.size.height)
    // audiLogoStack.backgroundColor = Color.orange()
    audiLogoStack.setPadding(2, 0, 2, 0)
    // if (!this.showPlate()) audiLogoStack.setPadding(2, 0, 2, 0)
    // audiLogoStack.layoutVertically()
    // 显示车牌
    const plateNoStack = audiLogoStack.addStack()
    plateNoStack.size = new Size(70, logoStack.size.height)
    const plateNoText = plateNoStack.addText(this.showPlate() ? data.plateNo : ' ')
    plateNoText.font = Font.systemFont(12)
    this.setWidgetTextColor(plateNoText)

    const audiLogo = audiLogoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    audiLogo.imageSize = new Size(50, 15)
    this.setWidgetImageColor(audiLogo)
    // endregion headerStack end

    const contentStack = widget.addStack()
    // header height = 20 / tip height = 14 / 20
    contentStack.size = widgetSize(contentStackHeight)
    // contentStack.backgroundColor = Color.gray()

    // region leftStack start
    const leftStack = contentStack.addStack()
    leftStack.size = new Size(contentStack.size.width / 2, contentStack.size.height)
    // leftStack.backgroundColor = Color.orange()
    leftStack.topAlignContent()
    leftStack.layoutVertically()

    // 车辆功率
    const powerStack = leftStack.addStack()
    // powerStack.backgroundColor = Color.blue()
    const powerText = powerStack.addText(`${data.modelShortName}`)
    powerText.font = Font.systemFont(14)
    this.setWidgetTextColor(powerText)

    // 显示续航
    const enduranceStack = leftStack.addStack()
    enduranceStack.bottomAlignContent()
    // enduranceStack.backgroundColor = Color.cyan()
    const enduranceText = enduranceStack.addText( `${data.endurance}km`)
    enduranceText.font = Font.heavySystemFont(16)
    this.setWidgetTextColor(enduranceText)
    // 隔断符号
    const cutFuelText = enduranceStack.addText(' / ')
    cutFuelText.font = Font.systemFont(14)
    cutFuelText.textOpacity = 0.75
    this.setWidgetTextColor(cutFuelText)
    // 燃料百分比
    const fuelText = enduranceStack.addText( `${data.fuelLevel}%`)
    fuelText.font = Font.systemFont(14)
    fuelText.textOpacity = 0.75
    this.setWidgetTextColor(fuelText)
    // 总里程
    const travelStack = leftStack.addStack()
    // travelStack.backgroundColor = Color.red()
    const travelText = travelStack.addText(`总里程: ${data.mileage} km`)
    travelText.font = Font.systemFont(12)
    travelText.textOpacity = 0.5
    this.setWidgetTextColor(travelText)

    // leftStack.addSpacer(5)

    // 车辆状态
    const updateStack = leftStack.addStack()
    // updateStack.backgroundColor = Color.gray()
    updateStack.layoutVertically()
    // 格式化时间
    const formatter = new DateFormatter()
    formatter.dateFormat = this.showLocation() && data.carSimpleLocation !== '暂无位置信息' ? 'MM-dd HH:mm' : 'MM月dd日 HH:mm'
    const updateDate = new Date(data.updateDate)
    const updateDateString = formatter.string(updateDate)
    const updateTimeText =
      this.showLocation() && data.carSimpleLocation !== '暂无位置信息'
        ? updateStack.addText(updateDateString + ' ' + (data.status ? '已锁车' : '未锁车'))
        : updateStack.addText('当前状态: ' + (data.status ? '已锁车' : '未锁车'))
    updateTimeText.textOpacity = 0.75
    updateTimeText.font = Font.systemFont(12)
    data.status ? this.setWidgetTextColor(updateTimeText) : updateTimeText.textColor = new Color('#FF9900', 1)
    if (!(this.showLocation() && data.carSimpleLocation !== '暂无位置信息')) {
      // updateStack.addSpacer(5)
      const updateTimeText = updateStack.addText('更新日期: ' + updateDateString)
      updateTimeText.textOpacity = 0.75
      updateTimeText.font = Font.systemFont(12)
      this.setWidgetTextColor(updateTimeText)
    }

    // 根据选项是否开启位置显示
    // data.carSimpleLocation = '测试位置测试位置测试位置位置测试位置测试位置'
    if (this.showLocation() && data.carSimpleLocation !== '暂无位置信息') {
      const carLocationStack = leftStack.addStack()
      // carLocationStack.backgroundColor = Color.red()
      carLocationStack.topAlignContent()
      carLocationStack.layoutVertically()
      carLocationStack.size = new Size(leftStack.size.width - 20, tipStackHeight * 2)

      const locationText = carLocationStack.addText(data.carSimpleLocation)
      locationText.textOpacity = 0.75
      locationText.font = Font.systemFont(12)
      this.setWidgetTextColor(locationText)
    }
    // endregion

    // region rightStack start
    const rightStack = contentStack.addStack()
    rightStack.size = new Size(contentStack.size.width / 2, contentStack.size.height)
    // rightStack.backgroundColor = Color.brown()
    rightStack.layoutVertically()

    const carPhotoStack = rightStack.addStack()
    // carPhotoStack.backgroundColor = Color.cyan()
    carPhotoStack.size = new Size(rightStack.size.width, rightStack.size.height - 14)
    const carPhotoImage = carPhotoStack.addImage(await this.getMyCarPhoto())
    carPhotoImage.imageSize = new Size(rightStack.size.width, carPhotoStack.size.height)

    // 车辆状态
    const carStatusStack = rightStack.addStack()
    carStatusStack.size = new Size(rightStack.size.width, 14)
    // carStatusStack.backgroundColor = Color.gray()

    const doorAndWindowStatus = data.doorAndWindow ? '车门车窗已关闭' : '请检查车门车窗是否已关闭'
    const carStatusText = carStatusStack.addText(doorAndWindowStatus)
    carStatusText.font = Font.systemFont(12)
    data.doorAndWindow ? this.setWidgetTextColor(carStatusText) : carStatusText.textColor = new Color('#FF9900', 1)
    // endregion

    // 祝语 height = 14
    const tipStack = widget.addStack()
    tipStack.size = widgetSize(tipStackHeight)
    // tipStack.backgroundColor = Color.blue()
    const tipText = tipStack.addText(data.myOne)
    tipText.font = Font.systemFont(12)
    tipText.centerAlignText()
    this.setWidgetTextColor(tipText)

    return widget
  }

  /**
   * 渲染大尺寸组件
   * @param {Object} data
   * @returns {Promise<ListWidget>}
   */
  async renderLarge(data) {
    const widget = new ListWidget()

    if (await this.isUsingDarkAppearance() === false && this.settings['myBackgroundPhotoLargeLight']) {
      widget.backgroundImage = await Files.readImage(this.settings['myBackgroundPhotoLargeLight'])
    } else if (await this.isUsingDarkAppearance() === true && this.settings['myBackgroundPhotoLargeDark']) {
      widget.backgroundImage = await Files.readImage(this.settings['myBackgroundPhotoLargeDark'])
    } else {
      widget.backgroundGradient = this.getBackgroundColor()
    }

    const width = data?.size?.width - 40
    const height = data?.size?.height
    const widgetSize = height => new Size(width, height)

    const headerStackHeight = 36
    const carInfoStackHeight = 160
    const tipStackHeight = 14
    const carPhotoStackHeight = height - headerStackHeight - carInfoStackHeight - tipStackHeight - 50

    // region header
    // 头部
    const headerStack = widget.addStack()
    headerStack.size = widgetSize(headerStackHeight)
    // headerStack.backgroundColor = Color.brown()

    const myCarStack = headerStack.addStack()
    myCarStack.size = new Size(width - 70, headerStack.size.height)
    myCarStack.setPadding(0, 0, 0, 0)
    // myCarStack.backgroundColor = Color.red()
    myCarStack.layoutVertically()
    const myCarText = myCarStack.addText(data.seriesName)
    myCarText.font = Font.systemFont(20)
    this.setWidgetTextColor(myCarText)

    const logoStack = headerStack.addStack()
    logoStack.size = new Size(70, headerStack.size.height)
    // logoStack.backgroundColor = Color.blue()
    logoStack.layoutVertically()

    // 显示车牌
    if (this.showPlate()) {
      const plateNoStack = logoStack.addStack()
      plateNoStack.size = new Size(logoStack.size.width, logoStack.size.height / 2)
      const plateNoText = plateNoStack.addText(data.plateNo)
      plateNoText.font = Font.systemFont(12)
      this.setWidgetTextColor(plateNoText)
    }

    const audiLogoStack = logoStack.addStack()
    audiLogoStack.size = new Size(logoStack.size.width, logoStack.size.height / 2)
    // audiLogoStack.backgroundColor = Color.orange()
    // 不显示车牌居中
    // if (!this.showPlate()) audiLogoStack.setPadding(8, 0, 8, 0)
    audiLogoStack.layoutVertically()
    const audiLogo = audiLogoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    audiLogo.imageSize = new Size(logoStack.size.width, audiLogoStack.size.height)
    this.setWidgetImageColor(audiLogo)
    // audiLogo.rightAlignImage()
    // endregion

    // region 主体信息
    const carInfoStack = widget.addStack()
    // carInfoStack.backgroundColor = Color.red()
    carInfoStack.size = widgetSize(carInfoStackHeight)
    carInfoStack.layoutVertically()

    // 车辆功率
    const powerStack = carInfoStack.addStack()
    const powerText = powerStack.addText(`功率: ${data.modelShortName}`)
    // powerStack.backgroundColor = Color.blue()
    powerText.font = Font.systemFont(14)
    this.setWidgetTextColor(powerText)

    carInfoStack.addSpacer(5)
    // 续航
    // const enduranceStack = carInfoStack.addStack()
    // const enduranceText = enduranceStack.addText(`续航: ${data.endurance} km`)
    // enduranceText.font = Font.systemFont(16)
    // this.setWidgetTextColor(enduranceText)
    // const carMetaStack2 = carInfoStack.addStack()
    // const metaText2 = carMetaStack2.addText(`汽油量: ${data.fuelLevel}%`)
    // metaText2.font = Font.systemFont(16)
    // this.setWidgetTextColor(metaText2)

    // 显示续航
    const enduranceStack = carInfoStack.addStack()
    enduranceStack.bottomAlignContent()
    // enduranceStack.backgroundColor = Color.orange()
    const enduranceText = enduranceStack.addText( `${data.endurance}km`)
    enduranceText.font = Font.heavySystemFont(20)
    this.setWidgetTextColor(enduranceText)
    // 隔断符号
    const cutFuelText = enduranceStack.addText(' / ')
    cutFuelText.font = Font.systemFont(16)
    cutFuelText.textOpacity = 0.75
    this.setWidgetTextColor(cutFuelText)
    // 燃料百分比
    const fuelText = enduranceStack.addText( `${data.fuelLevel}%`)
    fuelText.font = Font.systemFont(16)
    fuelText.textOpacity = 0.75
    this.setWidgetTextColor(fuelText)

    if (data.oilLevel) {

      carInfoStack.addSpacer(5)

      const oilStack = carInfoStack.addStack()
      // oilStack.backgroundColor = Color.blue()
      const oilText = oilStack.addText(`机油量: ${data.oilLevel}%`)
      oilText.font = Font.systemFont(14)
      oilText.textOpacity = 0.75
      this.setWidgetTextColor(oilText)
    }

    const travelText = carInfoStack.addText(`总里程: ${data.mileage} km`)
    travelText.font = Font.systemFont(14)
    travelText.textOpacity = 0.75
    this.setWidgetTextColor(travelText)

    carInfoStack.addSpacer(5)

    // 更新时间
    const updateTimeStack = carInfoStack.addStack()
    // updateTimeStack.backgroundColor = Color.red()
    // updateTimeStack.backgroundColor = new Color('#ffffff', 0.25)
    // updateTimeStack.setPadding(2, 3, 2, 3)
    // updateTimeStack.cornerRadius = 5
    // 格式化时间
    const formatter = new DateFormatter()
    formatter.dateFormat = 'yyyy-MM-dd HH:mm'
    const updateDate = new Date(data.updateDate)
    const updateDateString = formatter.string(updateDate)
    const metaText5 = updateTimeStack.addText(updateDateString + ' ' + (data.status ? '已锁车' : '未锁车'))
    metaText5.textOpacity = 0.75
    metaText5.font = Font.systemFont(12)
    data.status ? this.setWidgetTextColor(metaText5) : metaText5.textColor = new Color('#FF9900', 1)

    carInfoStack.addSpacer(5)

    // 车辆状态
    const statusStack = carInfoStack.addStack()
    // statusStack.backgroundColor = Color.orange()
    statusStack.size = widgetSize(statusStack.size.height)
    statusStack.topAlignContent()
    statusStack.layoutVertically()
    const doorAndWindowStatus = data.doorAndWindow ? '车门车窗已关闭' : '请检查车门车窗是否已关闭'
    const statusText = statusStack.addText(doorAndWindowStatus)
    statusText.font = Font.systemFont(12)
    data.doorAndWindow ? this.setWidgetTextColor(statusText) : statusText.textColor = new Color('#FF9900', 1)

    carInfoStack.addSpacer(5)

    // 地理位置
    if (this.showLocation() && data.carCompleteLocation !== '暂无位置信息') {
      const locationStack = carInfoStack.addStack()
      locationStack.topAlignContent()
      locationStack.layoutVertically()
      // locationStack.backgroundColor = Color.orange()
      locationStack.size = new Size(width - 120, 30)
      const locationText = locationStack.addText(data.carCompleteLocation)
      locationText.font = Font.systemFont(12)
      locationText.textOpacity = 0.75
      locationText.lineLimit = 2
      this.setWidgetTextColor(locationText)
    }

    carInfoStack.addSpacer(5)
    // endregion

    // region 车辆照片
    const carPhotoStack = widget.addStack()
    // carPhotoStack.backgroundColor = Color.brown()
    carPhotoStack.size = widgetSize(carPhotoStackHeight)
    const metaImage = carPhotoStack.addImage(await this.getMyCarPhoto())
    metaImage.imageSize = new Size(width - 80, carPhotoStack.size.height)
    metaImage.centerAlignImage()
    // endregion

    // region 车辆状态
    // const statusStack = widget.addStack()
    // statusStack.size = widgetSize(statusStack.size.height)
    // const doorAndWindowStatus = data.doorAndWindow ? '车门车窗已关闭' : '请检查车门车窗是否已关闭'
    // const metaText7 = statusStack.addText(doorAndWindowStatus)
    // metaText7.font = Font.systemFont(12)
    // data.doorAndWindow ? this.setWidgetTextColor(metaText7) : metaText7.textColor = new Color('#FF9900', 1)
    // endregion

    // 祝语 height = 14
    const tipStack = widget.addStack()
    tipStack.size = widgetSize(tipStackHeight)
    // tipStack.backgroundColor = Color.blue()
    const tipText = tipStack.addText(data.myOne)
    tipText.font = Font.systemFont(12)
    tipText.centerAlignText()
    this.setWidgetTextColor(tipText)

    return widget
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget()

    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO))

    const text = widget.addText('欢迎使用 Audi-Joiner iOS 桌面组件')
    switch (this.widgetFamily) {
      case 'large':
        text.font = Font.blackSystemFont(18)
        break
      case 'medium':
        text.font = Font.blackSystemFont(18)
        break
      case 'small':
        text.font = Font.blackSystemFont(12)
        break
    }
    text.centerAlignText()
    text.textColor = Color.white()

    return widget
  }

  /**
   * 渲染错误信息
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderError(data) {
    const widget = new ListWidget()
    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO))

    const text = widget.addText(data)
    switch (this.widgetFamily) {
      case 'large':
        text.font = Font.blackSystemFont(18)
        break
      case 'medium':
        text.font = Font.blackSystemFont(18)
        break
      case 'small':
        text.font = Font.blackSystemFont(12)
        break
    }
    text.textColor = Color.red()
    text.centerAlignText()

    return widget
  }

  /**
   * 渐变色
   * @returns {LinearGradient}
   */
  getBackgroundColor() {
    const bgColor = new LinearGradient()

    const lightBgColor1 = this.settings['lightBgColor1'] ? this.settings['lightBgColor1'] : DEFAULT_LIGHT_BACKGROUND_COLOR_1
    const lightBgColor2 = this.settings['lightBgColor2'] ? this.settings['lightBgColor2'] : DEFAULT_LIGHT_BACKGROUND_COLOR_2
    const darkBgColor1 = this.settings['darkBgColor1'] ? this.settings['darkBgColor1'] : DEFAULT_DARK_BACKGROUND_COLOR_1
    const darkBgColor2 = this.settings['darkBgColor2'] ? this.settings['darkBgColor2'] : DEFAULT_DARK_BACKGROUND_COLOR_2

    const startColor = Color.dynamic(new Color(lightBgColor1, 1), new Color(darkBgColor1, 1))
    const endColor = Color.dynamic(new Color(lightBgColor2, 1), new Color(darkBgColor2, 1))

    bgColor.colors = [startColor, endColor]

    bgColor.locations = [0.0, 1.0]

    return bgColor
  }

  /**
   * 处理数据业务
   * @param {Boolean} isDebug
   * @returns {Promise<{Object}>}
   */
  async bootstrap(isDebug = false) {
    try {
      const getUserMineData = JSON.parse(Keychain.get('userMineData'))
      const getVehicleData = getUserMineData.vehicleDto
      // 车辆名称
      GLOBAL_USER_DATA.seriesName = this.settings['myCarName'] ? this.settings['myCarName'] : getVehicleData?.seriesName
      // 车辆功率类型
      GLOBAL_USER_DATA.modelShortName = this.settings['myCarModelName'] ? this.settings['myCarModelName'] : getVehicleData?.carModelName
      if (getVehicleData.vin) GLOBAL_USER_DATA.vin = getVehicleData?.vin // 车架号
      if (getVehicleData.plateNo) GLOBAL_USER_DATA.plateNo = getVehicleData?.plateNo // 车牌号
    } catch (error) {
      return '获取用户信息失败，' + error
    }

    // 是否开启位置
    if (this.showLocation()) {
      try {
        const getVehiclesPosition = JSON.parse(await this.handleVehiclesPosition(isDebug))
        const getVehiclesAddress = await this.handleGetCarAddress(isDebug)
        // simple: '暂无位置信息',
        //   complete: '暂无位置信息'
        if (getVehiclesPosition.longitude) GLOBAL_USER_DATA.longitude = parseInt(getVehiclesPosition.longitude, 10) / 1000000 // 车辆经度
        if (getVehiclesPosition.latitude) GLOBAL_USER_DATA.latitude = parseInt(getVehiclesPosition.latitude, 10) / 1000000// 车辆纬度
        if (getVehiclesAddress) GLOBAL_USER_DATA.carSimpleLocation = getVehiclesAddress.simple // 简略地理位置
        if (getVehiclesAddress) GLOBAL_USER_DATA.carCompleteLocation = getVehiclesAddress.complete // 详细地理位置
      } catch (error) {
        GLOBAL_USER_DATA.longitude = -1 // 车辆经度
        GLOBAL_USER_DATA.latitude = -1 // 车辆纬度
        GLOBAL_USER_DATA.carSimpleLocation = '暂无位置信息' // 详细地理位置
        GLOBAL_USER_DATA.carCompleteLocation = '暂无位置信息' // 详细地理位置
      }
    }

    try {
      const getVehiclesStatus = await this.handleVehiclesStatus()
      const getVehicleResponseData = getVehiclesStatus?.StoredVehicleDataResponse?.vehicleData?.data
      const getVehiclesStatusArr = getVehicleResponseData ? getVehicleResponseData : []
      const getCarStatusArr = getVehiclesStatusArr.find(i => i.id === '0x0301FFFFFF')?.field
      const enduranceVal = getCarStatusArr.find(i => i.id === '0x0301030005')?.value // 燃料总行程

      // 获取机油
      const oilArr = getVehiclesStatusArr.find(i => i.id === '0x0204FFFFFF')?.field
      const oilLevelVal = oilArr ? oilArr.find(i => i.id === '0x0204040003')?.value : undefined
      // 机油信息
      if (oilLevelVal) GLOBAL_USER_DATA.oilLevel = oilLevelVal


      // 判断电车
      // 0x0301030002 = 电池
      // 0x030103000A = 燃料
      const fuelLevelVal = getCarStatusArr.find(i => i.id === '0x0301030002')?.value ? getCarStatusArr.find(i => i.id === '0x0301030002')?.value : getCarStatusArr.find(i => i.id === '0x030103000A')?.value
      const mileageVal = getVehiclesStatusArr.find(i => i.id === '0x0101010002')?.field[0]?.value // 总里程
      // 更新时间
      const updateDate = getVehiclesStatusArr.find(i => i.id === '0x0101010002')?.field[0]?.tsCarSentUtc

      // 检查门锁 车门 车窗等状态
      const isLocked = await this.getCarIsLocked(getCarStatusArr)
      const doorStatusArr = await this.getCarDoorStatus(getCarStatusArr)
      const windowStatusArr = await this.getCarWindowStatus(getCarStatusArr)
      const equipmentStatusArr = [...doorStatusArr, ...windowStatusArr].map(i => i.name)
      // NEDC 续航 单位 km
      if (enduranceVal) GLOBAL_USER_DATA.endurance = enduranceVal
      // 燃料 单位百分比
      if (fuelLevelVal) GLOBAL_USER_DATA.fuelLevel = fuelLevelVal
      // 总里程
      if (mileageVal) GLOBAL_USER_DATA.mileage = mileageVal
      if (updateDate) GLOBAL_USER_DATA.updateDate = updateDate
      // 车辆状态 true = 已锁车
      GLOBAL_USER_DATA.status = isLocked
      // true 车窗已关闭 | false 请检查车窗是否关闭
      if (equipmentStatusArr) GLOBAL_USER_DATA.doorAndWindow = equipmentStatusArr.length === 0
    } catch (error) {
      return error
    }

    if (this.settings['myOne']) GLOBAL_USER_DATA.myOne = this.settings['myOne'] // 一言

    return GLOBAL_USER_DATA
  }

  /**
   * 获取数据
   */
  async getData() {
    // 判断用户是否已经登录
    return Keychain.contains('userBaseInfoData') ? await this.bootstrap() : false
  }

  /**
   * 获取车辆锁车状态
   * @param {Array} arr
   * @return Promise<{boolean}> true = 锁车 false = 没有完全锁车
   */
  async getCarIsLocked (arr) {
    // 先判断车辆是否锁定
    const lockArr = ['0x0301040001', '0x0301040004', '0x0301040007', '0x030104000A', '0x030104000D']
    // 筛选出对应的数组
    const filterArr = arr.filter(item => lockArr.some(i => i === item.id))
    // 判断是否都锁门
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
  async getCarDoorStatus (arr) {
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
    const result = filterArr.filter(item => item.value === '2')
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
  async getCarWindowStatus (arr) {
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
    const result = filterArr.filter(item => item.value === '2')
    // 返回开门的数组
    return windowArr.filter(i => result.some(x => x.id === i.id))
  }

  /**
   * 获取用户车辆照片
   * @returns {Promise<Image|*>}
   */
  async getMyCarPhoto() {
    let myCarPhoto = await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO)
    if (this.settings['myCarPhoto']) myCarPhoto = await Files.readImage(this.settings['myCarPhoto'])
    return myCarPhoto
  }

  /**
   * 登录奥迪服务器
   * @param {boolean} isDebug
   * @returns {Promise<void>}
   */
  async handleAudiLogin(isDebug = false) {
    if (isDebug || !Keychain.contains('userBaseInfoData')) {
      const options = {
        url: AUDI_SERVER_API.login,
        method: 'POST',
        headers: REQUEST_HEADER,
        body: JSON.stringify({
          loginChannelEnum: 'APP',
          loginTypeEnum: 'ACCOUNT_PASSWORD',
          account: this.settings['username'],
          password: this.settings['password']
        })
      }
      const response = await this.http(options)
      if (isDebug) console.log('获取登陆信息:')
      if (isDebug) console.log(response)
      // 判断接口状态
      if (response.code === 0) {
        // 登录成功 存储登录信息
        console.log('登陆成功')
        Keychain.set('userBaseInfoData', JSON.stringify(response.data))
        await this.notify('登录成功', '正在从 Audi 服务器获取车辆数据，请耐心等待！')
        // 准备交换验证密钥数据
        await this.handleAudiGetToken('userIDToken', isDebug)
        await this.handleUserMineData(isDebug)
      } else {
        // 登录异常
        await this.notify('登录失败', response.message)
        console.error('用户登录失败：' + response.message)
      }
    } else {
      // 已存在用户信息
      if (isDebug) console.log('检测本地缓存已有登陆数据:')
      if (isDebug) console.log(Keychain.get('userBaseInfoData'))
      await this.handleAudiGetToken('userIDToken')
      await this.handleUserMineData()
    }
  }

  /**
   * 获取车辆基本信息
   * 该接口返回绑定车辆的侧身照片，不过有白底背景
   * 后期可以利用抠图api完善
   * @returns {Promise<void>}
   */
   async handleQueryDefaultVehicleData() {
    if (!Keychain.contains('defaultVehicleData')) {
      if (!Keychain.contains('userBaseInfoData')) {
        return console.error('获取密钥数据失败，没有拿到用户登录信息，请重新登录再重试！')
      }
      const getUserBaseInfoData =JSON.parse(Keychain.get('userBaseInfoData'))
      //服务器获取签名
      const signOptions = {
        url: SIGN_SERVER_API.sign,
        method: 'POST',
        headers: {
          ...{
            Platform : '1'
          },
          ...REQUEST_HEADER
        }
      }
      const signatureREesponse = await this.http(signOptions)
      if (signatureREesponse.code !== 0){
        return console.error(signatureREesponse.data)
      } else{
        const data = signatureREesponse.data
        const options = {
          url: AUDI_SERVER_API.vehicleServer(data.appkey, data.nonce, data.sign, data.signt),
          method: 'GET',
          headers: {
            ...{
              token: 'Bearer ' + getUserBaseInfoData.accessToken
            },
            ...REQUEST_HEADER
          }
        }
        const response = await this.http(options)
        // 判断接口状态
        if (response.status === 'SUCCEED') {
          // 存储车辆信息
          console.log(response)
          // Keychain.set('defaultVehicleData', JSON.stringify(response.data))
          // Keychain.set('myCarVIN', response.data?.vin)
          console.log('车辆基本信息获取成功')
          // 准备交换验证密钥数据
          await this.handleAudiGetToken('userRefreshToken')
        } else {
          // 获取异常
          await console.error('车辆信息获取失败，请稍后重新登录再重试！')
        }
      }
    }
  }

  /**
   * 获取用户信息
   * @param {boolean} isDebug
   * @returns {Promise<void>}
   */
  async handleUserMineData(isDebug = false) {
    if (isDebug || !Keychain.contains('userMineData')) {
      const getUserBaseInfoData =JSON.parse(Keychain.get('userBaseInfoData'))
      const options = {
        url: AUDI_SERVER_API.mine,
        method: 'GET',
        headers: {
          ...{
            'X-ACCESS-TOKEN': getUserBaseInfoData.accessToken,
            'X-CHANNEL': 'IOS',
            'x-mobile': getUserBaseInfoData.user.mobile
          },
          ...REQUEST_HEADER
        }
      }
      const response = await this.http(options)
      if (isDebug) console.log('获取用户信息：')
      if (isDebug) console.log(response)
      // 判断接口状态
      if (response.code === 0) {
        // 存储车辆信息
        console.log('获取用户基本信息成功')
        Keychain.set('userMineData', JSON.stringify(response.data))
        Keychain.set('myCarVIN', response.data?.vehicleDto?.vin)
        // 准备交换验证密钥数据
        await this.handleAudiGetToken('userRefreshToken', isDebug)
      } else {
        // 获取异常
        console.error('获取用户基本信息失败，准备重新登录获取密钥')
        if (Keychain.contains('userBaseInfoData')) Keychain.remove('userBaseInfoData')
        // 重新登录
        await this.handleAudiLogin(isDebug)
      }
    } else {
      console.log('userMineData 信息已存在，开始获取 userRefreshToken')
      if (isDebug) console.log(Keychain.get('userMineData'))
      await this.handleAudiGetToken('userRefreshToken')
    }
  }

  /**
   * 获取密钥数据
   * @param {'userIDToken' | 'userRefreshToken'} type
   * @param {boolean} isDebug
   * @returns {Promise<void>}
   */
  async handleAudiGetToken(type, isDebug = false) {
    if (isDebug || !Keychain.contains(type)) {
      if (type === 'userIDToken' && !Keychain.contains('userBaseInfoData')) {
        return console.error('获取密钥数据失败，没有拿到用户登录信息，请重新登录再重试！')
      }
      if (type === 'userRefreshToken' && !Keychain.contains('userIDToken')) {
        return console.error('获取密钥数据失败，没有拿到用户 ID Token，请重新登录再重试！')
      }

      // 根据交换token请求参数不同
      let requestParams = ''
      const getUserBaseInfoData = JSON.parse(Keychain.get('userBaseInfoData'))
      switch (type) {
        case 'userIDToken':
          requestParams = `grant_type=${encodeURIComponent('id_token')}&token=${encodeURIComponent(getUserBaseInfoData.idToken)}&scope=${encodeURIComponent('sc2:fal')}`
          break
        case 'userRefreshToken':
          const getUserIDToken =JSON.parse(Keychain.get('userIDToken'))
          requestParams = `grant_type=${encodeURIComponent('refresh_token')}&token=${encodeURIComponent(getUserIDToken.refresh_token)}&scope=${encodeURIComponent('sc2:fal')}&vin=${Keychain.get('myCarVIN')}`
          break
      }

      const options = {
        url: AUDI_SERVER_API.token,
        method: 'POST',
        headers: {
          'X-Client-ID': 'de6d8b23-792f-47b8-82f4-e4cc59c2916e',
          'User-Agent': 'MyAuDi/3.0.2 CFNetwork/1325.0.1 Darwin/21.1.0',
        },
        body: requestParams
      }
      const response = await this.http(options)
      if (isDebug) console.log('用户密钥信息：')
      if (isDebug) console.log(response)
      // 判断接口状态
      if (response.error) {
        switch (response.error) {
          case 'invalid_grant':
            console.error('IDToken 数据过期，正在重新获取数据中，请耐心等待...')
            await this.handleAudiGetToken('userIDToken', true)
            break
        }
      } else {
        // 获取密钥数据成功，存储数据
        Keychain.set(type, JSON.stringify(response))
        console.log('当前密钥数据获取成功：' + type)
        if (type === 'userRefreshToken') {
          Keychain.set('authToken', response.access_token)
          console.log('authToken 密钥设置成功')
          // 正式获取车辆信息
          await this.bootstrap(isDebug)
        }
      }
    } else {
      // 已存在的时候
      console.log(type + ' 信息已存在，开始 bootstrap() 函数')
      if (type === 'userRefreshToken') await this.bootstrap()
    }
  }

  /**
   * 获取车辆当前状态
   * 需要实时获取
   * @param {boolean} isDebug
   * @returns {Promise<string | void>}
   */
  async handleVehiclesStatus(isDebug = false) {
    let url = AUDI_SERVER_API.mal1aVehiclesStatus
    switch (this.settings['compatibilityMode']) {
      case 'standard':
        url = AUDI_SERVER_API.mal1aVehiclesStatus
        break
      case 'compatible':
        url = AUDI_SERVER_API.mal3aVehiclesStatus
        break
    }

    const options = {
      url: url(Keychain.get('myCarVIN')),
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + Keychain.get('authToken'),
          'X-App-Name': 'MyAuDi',
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...REQUEST_HEADER
      }
    }
    const response = await this.http(options)
    if (isDebug) console.log('获取车辆状态信息：')
    if (isDebug) console.log(response)
    // 判断接口状态
    if (response.error) {
      // 接口异常
      console.error('vehiclesStatus 接口异常' + response.error.errorCode + ' - ' + response.error.description)
      switch (response.error.errorCode) {
        case 'gw.error.authentication':
          console.error('获取车辆状态失败 error: ' + response.error.errorCode)
          await this.handleAudiGetToken('userRefreshToken', true)
          await this.handleVehiclesStatus()
          break
        case 'mbbc.rolesandrights.unauthorized':
          await this.notify('unauthorized 错误', '请检查您的车辆是否已经开启车联网服务，请到一汽奥迪应用查看！')
          break
        case 'mbbc.rolesandrights.unknownService':
          await this.notify('unknownService 错误', '请到菜单「路线配置」更换对应车型路线！')
          break
        case 'mbbc.rolesandrights.unauthorizedUserDisabled':
          // todo 错误
          await this.notify('unauthorizedUserDisabled 错误', '')
          break
        default:
          await this.notify('未知错误' + response.error.errorCode, '未知错误:' + response.error.description)
      }
      if (Keychain.contains('vehiclesStatusResponse')) {
        return JSON.parse(Keychain.get('vehiclesStatusResponse'))
      }
    } else {
      // 接口获取数据成功
      Keychain.set('vehiclesStatusResponse', JSON.stringify(response))
      return response
    }
  }

  /**
   * 获取车辆当前经纬度
   * 需要实时获取
   * @param {boolean} isDebug
   * @returns {Promise<string>}
   */
  async handleVehiclesPosition(isDebug = false) {
    let url = AUDI_SERVER_API.mal1aVehiclesPosition
    switch (this.settings['compatibilityMode']) {
      case 'standard':
        url = AUDI_SERVER_API.mal1aVehiclesPosition
        break
      case 'compatible':
        url = AUDI_SERVER_API.mal3aVehiclesPosition
        break
    }

    const options = {
      url: url(Keychain.get('myCarVIN')),
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + Keychain.get('authToken'),
          'X-App-Name': 'MyAuDi',
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...REQUEST_HEADER
      }
    }
    let response = {}

    try {
      response = await this.http(options)
    } catch (error) {
      return '暂无位置'
    }

    if (isDebug) console.log('获取车辆位置信息：')
    if (isDebug) console.log(response)
    // 判断接口状态
    if (response.error) {
      // 接口异常
      console.error('vehiclesPosition 接口异常' + response.error.errorCode + ' - ' + response.error.description)
      switch (response.error.errorCode) {
        case 'gw.error.authentication':
          console.error('获取车辆位置失败 error: ' + response.error.errorCode)
          await this.handleAudiGetToken('userRefreshToken', true)
          await this.handleVehiclesPosition()
          break
        case 'CF.technical.9031':
          console.error('获取数据超时，稍后再重试')
          break
        case 'mbbc.rolesandrights.servicelocallydisabled':
          // 本地车辆定位服务未开启
          return '请检查车辆位置是否开启'
      }
    } else {
      // 接口获取数据成功储存接口数据
      if (response.storedPositionResponse) {
        Keychain.set('storedPositionResponse', JSON.stringify(response))
        Keychain.set('carPosition', JSON.stringify({
          longitude: response.storedPositionResponse.position.carCoordinate.longitude,
          latitude: response.storedPositionResponse.position.carCoordinate.latitude
        }))
      } else if (response.findCarResponse) {
        Keychain.set('findCarResponse', JSON.stringify(response))
        Keychain.set('carPosition', JSON.stringify({
          longitude: response.findCarResponse.Position.carCoordinate.longitude,
          latitude: response.findCarResponse.Position.carCoordinate.latitude
        }))
      }
      return Keychain.get('carPosition')
    }
  }

  /**
   * 获取车辆地址
   * @param {Boolean} isDebug
   * @returns {Promise<{simple: string, complete: string}>}
   */
  async handleGetCarAddress(isDebug = false) {
    if (!Keychain.contains('storedPositionResponse') && !Keychain.contains('carPosition')) {
      await console.error('获取车辆经纬度失败，请退出登录再登录重试！')
      return {
        simple: '暂无位置信息',
        complete: '暂无位置信息'
      }
    }
    const carPosition = JSON.parse(Keychain.get('carPosition'))
    const longitude = parseInt(carPosition.longitude, 10) / 1000000
    const latitude = parseInt(carPosition.latitude, 10) / 1000000

    // longitude latitude 可能会返回负数的问题
    // 直接返回缓存数据
    if (longitude < 0 || latitude < 0) return { simple: '暂无位置信息', complete: '暂无位置信息' }

    const aMapKey = this.settings['aMapKey'] ? this.settings['aMapKey'] : AUDI_AMAP_KEY
    const options = {
      url: `https://restapi.amap.com/v3/geocode/regeo?key=${aMapKey}&location=${longitude},${latitude}&radius=1000&extensions=base&batch=false&roadlevel=0`,
      method: 'GET'
    }
    const response = await this.http(options)
    if (isDebug) console.log('车辆地理位置信息：')
    if (isDebug) console.log(response)
    if (response.status === '1') {
      const addressComponent = response.regeocode.addressComponent
      const simpleAddress = addressComponent.city + addressComponent.district + addressComponent.township
      const completeAddress = response.regeocode.formatted_address
      Keychain.set('carSimpleAddress', simpleAddress)
      Keychain.set('carCompleteAddress', completeAddress)
      return {
        simple: simpleAddress,
        complete: completeAddress
      }
    } else {
      console.error('获取车辆位置失败，请检查高德地图 key 是否填写正常')
      if (Keychain.contains('carSimpleAddress') && Keychain.get('carCompleteAddress')) {
        return {
          simple: Keychain.get('carSimpleAddress'),
          complete: Keychain.get('carCompleteAddress')
        }
      } else {
        return {
          simple: '暂无位置信息',
          complete: '暂无位置信息'
        }
      }
    }
  }

  /**
   * 组件声明
   * @returns {Promise<void>}
   */
  async actionStatementSettings () {
    const alert = new Alert()
    alert.title = '组件声明'
    alert.message = `
    小组件需要使用到您的一汽大众应用的账号，首次登录请配置账号、密码进行令牌获取\n\r
    小组件不会收集您的个人账户信息，所有账号信息将存在 iCloud 或者 iPhone 上但也请您妥善保管自己的账号\n\r
    小组件是开源、并且完全免费的，由奥迪车主开发，所有责任与一汽奥迪公司无关\n\r
    开发者: 淮城一只猫\n\r
    温馨提示：由于一汽奥迪应用支持单点登录，即不支持多终端应用登录，建议在一汽奥迪应用「用车 - 更多功能 - 用户管理」进行添加用户，这样组件和应用独立执行。
    `
    alert.addAction('同意')
    alert.addCancelAction('不同意')
    const id = await alert.presentAlert()
    if (id === -1) return
    await this.actionAccountSettings()
  }

  /**
   * 设置账号数据
   * @returns {Promise<void>}
   */
  async actionAccountSettings() {
    const alert = new Alert()
    alert.title = '一汽奥迪账户登录'
    alert.message = '登录一汽奥迪账号展示车辆数据'
    alert.addTextField('一汽奥迪账号', this.settings['username'])
    alert.addSecureTextField('一汽奥迪密码', this.settings['password'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return
    this.settings['username'] = alert.textFieldValue(0)
    this.settings['password'] = alert.textFieldValue(1)
    this.saveSettings()
    console.log('开始进行用户登录')
    await this.handleAudiLogin()
  }

  /**
   * 偏好设置
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings () {
    const alert = new Alert()
    alert.title = '组件个性化配置'
    alert.message = '根据您的喜好设置，更好展示组件数据'

    const menuList = [
      {
        name: 'myCarName',
        text: '自定义车辆名称',
        icon: '💡'
      }, {
        name: 'myCarModelName',
        text: '自定义车辆功率',
        icon: '🛻'
      }, {
        name: 'myCarPhoto',
        text: '自定义车辆照片',
        icon: '🚙'
      }, {
        name: 'setBackgroundConfig',
        text: '自定义组件背景',
        icon: '🎨'
      }, {
        name: 'myOne',
        text: '一言一句',
        icon: '📝'
      }, {
        name: 'aMapKey',
        text: '高德地图密钥',
        icon: '🎯'
      }, {
        name: 'showLocation',
        text: '设置车辆位置',
        icon: '✈️'
      }, {
        name: 'showPlate',
        text: '设置车牌显示',
        icon: '🚘'
      }
    ]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this['actionPreferenceSettings' + id]()
  }

  /**
   * 自定义车辆名称
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings0() {
    const alert = new Alert()
    alert.title = '车辆名称'
    alert.message = '如果您不喜欢系统返回的名称可以自己定义名称'
    alert.addTextField('请输入自定义名称', this.settings['myCarName'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarName'] = alert.textFieldValue(0)
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆功率
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings1() {
    const alert = new Alert()
    alert.title = '车辆功率'
    alert.message = '如果您的车子是改装过的，可以自定义功率类型，不填为系统默认'
    alert.addTextField('请输入自定义功率', this.settings['myCarModelName'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarModelName'] = alert.textFieldValue(0)
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆图片
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings2() {
    const alert = new Alert()
    alert.title = '车辆图片'
    alert.message = '请在相册选择您最喜欢的车辆图片以便展示到小组件上，最好是全透明背景PNG图。'
    alert.addAction('选择照片')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    try {
      const image = await Photos.fromLibrary()
      await Files.writeImage(this.filePath('myCarPhoto'), image)
      this.settings['myCarPhoto'] = this.filePath('myCarPhoto')
      this.saveSettings()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 自定义组件背景
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings3() {
    const alert = new Alert()
    alert.title = '自定义组件背景'
    alert.message = '颜色背景和图片背景共同存存在时，图片背景设置优先级更高，将会加载图片背景\n' +
      '只有清除组件背景图片时候颜色背景才能生效！'

    const menuList = [{
      text: '设置颜色背景',
      icon: '🖍'
    }, {
      text: '设置图片背景',
      icon: '🏞'
    }, {
      text: '返回上一级',
      icon: '👈'
    }]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this['backgroundSettings' + id]()
  }

  /**
   * 设置组件颜色背景
   * @returns {Promise<void>}
   */
  async backgroundSettings0() {
    const alert = new Alert()
    alert.title = '自定义颜色背景'
    alert.message = '系统浅色模式适用于白天情景\n' +
      '系统深色模式适用于晚上情景\n' +
      '请根据自己的偏好进行设置'

    const menuList = [{
      text: '系统浅色模式',
      icon: '🌕'
    }, {
      text: '系统深色模式',
      icon: '🌑'
    }, {
      text: '返回上一级',
      icon: '👈'
    }]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this['backgroundColorSettings' + id]()
  }

  /**
   * 设置组件图片背景
   * @returns {Promise<void>}
   */
  async backgroundSettings1() {
    const alert = new Alert()
    alert.title = '自定义图片背景'
    alert.message = '目前自定义图片背景可以设置下列俩种场景\n' +
      '透明背景：因为组件限制无法实现，目前使用桌面图片裁剪实现所谓对透明组件，设置之前需要先对桌面壁纸进行裁剪哦，请选择「裁剪壁纸」菜单进行获取透明背景图片\n' +
      '图片背景：选择您最喜欢的图片作为背景'

    const menuList = [{
      text: '裁剪壁纸',
      icon: '🌅'
    }, {
      text: '自选图片',
      icon: '🌄'
    }, {
      text: '字体颜色',
      icon: '✍️'
    }, {
      text: '移除图片',
      icon: '🪣'
    }, {
      text: '返回上一级',
      icon: '👈'
    }]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this['backgroundImageSettings' + id]()
  }

  /**
   * 返回上一级菜单
   * @returns {Promise<void>}
   */
  async backgroundSettings2() {
    return await this.actionPreferenceSettings()
  }

  /**
   * 浅色模式背景
   * @returns {Promise<void>}
   */
  async backgroundColorSettings0() {
    const alert = new Alert()
    alert.title = '浅色模式颜色代码'
    alert.message = '如果都输入相同的颜色代码小组件则是纯色背景色，如果是不同的代码则是渐变背景色，不填写采取默认背景色\n\r' +
      '默认背景颜色代码：' + DEFAULT_LIGHT_BACKGROUND_COLOR_1 + ' 和 ' + DEFAULT_LIGHT_BACKGROUND_COLOR_2 + '\n\r' +
      '默认字体颜色代码：#000000'
    alert.addTextField('背景颜色代码一', this.settings['lightBgColor1'])
    alert.addTextField('背景颜色代码二', this.settings['lightBgColor2'])
    alert.addTextField('字体颜色', this.settings['lightTextColor'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.backgroundSettings0()
    const lightBgColor1 = alert.textFieldValue(0)
    const lightBgColor2 = alert.textFieldValue(1)
    const lightTextColor = alert.textFieldValue(2)

    this.settings['lightBgColor1'] = lightBgColor1
    this.settings['lightBgColor2'] = lightBgColor2
    this.settings['lightTextColor'] = lightTextColor
    this.saveSettings()

    return await this.backgroundSettings0()
  }

  /**
   * 深色模式背景
   * @returns {Promise<void>}
   */
  async backgroundColorSettings1() {
    const alert = new Alert()
    alert.title = '深色模式颜色代码'
    alert.message = '如果都输入相同的颜色代码小组件则是纯色背景色，如果是不同的代码则是渐变背景色，不填写采取默认背景色\n\r' +
      '默认背景颜色代码：' + DEFAULT_DARK_BACKGROUND_COLOR_1 + ' 和 ' + DEFAULT_DARK_BACKGROUND_COLOR_2 + '\n\r' +
      '默认字体颜色代码：#ffffff'
    alert.addTextField('颜色代码一', this.settings['darkBgColor1'])
    alert.addTextField('颜色代码二', this.settings['darkBgColor2'])
    alert.addTextField('字体颜色', this.settings['darkTextColor'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.backgroundSettings0()
    const darkBgColor1 = alert.textFieldValue(0)
    const darkBgColor2 = alert.textFieldValue(1)
    const darkTextColor = alert.textFieldValue(2)

    this.settings['darkBgColor1'] = darkBgColor1
    this.settings['darkBgColor2'] = darkBgColor2
    this.settings['darkTextColor'] = darkTextColor
    this.saveSettings()

    return await this.backgroundSettings0()
  }

  /**
   * 返回上一级菜单
   * @return {Promise<void>}
   */
  async backgroundColorSettings2() {
    return await this.actionPreferenceSettings3()
  }

  /**
   * 剪裁壁纸
   * @returns {Promise<void>}
   */
  async backgroundImageSettings0() {
    let message = '开始之前，请转到主屏幕并进入桌面编辑模式，滚动到最右边的空页面，然后截图！'
    const exitOptions = ['前去截图', '继续']
    const shouldExit = await this.generateAlert(message, exitOptions)
    if (!shouldExit) return

    // Get screenshot and determine phone size.
    try {
      const img = await Photos.fromLibrary()
      const height = img.size.height
      console.log('壁纸图片属性：')
      console.log(img)
      console.log(height)
      const phone = this.phoneSizes()[height]
      if (!phone) {
        message = '您选择的照片好像不是正确的截图，或者您的机型暂时不支持。'
        await this.generateAlert(message,['OK'])
        return await this.backgroundSettings1()
      }

      // Prompt for widget size and position.
      message = '您创建组件的是什么规格？'
      const sizes = ['小组件', '中组件', '大组件']
      const _sizes = ['Small', 'Medium', 'Large']
      const size = await this.generateAlert(message, sizes)
      const widgetSize = _sizes[size]

      message = '在桌面上组件存在什么位置？'
      message += (height === 1136 ? ' （备注：当前设备只支持两行小组件，所以下边选项中的「中间」和「底部」的选项是一致的）' : '')

      // Determine image crop based on phone size.
      const crop = { w: '', h: '', x: '', y: '' }
      let positions = ''
      let _positions = ''
      let position = ''
      switch (widgetSize) {
        case 'Small':
          crop.w = phone.small
          crop.h = phone.small
          positions = ['Top left', 'Top right', 'Middle left', 'Middle right', 'Bottom left', 'Bottom right']
          _positions = ['左上角', '右上角', '中间左', '中间右', '左下角', '右下角']
          position = await this.generateAlert(message, _positions)

          // Convert the two words into two keys for the phone size dictionary.
          const keys = positions[position].toLowerCase().split(' ')
          crop.y = phone[keys[0]]
          crop.x = phone[keys[1]]
          break
        case 'Medium':
          crop.w = phone.medium
          crop.h = phone.small

          // Medium and large widgets have a fixed x-value.
          crop.x = phone.left
          positions = ['Top', 'Middle', 'Bottom']
          _positions = ['顶部', '中部', '底部']
          position = await this.generateAlert(message, _positions)
          const key = positions[position].toLowerCase()
          crop.y = phone[key]
          break
        case 'Large':
          crop.w = phone.medium
          crop.h = phone.large
          crop.x = phone.left
          positions = ['Top', 'Bottom']
          _positions = ['顶部', '底部']
          position = await this.generateAlert(message, _positions)

          // Large widgets at the bottom have the 'middle' y-value.
          crop.y = position ? phone.middle : phone.top
          break
      }

      // 系统外观模式
      message = '您要在系统外观设置什么模式？'
      const _modes = ['浅色模式', '深色模式']
      const modes = ['Light', 'Dark']
      const mode = await this.generateAlert(message, _modes)
      const widgetMode = modes[mode]

      // Crop image and finalize the widget.
      const imgCrop = this.cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))

      await Files.writeImage(this.filePath('myBackgroundPhoto' + widgetSize + widgetMode), imgCrop)
      this.settings['myBackgroundPhoto' + widgetSize + widgetMode] = this.filePath('myBackgroundPhoto' + widgetSize + widgetMode)
      this.saveSettings()
      await this.backgroundSettings1()
    } catch (error) {
      // 取消图片会异常 暂时不用管
      console.error(error)
    }
  }

  /**
   * 自选图片
   * @returns {Promise<void>}
   */
  async backgroundImageSettings1() {
    try {
      let message = '您创建组件的是什么规格？'
      const sizes = ['小组件', '中组件', '大组件']
      const _sizes = ['Small','Medium','Large']
      const size = await this.generateAlert(message, sizes)
      const widgetSize = _sizes[size]

      // 系统外观模式
      message = '您要在系统外观设置什么模式？'
      const _modes = ['浅色模式', '深色模式']
      const modes = ['Light', 'Dark']
      const mode = await this.generateAlert(message, _modes)
      const widgetMode = modes[mode]

      const image = await Photos.fromLibrary()
      await Files.writeImage(this.filePath('myBackgroundPhoto' + widgetSize + widgetMode), image)
      this.settings['myBackgroundPhoto' + widgetSize + widgetMode] = this.filePath('myBackgroundPhoto' + widgetSize + widgetMode)
      this.saveSettings()
      await this.backgroundSettings1()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 设置字体颜色
   * @return {Promise<void>}
   */
  async backgroundImageSettings2() {
    const alert = new Alert()
    alert.title = '字体颜色'
    alert.message = '仅在设置图片背景情境下进行对字体颜色更改，字体规格：#ffffff'
    alert.addTextField('请输入浅色模式字体颜色值', this.settings['backgroundImageLightTextColor'])
    alert.addTextField('请输入深色模式字体颜色值', this.settings['backgroundImageDarkTextColor'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.backgroundSettings1()
    this.settings['backgroundImageLightTextColor'] = alert.textFieldValue(0)
    this.settings['backgroundImageDarkTextColor'] = alert.textFieldValue(1)
    this.saveSettings()

    return await this.backgroundSettings1()
  }

  /**
   * 移除背景图片
   * @return {Promise<void>}
   */
  async backgroundImageSettings3() {
    this.settings['myBackgroundPhotoSmallLight'] = undefined
    this.settings['myBackgroundPhotoSmallDark'] = undefined
    this.settings['myBackgroundPhotoMediumLight'] = undefined
    this.settings['myBackgroundPhotoMediumDark'] = undefined
    this.settings['myBackgroundPhotoLargeLight'] = undefined
    this.settings['myBackgroundPhotoLargeDark'] = undefined
    this.saveSettings()
    await this.backgroundSettings1()
  }

  /**
   * 返回上一级菜单
   * @return {Promise<void>}
   */
  async backgroundImageSettings4() {
    return await this.actionPreferenceSettings3()
  }

  /**
   * 输入一言
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings4() {
    const alert = new Alert()
    alert.title = '输入一言'
    alert.message = '请输入一言，将会在桌面展示语句，不填则显示 "世间美好，与您环环相扣"'
    alert.addTextField('请输入一言', this.settings['myOne'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    const value = alert.textFieldValue(0)
    if (!value) {
      this.settings['myOne'] = GLOBAL_USER_DATA.myOne
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }

    this.settings['myOne'] = value
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 高德地图Key
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings5() {
    const alert = new Alert()
    alert.title = '高德地图密钥'
    alert.message = '请输入组件所需要的高德地图 key 用于车辆逆地理编码以及地图资源\n\r获取途径可以在「关于小组件」菜单里加微信群进行咨询了解'
    alert.addTextField('key 密钥', this.settings['aMapKey'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) {
      this.settings['aMapKey'] = AUDI_AMAP_KEY
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    this.settings['aMapKey'] = alert.textFieldValue(0)
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 车辆位置显示
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings6() {
    const alert = new Alert()
    alert.title = '是否显示车辆地理位置'
    alert.message = this.showLocation() ? '当前地理位置状态已开启' : '当前地理位置状态已关闭'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    if (id === -1) {
      // 关闭显示位置
      this.settings['showLocation'] = false
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    // 开启显示位置
    this.settings['showLocation'] = true
    this.saveSettings()
    return await this.actionPreferenceSettings()
  }

  /**
   * 车牌显示
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings7() {
    const alert = new Alert()
    alert.title = '是否显示车牌显示'
    alert.message = this.showPlate() ? '当前车牌显示状态已开启' : '当前车牌显示状态已关闭'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    if (id === -1) {
      // 关闭车牌显示
      this.settings['showPlate'] = false
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    // 开启车牌显示
    this.settings['showPlate'] = true
    this.saveSettings()
    return await this.actionPreferenceSettings()
  }

  /**
   * 兼容配置
   * @returns {Promise<void>}
   */
  async actionCompatible() {
    const alert = new Alert()
    alert.title = '路线配置'
    alert.message = '标准路线：支持绝大部分车型\n' +
      '其它模式：A3、部分A6车型、Q3、Q7车主'

    const menuList = [{
      name: 'standard',
      text: '标准路线'
    }, {
      name: 'compatible',
      text: '其它模式'
    }]

    const mode = this.settings['compatibilityMode'] ? this.settings['compatibilityMode'] : 'standard'
    menuList.forEach(item => {
      alert.addAction(mode === item.name ? '✅' + ' ' + item.text : '❌' + ' ' + item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    this.settings['compatibilityMode'] = menuList[id].name
    this.saveSettings()
  }

  /**
   * 登出系统
   * @returns {Promise<void>}
   */
  async actionLogOut() {
    const alert = new Alert()
    alert.title = '退出账号'
    alert.message = '您所登录的账号包括缓存本地的数据将全部删除，请慎重操作。'
    alert.addAction('登出')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return

    const keys = [
      'userBaseInfoData',
      'defaultVehicleData',
      'userMineData',
      'myCarVIN',
      'authToken',
      'userIDToken',
      'userRefreshToken',
      'storedPositionResponse',
      'findCarResponse',
      'carPosition',
      'carSimpleAddress',
      'carCompleteAddress',
      'vehiclesStatusResponse',
      this.SETTING_KEY
    ]
    keys.forEach(key => {
      if (Keychain.contains(key)) {
        Keychain.remove(key)
        console.log(key + ' 缓存信息已删除')
      }
    })
    await this.notify('登出成功', '敏感信息已全部删除')
  }

  /**
   * 点击检查更新操作
   * @returns {Promise<void>}
   */
  async actionCheckUpdate() {
    const UPDATE_FILE = 'Audi-Joiner.js'
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    const request = new Request('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/audi-version.json')
    const response = await request.loadJSON()
    console.log(`远程版本：${response?.version}`)
    if (response?.version === AUDI_VERSION) return this.notify('无需更新', '远程版本一致，暂无更新')
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
   * 捐赠开发者
   * @returns {Promise<void>}
   */
  async actionDonation() {
    Safari.open( 'https://audi.i95.me/donation.html')
  }

  /**
   * 关于组件
   * @returns {Promise<void>}
   */
  async actionAbout() {
    Safari.open( 'https://audi.i95.me/about.html')
  }

  /**
   * 重载数据
   * @return {Promise<void>}
   */
  async actionLogAction() {
    const alert = new Alert()
    alert.title = '重载数据'
    alert.message = '如果发现数据延迟，选择对应函数获取最新数据，同样也是获取日志分享给开发者使用。'

    const menuList = [{
      name: 'bootstrap',
      text: '全部数据'
    }, {
      name: 'handleAudiLogin',
      text: '登陆数据'
    }, {
      name: 'handleUserMineData',
      text: '用户信息数据'
    }, {
      name: 'handleVehiclesStatus',
      text: '当前车辆状态数据'
    }, {
      name: 'handleVehiclesPosition',
      text: '车辆经纬度数据'
    }, {
      name: 'getDeviceInfo',
      text: '获取设备信息'
    }]

    menuList.forEach(item => {
      alert.addAction(item.text)
    })

    alert.addCancelAction('退出菜单')
    const id = await alert.presentSheet()
    if (id === -1) return
    // 执行函数
    await this[menuList[id].name](true)
  }

  /**
   * 获取设备信息
   * @return {Promise<void>}
   */
  async getDeviceInfo() {
    const data = {
      systemVersion: Device.model() + ' ' + Device.systemName() + ' ' + Device.systemVersion(), // 系统版本号
      screenSize: Device.screenSize(), // 屏幕尺寸
      screenResolution: Device.screenResolution(), // 屏幕分辨率
      screenScale: Device.screenScale(), // 屏幕比例
      version: AUDI_VERSION // 版本号
    }
    console.log(JSON.stringify(data))
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl(url) {
    await Safari.openInApp(url, false)
  }

  /**
   * 判断系统外观模式
   * @return {Promise<boolean>}
   */
  async isUsingDarkAppearance() {
    return !(Color.dynamic(Color.white(), Color.black()).red)
  }

  /**
   * Alert 弹窗封装
   * @param message
   * @param options
   * @returns {Promise<number>}
   */
  async generateAlert(message, options) {
    const alert = new Alert()
    alert.message = message
    for (const option of options) {
      alert.addAction(option)
    }
    return await alert.presentAlert()
  }

  /**
   * 传送给 Siri 快捷指令车辆信息数据
   * @returns {Promise<{Object}|boolean>}
   */
  async siriShortcutData() {
    return await this.getData()
  }

  /**
   * 将图像裁剪到指定的 rect 中
   * @param img
   * @param rect
   * @returns {Image}
   */
  cropImage(img, rect) {
    const draw = new DrawContext()
    draw.size = new Size(rect.width, rect.height)

    draw.drawImageAtPoint(img,new Point(-rect.x, -rect.y))
    return draw.getImage()
  }

  /**
   * 手机分辨率
   * @returns Object
   */
  phoneSizes() {
    return {
      '2778': {
        small: 510,
        medium: 1092,
        large: 1146,
        left: 96,
        right: 678,
        top: 246,
        middle: 882,
        bottom: 1518
      },

      // 12 and 12 Pro
      '2532': {
        small: 474,
        medium: 1014,
        large: 1062,
        left: 78,
        right: 618,
        top: 231,
        middle: 819,
        bottom: 1407
      },

      // 11 Pro Max, XS Max
      '2688': {
        small: 507,
        medium: 1080,
        large: 1137,
        left: 81,
        right: 654,
        top: 228,
        middle: 858,
        bottom: 1488
      },

      // 11, XR
      '1792': {
        small: 338,
        medium: 720,
        large: 758,
        left: 54,
        right: 436,
        top: 160,
        middle: 580,
        bottom: 1000
      },

      // 11 Pro, XS, X
      '2436': {
        small: 465,
        medium: 987,
        large: 1035,
        left: 69,
        right: 591,
        top: 213,
        middle: 783,
        bottom: 1353
      },

      // Plus phones
      '2208': {
        small: 471,
        medium: 1044,
        large: 1071,
        left: 99,
        right: 672,
        top: 114,
        middle: 696,
        bottom: 1278
      },

      // SE2 and 6/6S/7/8
      '1334': {
        small: 296,
        medium: 642,
        large: 648,
        left: 54,
        right: 400,
        top: 60,
        middle: 412,
        bottom: 764
      },

      // SE1
      '1136': {
        small: 282,
        medium: 584,
        large: 622,
        left: 30,
        right: 332,
        top: 59,
        middle: 399,
        bottom: 399
      },

      // 11 and XR in Display Zoom mode
      '1624': {
        small: 310,
        medium: 658,
        large: 690,
        left: 46,
        right: 394,
        top: 142,
        middle: 522,
        bottom: 902
      },

      // Plus in Display Zoom mode
      '2001': {
        small: 444,
        medium: 963,
        large: 972,
        left: 81,
        right: 600,
        top: 90,
        middle: 618,
        bottom: 1146
      }
    }
  }

  /**
   * 获取动态字体颜色
   * @return {Color}
   */
  dynamicTextColor() {
    const lightTextColor = this.settings['lightTextColor'] ? this.settings['lightTextColor'] : '#000000'
    const darkTextColor = this.settings['darkTextColor'] ? this.settings['darkTextColor'] : '#ffffff'
    return Color.dynamic(new Color(lightTextColor, 1), new Color(darkTextColor, 1))
  }

  /**
   * 动态设置组件字体颜色
   * @param {WidgetText} widget
   */
  setWidgetTextColor(widget) {
    if (
      this.settings['myBackgroundPhotoSmallLight'] ||
      this.settings['myBackgroundPhotoSmallDark'] ||
      this.settings['myBackgroundPhotoMediumLight'] ||
      this.settings['myBackgroundPhotoMediumDark'] ||
      this.settings['myBackgroundPhotoLargeLight'] ||
      this.settings['myBackgroundPhotoLargeDark']
    ) {
      const lightTextColor = this.settings['backgroundImageLightTextColor'] ? this.settings['backgroundImageLightTextColor'] : '#ffffff'
      const darkTextColor = this.settings['backgroundImageDarkTextColor'] ? this.settings['backgroundImageDarkTextColor'] : '#000000'
      widget.textColor = Color.dynamic(new Color(lightTextColor, 1), new Color(darkTextColor, 1))
    } else {
      widget.textColor = this.dynamicTextColor()
    }
  }

  /**
   * 动态设置组件字体颜色
   * @param {WidgetImage} widget
   */
  setWidgetImageColor(widget) {
    if (
      this.settings['myBackgroundPhotoSmallLight'] ||
      this.settings['myBackgroundPhotoSmallDark'] ||
      this.settings['myBackgroundPhotoMediumLight'] ||
      this.settings['myBackgroundPhotoMediumDark'] ||
      this.settings['myBackgroundPhotoLargeLight'] ||
      this.settings['myBackgroundPhotoLargeDark']
    ) {
      const lightTextColor = this.settings['backgroundImageLightTextColor'] ? this.settings['backgroundImageLightTextColor'] : '#ffffff'
      const darkTextColor = this.settings['backgroundImageDarkTextColor'] ? this.settings['backgroundImageDarkTextColor'] : '#000000'
      widget.tintColor = Color.dynamic(new Color(lightTextColor, 1), new Color(darkTextColor, 1))
    } else {
      widget.tintColor = this.dynamicTextColor()
    }
  }

  /**
   * 是否开启位置显示
   */
  showLocation() {
    return this.settings['showLocation']
  }

  /**
   * 是否开启位置显示
   */
  showPlate() {
    return this.settings['showPlate']
  }

  /**
   * 文件路径
   * @param fileName
   * @returns {string}
   */
  filePath(fileName) {
    return Files.joinPath(Files.documentsDirectory(), fileName)
  }
}

// @组件代码结束1
await Testing(Widget)
