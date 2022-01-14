// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: car;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: car;
// Variables used by Scriptable.
//
// iOS 桌面组件脚本
// 开发说明：请从 Widget 类开始编写，注释请勿修改
//

if (typeof require === 'undefined') require = importModule
const { Base, Testing } = require('./depend')

// @组件代码开始
const SCRIPT_VERSION = '2.0.0_Beta1'

const DEFAULT_MY_CAR_PHOTO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png'
const DEFAULT_AUDI_LOGO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/logo_20211127.png'

class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Template'
    this.desc = 'Template'

    if (config.runsInApp) {
      this.registerAction('账户登录', this.actionAccountLogin)
      this.registerAction('偏好配置', this.actionPreferences)
      this.registerAction('刷新数据', this.actionRefreshData)
      this.registerAction('登出重置', this.actionLogOut)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('打赏作者', this.actionDonation)
      this.registerAction('当前版本: v' + SCRIPT_VERSION, this.actionAbout)
    }
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   * @returns {Promise<ListWidget>}
   */
  async render() {
    const data = await this.getData()
    if (data) {
      switch (this.widgetFamily) {
        case 'large':
          return await this.renderLarge(data)
        case 'medium':
          return await this.renderMedium(data)
        default:
          return await this.renderSmall(data)
      }
    } else {
      return await this.renderEmpty()
    }
  }

  /**
   * 渲染小尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderSmall(data) {
    const widget = new ListWidget()
    widget.addText('Hello World').centerAlignText()
    return widget
  }

  /**
   * 渲染中尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderMedium(data) {
    const widget = new ListWidget()
    widget.backgroundGradient = this.dynamicBackgroundColor()
    widget.setPadding(10, 10, 10, 10)
    // region logoStack
    const rowHeader = this.addStackTo(widget, 'horizontal')
    rowHeader.setPadding(0, 0, 0, 0)
    rowHeader.topAlignContent()
    // 车辆名称
    const nameStack = this.addStackTo(rowHeader, 'vertical')
    const carText = nameStack.addText('奥迪 A4L')
    carText.font = new Font('PingFangSC-Medium', 18)
    carText.textColor = this.dynamicTextColor()
    const powerText = nameStack.addText('2.0 140KW B9 40TFSI S-line')
    powerText.font = new Font('PingFangSC-Thin', 10)
    powerText.textColor = this.dynamicTextColor()
    rowHeader.addSpacer()
    const headerRightStack = this.addStackTo(rowHeader, 'vertical')
    headerRightStack.centerAlignContent()
    const baseInfoStack = this.addStackTo(headerRightStack, 'horizontal')
    baseInfoStack.addSpacer()
    baseInfoStack.centerAlignContent()
    const plateNoStack = this.addStackTo(baseInfoStack, 'vertical')
    plateNoStack.centerAlignContent()
    const plateNoText = plateNoStack.addText('苏DY38Z8')
    plateNoText.font = new Font('PingFangSC-Regular', 12)
    plateNoText.textColor = this.dynamicTextColor()
    baseInfoStack.addSpacer(5)
    const logoStack = this.addStackTo(baseInfoStack, 'vertical')
    logoStack.centerAlignContent()
    const carLogoImage = logoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    carLogoImage.imageSize = new Size(40, 16)
    carLogoImage.tintColor = this.dynamicTextColor()
    const statusStack = this.addStackTo(headerRightStack, 'horizontal')
    statusStack.centerAlignContent()
    statusStack.addSpacer()
    const carLockStack = this.addStackTo(statusStack, 'horizontal')
    carLockStack.centerAlignContent()
    const carDoorImage = carLockStack.addImage(this.getSFSymbolImage('lock.slash.fill'))
    carDoorImage.imageSize = new Size(18, 18)
    carDoorImage.tintColor = new Color('#cc0000', 1)
    const carLockImage = carLockStack.addImage(this.getSFSymbolImage('lock.fill'))
    carLockImage.imageSize = new Size(18, 18)
    carLockImage.tintColor = this.dynamicTextColor()
    // endregion
    // region mainStack
    const mainStack = this.addStackTo(widget, 'horizontal')
    mainStack.setPadding(0, 0, 0, 0)
    mainStack.centerAlignContent()
    // region 状态信息展示
    const rowLeftStack = this.addStackTo(mainStack, 'vertical')
    // 续航/燃料信息
    const carInfoStack = this.addStackTo(rowLeftStack, 'horizontal')
    carInfoStack.bottomAlignContent()
    const carInfoImageStack = this.addStackTo(carInfoStack, 'vertical')
    carInfoImageStack.bottomAlignContent()
    const carInfoImage = carInfoImageStack.addImage(this.getSFSymbolImage('timer'))
    carInfoImage.imageSize = new Size(18, 18)
    carInfoImage.tintColor = this.dynamicTextColor()
    carInfoStack.addSpacer(5)
    const carInfoTextStack = this.addStackTo(carInfoStack, 'horizontal')
    carInfoTextStack.bottomAlignContent()
    const enduranceText = carInfoTextStack.addText('210km')
    enduranceText.font = new Font('Futura-CondensedExtraBold', 14)
    enduranceText.textColor = this.dynamicTextColor()
    carInfoTextStack.addSpacer(3)
    const fuelText1 = carInfoTextStack.addText('21%')
    fuelText1.font = new Font('Futura-Medium', 12)
    fuelText1.textColor = this.dynamicTextColor()
    carInfoTextStack.addSpacer(1)
    const fuelText2 = carInfoTextStack.addText('56%')
    fuelText2.font = new Font('Futura-Medium', 8)
    fuelText2.textColor = this.dynamicTextColor()

    rowLeftStack.spacing = 1
    // 总里程
    const mileageStack = this.addStackTo(rowLeftStack, 'horizontal')
    mileageStack.bottomAlignContent()
    const mileageImageStack = this.addStackTo(mileageStack, 'vertical')
    mileageImageStack.bottomAlignContent()
    const mileageImage = mileageImageStack.addImage(this.getSFSymbolImage('car'))
    mileageImage.imageSize = new Size(18, 18)
    mileageImage.tintColor = this.dynamicTextColor()
    mileageStack.addSpacer(5)
    const mileageTextStack = this.addStackTo(mileageStack, 'horizontal')
    mileageTextStack.bottomAlignContent()
    const mileageText = mileageTextStack.addText('22941km')
    mileageText.font = new Font('Futura-Medium', 12)
    mileageText.textColor = this.dynamicTextColor()

    rowLeftStack.spacing = 1
    // 更新日期
    const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal')
    dateTimeStack.bottomAlignContent()
    const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical')
    dateTimeImageStack.bottomAlignContent()
    const dateTimeImage = dateTimeImageStack.addImage(this.getSFSymbolImage('goforward'))
    dateTimeImage.imageSize = new Size(18, 18)
    dateTimeImage.tintColor = this.dynamicTextColor()
    dateTimeStack.addSpacer(5)
    const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal')
    dateTimeTextStack.bottomAlignContent()
    const dateTimeText = dateTimeTextStack.addText('12-01 12:20:12')
    dateTimeText.font = new Font('Futura-Medium', 12)
    dateTimeText.textColor = this.dynamicTextColor()
    // endregion
    mainStack.addSpacer()
    // region 右侧车辆图片
    const rowRightStack = this.addStackTo(mainStack, 'vertical')
    const carPhoto = await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO)
    const carPhotoStack = rowRightStack.addImage(carPhoto)
    carPhotoStack.centerAlignImage()
    // endregion
    // endregion
    const locationStack = this.addStackTo(widget, 'horizontal')
    locationStack.centerAlignContent()
    locationStack.addSpacer()
    const locationText = locationStack.addText('江苏省苏州市工业园区斜塘街翰林苑小区')
    locationText.font = new Font('PingFangSC-Regular', 10)
    locationText.textColor = this.dynamicTextColor()
    locationText.centerAlignText()
    locationStack.addSpacer()

    return widget
  }

  /**
   * 渲染大尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderLarge(data) {
    const widget = new ListWidget()
    widget.backgroundGradient = this.dynamicBackgroundColor()
    widget.setPadding(10, 10, 10, 10)
    // region headerStack
    const rowHeader = this.addStackTo(widget, 'horizontal')
    rowHeader.setPadding(0, 0, 10, 0)
    rowHeader.topAlignContent()
    // 顶部左侧
    const headerLeftStack = this.addStackTo(rowHeader, 'vertical')
    // 车辆名称
    const nameStack = this.addStackTo(headerLeftStack, 'vertical')
    const carText = nameStack.addText('奥迪 A4L')
    carText.font = new Font('PingFangSC-Medium', 22)
    carText.textColor = this.dynamicTextColor()
    // 功率显示
    const powerStack = this.addStackTo(headerLeftStack, 'vertical')
    const powerText = powerStack.addText('2.0 140KW B9 40TFSI S-line')
    powerText.font = new Font('PingFangSC-Thin', 14)
    powerText.textColor = this.dynamicTextColor()
    // 俩侧分割
    rowHeader.addSpacer()
    // 顶部右侧
    const headerRightStack = this.addStackTo(rowHeader, 'vertical')
    // Logo
    const carLogoStack = this.addStackTo(headerRightStack, 'vertical')
    const carLogoImage = carLogoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    carLogoImage.imageSize = new Size(70, 20)
    carLogoImage.tintColor = this.dynamicTextColor()
    headerRightStack.addSpacer(5)
    // 车牌信息
    const plateNoStack = this.addStackTo(headerRightStack, 'horizontal')
    const plateNoText = plateNoStack.addText('苏DY38Z8')
    plateNoText.font = new Font('PingFangSC-Regular', 14)
    plateNoText.textColor = this.dynamicTextColor()
    // endregion
    // region mainStack
    const mainStack = this.addStackTo(widget, 'horizontal')
    mainStack.centerAlignContent()
    mainStack.setPadding(0, 0, 0, 0)
    // region 状态信息展示
    const rowLeftStack = this.addStackTo(mainStack, 'vertical')
    // region 续航里程
    const enduranceStack = this.addStackTo(rowLeftStack, 'horizontal')
    enduranceStack.bottomAlignContent()
    const enduranceImageStack = this.addStackTo(enduranceStack, 'vertical')
    enduranceImageStack.bottomAlignContent()
    const enduranceImage = enduranceImageStack.addImage(this.getSFSymbolImage('flag.circle'))
    enduranceImage.imageSize = new Size(20, 20)
    enduranceImage.tintColor = this.dynamicTextColor()
    enduranceStack.addSpacer(5)
    const enduranceTextStack = this.addStackTo(enduranceStack, 'horizontal')
    enduranceTextStack.bottomAlignContent()
    const enduranceText = enduranceTextStack.addText('210km')
    enduranceText.font = new Font('Futura-Medium', 14)
    enduranceText.textColor = this.dynamicTextColor()
    // endregion
    rowLeftStack.addSpacer(5)
    // region 燃料信息
    const fuelStack = this.addStackTo(rowLeftStack, 'horizontal')
    fuelStack.bottomAlignContent()
    const fuelImageStack = this.addStackTo(fuelStack, 'vertical')
    fuelImageStack.bottomAlignContent()
    const fuelImage = fuelImageStack.addImage(this.getSFSymbolImage('bolt.circle'))
    fuelImage.imageSize = new Size(20, 20)
    fuelImage.tintColor = this.dynamicTextColor()
    fuelStack.addSpacer(5)
    // 汽油
    const fuelTextStack1 = this.addStackTo(fuelStack, 'horizontal')
    fuelTextStack1.bottomAlignContent()
    const fuelText1 = fuelTextStack1.addText('57%')
    fuelText1.font = new Font('Futura-Medium', 14)
    fuelText1.textColor = this.dynamicTextColor()
    fuelStack.addSpacer(5)
    // 电池
    const fuelTextStack2 = this.addStackTo(fuelStack, 'horizontal')
    fuelTextStack2.bottomAlignContent()
    const fuelText2 = fuelTextStack2.addText('44%')
    fuelText2.font = new Font('Futura-Medium', 12)
    fuelText2.textColor = this.dynamicTextColor()
    // endregion
    rowLeftStack.addSpacer(5)
    // region 总里程
    const mileageStack = this.addStackTo(rowLeftStack, 'horizontal')
    mileageStack.bottomAlignContent()
    const mileageImageStack = this.addStackTo(mileageStack, 'vertical')
    mileageImageStack.bottomAlignContent()
    const mileageImage = mileageImageStack.addImage(this.getSFSymbolImage('car.circle'))
    mileageImage.imageSize = new Size(20, 20)
    mileageImage.tintColor = this.dynamicTextColor()
    mileageStack.addSpacer(5)
    const mileageTextStack = this.addStackTo(mileageStack, 'horizontal')
    mileageTextStack.bottomAlignContent()
    const mileageText = mileageTextStack.addText('22941km')
    mileageText.font = new Font('Futura-Medium', 14)
    mileageText.textColor = this.dynamicTextColor()
    // endregion
    rowLeftStack.addSpacer(5)
    // region 机油数据
    const oilStack = this.addStackTo(rowLeftStack, 'horizontal')
    oilStack.bottomAlignContent()
    const oilImageStack = this.addStackTo(oilStack, 'vertical')
    oilImageStack.bottomAlignContent()
    const oilImage = oilImageStack.addImage(this.getSFSymbolImage('drop.circle'))
    oilImage.imageSize = new Size(20, 20)
    oilImage.tintColor = this.dynamicTextColor()
    oilStack.addSpacer(5)
    const oilTextStack = this.addStackTo(oilStack, 'horizontal')
    oilTextStack.bottomAlignContent()
    const oilText = oilTextStack.addText('78.87%')
    oilText.font = new Font('Futura-Medium', 14)
    oilText.textColor = this.dynamicTextColor()
    // endregion
    rowLeftStack.addSpacer(5)
    // region 锁车状态
    const lockedStack = this.addStackTo(rowLeftStack, 'horizontal')
    lockedStack.bottomAlignContent()
    const lockedImageStack = this.addStackTo(lockedStack, 'vertical')
    lockedImageStack.bottomAlignContent()
    const lockedImage = lockedImageStack.addImage(this.getSFSymbolImage('lock.circle'))
    lockedImage.imageSize = new Size(20, 20)
    lockedImage.tintColor = this.dynamicTextColor()
    lockedImage.tintColor = new Color('#D53A2F', 1)
    lockedStack.addSpacer(5)
    const lockedTextStack = this.addStackTo(lockedStack, 'horizontal')
    lockedTextStack.bottomAlignContent()
    const lockedText = lockedTextStack.addText('未锁车')
    lockedText.font = new Font('Futura-Medium', 14)
    lockedText.textColor = this.dynamicTextColor()
    lockedText.textColor = new Color('#EB4F3C', 1)
    // endregion
    rowLeftStack.addSpacer(5)
    // region 更新日期
    const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal')
    dateTimeStack.bottomAlignContent()
    const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical')
    dateTimeImageStack.bottomAlignContent()
    const dateTimeImage = dateTimeImageStack.addImage(this.getSFSymbolImage('repeat.circle'))
    dateTimeImage.imageSize = new Size(20, 20)
    dateTimeImage.tintColor = this.dynamicTextColor()
    dateTimeStack.addSpacer(5)
    const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal')
    dateTimeTextStack.bottomAlignContent()
    const dateTimeText = dateTimeTextStack.addText('12:20:12')
    dateTimeText.font = new Font('Futura-Medium', 14)
    dateTimeText.textColor = this.dynamicTextColor()
    // endregion
    // endregion
    mainStack.addSpacer()
    // region 右侧车辆图片
    const rowRightStack = this.addStackTo(mainStack, 'vertical')
    rowRightStack.addSpacer()
    const carPhotoStack = this.addStackTo(rowRightStack, 'horizontal')
    carPhotoStack.addSpacer()
    carPhotoStack.centerAlignContent()
    const carPhoto = await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO)
    const carPhotoImage = carPhotoStack.addImage(carPhoto)
    carPhotoImage.centerAlignImage()
    const statusStack = this.addStackTo(rowRightStack, 'vertical')
    statusStack.setPadding(5, 0, 0, 0)
    statusStack.centerAlignContent()
    // const carStatus = []
    const carStatus = ['前左窗', '后左门', '后右门', '天窗']
    // const carStatus = ['前左窗', '前右窗', '后左窗', '后右窗', '前左门', '前右门', '后左门', '后右门', '天窗', '后备箱', '引擎盖']
    if (carStatus.length !== 0) {
      const statusArray = this.format2Array(carStatus, 2)
      statusArray.forEach(arr => {
        const statusRowStack = this.addStackTo(statusStack, 'horizontal')
        statusRowStack.setPadding(2, 0, 2, 0)
        statusRowStack.centerAlignContent()
        arr.forEach(item => {
          const statusItemStack = this.addStackTo(statusRowStack, 'horizontal')
          statusItemStack.addSpacer()
          statusItemStack.centerAlignContent()
          const statusItemImage = statusItemStack.addImage(this.getSFSymbolImage('exclamationmark.shield.fill'))
          statusItemImage.imageSize = new Size(14, 14)
          statusItemImage.tintColor = new Color('#EB4F3C', 1)
          statusItemStack.addSpacer(2)
          const statusItemText = statusItemStack.addText(item + '未关闭')
          statusItemText.font = new Font('PingFangSC-Regular', 12)
          statusItemText.textColor = new Color('#EB4F3C', 1)
          statusItemText.centerAlignText()
          statusItemStack.addSpacer()
        })
      })
    } else {
      const statusItemStack = this.addStackTo(statusStack, 'horizontal')
      statusItemStack.setPadding(5, 0, 5, 0)
      statusItemStack.addSpacer()
      statusItemStack.centerAlignContent()
      const statusItemImage = statusItemStack.addImage(this.getSFSymbolImage('checkmark.shield.fill'))
      statusItemImage.imageSize = new Size(14, 14)
      statusItemImage.tintColor = new Color('#65DB79', 1)
      statusItemStack.addSpacer(2)
      const statusItemText = statusItemStack.addText('当前车窗已全关闭')
      statusItemText.font = new Font('PingFangSC-Regular', 12)
      statusItemText.textColor = this.dynamicTextColor()
      statusItemText.centerAlignText()
      statusItemStack.addSpacer()
    }
    rowRightStack.addSpacer()
    // endregion
    // 地图/一言展示
    let leftImage = 'https://restapi.amap.com/v3/staticmap?markers=mid,0xFF0000,0:116.37359,39.92437&size=100*60&scale=2&zoom=15&traffic=1&key=c078fb16379c25bc0aad8633d82cf1dd'
    let rightText = '江苏省苏州市工业园区斜塘街翰林苑小区'
    // leftImage = 'https://i95.me/images/audi_logo_1.png'
    // rightText = '世间美好，与您环环相扣'
    const footerWrapperStack = this.addStackTo(widget, 'horizontal')
    footerWrapperStack.setPadding(0, 0, 0, 0)
    const footerStack = this.addStackTo(footerWrapperStack, 'horizontal')
    footerStack.cornerRadius = 25
    footerStack.borderColor = Color.dynamic(new Color('#000000', 0.25), new Color('#ffffff', 0.25))
    footerStack.borderWidth = 2
    footerStack.setPadding(0, 0, 0, 20)
    footerStack.centerAlignContent()
    // 地图图片
    const footerLeftStack = this.addStackTo(footerStack, 'vertical')
    footerLeftStack.cornerRadius = 25
    footerLeftStack.borderWidth = 2
    footerLeftStack.borderColor = Color.dynamic(new Color('#000000', 0.25), new Color('#ffffff', 0.25))
    const locationImage = await this.getImageByUrl(leftImage)
    const locationImageStack = footerLeftStack.addImage(locationImage)
    locationImageStack.imageSize = new Size(100, 60)
    locationImageStack.centerAlignImage()
    footerStack.addSpacer()
    // 地理位置
    const footerRightStack = this.addStackTo(footerStack, 'vertical')
    const locationText = footerRightStack.addText(rightText)
    locationText.font = new Font('PingFangSC-Regular', 12)
    locationText.centerAlignText()
    locationText.textColor = this.dynamicTextColor()
    footerStack.addSpacer()
    // 有地理数据时候展示一言
    const oneStack = this.addStackTo(widget, 'horizontal')
    oneStack.setPadding(10, 0, 0, 0)
    oneStack.addSpacer()
    oneStack.centerAlignContent()
    const oneText = oneStack.addText('世间美好，与您环环相扣')
    oneText.font = new Font('PingFangSC-Regular', 12)
    oneText.textColor = this.dynamicTextColor()
    oneText.centerAlignText()
    oneStack.addSpacer()

    return widget
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget()
    widget.addText('Hello World').centerAlignText()
    return widget
  }

  /**
   * 处理数据业务
   * @returns {{}}
   */
  bootstrap() {
    return {}
  }

  /**
   * 获取数据
   * @returns {{}}
   */
  getData() {
    return this.bootstrap()
  }

  /**
   * 处理车辆状态信息
   * @param {Array} data 状态数据
   */
  handleVehiclesData(data) {
    // region 机油信息
    const oilSupport = data.find(i => i.id === '0x0204FFFFFF')?.field
    let oilMinOK = null
    let oilLevel = null
    // 有些车辆不一定支持机油显示，需要判断下
    if (oilSupport) {
      // oil.min.ok '0' = 不正常 '1' = 正常
      oilMinOK = oilSupport.find(i => i.id === '0x0204040002').value
      // 机油单位百分比
      oilLevel = oilSupport.find(i => i.id === '0x0204040003').value
    }
    // endregion
    const statusArr = data.find(i => i.id === '0x0301FFFFFF')?.field
    // region 驻车灯
    // '2' = 已关闭
    const parkingLights = statusArr.find(i => i.id === '0x0204040003').value
    // endregion
    // region 室外温度
    const kelvinTemperature = statusArr.find(i => i.id === '0x0301020001').value
    // 开尔文单位转换成摄氏度
    const outdoorTemperature = (parseInt(kelvinTemperature, 10) / 10 + -273.15).toFixed(1)
    // endregion
    // region 驻车制动
    // '1' = 已激活 / '0' = 未激活
    const parkingBrakeActive = data.find(i => i.id === '0x0301030001').value
    // endregion
    // region 续航里程
    // 单位 km
    const fuelRange = data.find(i => i.id === '0x0301030005').value || data.find(i => i.id === '0x0301030006').value
    // endregion
    // region 汽油油量
    // 单位 %
    const fuelLevel = data.find(i => i.id === '0x030103000A').value
    // endregion
    // region 电池容量
    // 单位 %
    const socLevel = data.find(i => i.id === '0x0301030002').value
    // endregion
    // region 总里程和更新时间
    const mileageArr = data.find(i => i.id === '0x0101010002')?.field
    const mileage = mileageArr.find(i => i.id === '0x0101010002').value
    const updateTime = mileageArr.find(i => i.id === '0x0101010002').tsCarSentUtc
    // endregion
    // region 锁车状态
    const isLocked = this.getVehiclesLocked(statusArr)
    // endregion
    // region 车门状态
    const doorStatus = this.getVehiclesDoorStatus(statusArr)
    // endregion
    // region 车窗状态
    const windowStatus = this.getVehiclesWindowStatus(statusArr)
    // endregion

    return {
      oilSupport: oilSupport !== undefined,
      oilMinOK,
      oilLevel,
      parkingLights,
      outdoorTemperature,
      parkingBrakeActive,
      fuelRange,
      fuelLevel,
      socLevel,
      mileage,
      updateTime,
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
   * 获取设备编码
   * @returns {Promise<void>}
   */
  async getDeviceId() {
    const options = {
      url: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/register/v1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appId: 'com.tima.aftermarket',
        client_brand: 'VW',
        appName: 'MyAuDi',
        client_name: 'Maton',
        appVersion: '1.0',
        platform: 'iOS'
      })
    }
    try {
      const response = await this.http(options)
      if (response.client_id) {
        this.settings['clientID'] = response.client_id
        await this.saveSettings(false)
        await this.handleLoginRequest()
        console.log('获取设备编码成功，准备进行账户登录')
      } else {
        console.error('获取设备编码失败，请稍后再重试！')
        await this.notify('系统通知', '获取设备编码失败，请稍后再重试！')
      }
    } catch (error) {
    }
  }

  /**
   * 登录账户
   * @returns {Promise<void>}
   */
  async handleLoginRequest() {
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
        console.log('账户登录成功，存储用户 accessToken, idToken 密钥信息')
        // 准备交换验证密钥数据
        await this.getTokenRequest('refreshAuthToken')
        // 获取个人中心数据
        await this.getUserMineRequest()
      } else {
        console.error('账户登录失败：' + response.message)
        await this.notify('账户登录失败', '账户登录失败：' + response.message)
      }
    } catch (error) {
      // Error: 似乎已断开与互联网到连接。
      console.warn(error)
    }
  }

  /**
   * 获取密钥数据
   * @param {'refreshAuthToken' | 'authAccessToken'} type
   * @returns {Promise<void>}
   */
  async getTokenRequest(type) {
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

    const options = {
      url: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/oauth2/v1/token',
      method: 'POST',
      headers: this.requestHeader(),
      body: requestParams
    }
    try {
      const response = await this.http(options)
      // 判断接口状态
      if (response.error) {
        switch (response.error) {
          case 'invalid_grant':
            console.log('IDToken 数据过期，正在重新获取数据中，请耐心等待...')
            await this.getTokenRequest('refreshAuthToken')
            break
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
          await this.getApiBaseURI()
        }
      }
    } catch (error) {
      console.warn(error)
    }
  }

  /**
   * 获取用户信息
   * @returns {Promise<void>}
   */
  async getUserMineRequest() {
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
        const { plateNo, seriesName, carModelName, vin } = response.data
        this.settings['carPlateNo'] = plateNo
        this.settings['seriesName'] = seriesName
        this.settings['carModelName'] = carModelName
        this.settings['carVIN'] = vin
        await this.saveSettings(false)
        console.log('获取用户基本信息成功并将存储本地')
        // 准备交换验证密钥数据
        await this.getTokenRequest('authAccessToken')
      } else {
        console.error('获取个人信息失败，请登出重置后再进行小组件登录！')
        await this.notify('个人信息获取失败', '获取个人信息失败，请登出重置后再进行小组件登录！')
      }
    } catch (error) {
    }
  }

  /**
   * 根据车架号查询基础访问域
   * @returns {Promise<void>}
   */
  async getApiBaseURI() {
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
        await this.saveSettings(false)
        console.log('根据车架号查询基础访问域成功')
        // 获取车辆信息
        // await this.bootstrap(isDebug)
      }
    } catch (error) {
    }
  }

  /**
   * 获取车辆状态
   * @returns {Promise<Object>}
   */
  async getVehiclesStatus() {
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
        console.error('获取车辆状态接口异常' + response.error.errorCode + ' - ' + response.error.description)
        switch (response.error.errorCode) {
          case 'gw.error.authentication':
            console.error('获取车辆状态失败 error: ' + response.error.errorCode)
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
      return this.settings['vehicleData']
    }
  }

  /**
   * 获取车辆经纬度
   * @returns {Promise<void>}
   */
  async getVehiclesPosition() {
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
        console.error('获取车辆经纬度接口异常' + response.error.errorCode + ' - ' + response.error.description)
        switch (response.error.errorCode) {
          case 'gw.error.authentication':
            console.error('获取车辆经纬度失败 error: ' + response.error.errorCode)
            await this.getTokenRequest('authAccessToken')
            await this.getVehiclesPosition()
            break
          case 'CF.technical.9031':
            console.error('获取数据超时，稍后再重试')
            break
          case 'mbbc.rolesandrights.servicelocallydisabled':
            console.error('请检查车辆位置是否开启')
            break
        }
      } else {
        // 接口获取数据成功储存接口数据
        let longitude = -1
        let latitude = -1
        if (response.storedPositionResponse) {
          longitude = response.storedPositionResponse.position.carCoordinate.longitude
          latitude = response.storedPositionResponse.position.carCoordinate.latitude
        } else if (response.findCarResponse) {
          longitude = response.findCarResponse.position.carCoordinate.longitude
          latitude = response.findCarResponse.position.carCoordinate.latitude
        }
        // 转换正常经纬度信息
        this.settings['longitude'] = parseInt(longitude, 10) / 1000000
        this.settings['latitude'] = parseInt(latitude, 10) / 1000000
        await this.saveSettings(false)
      }
    } catch (error) {
    }
  }

  /**
   * 获取车辆地理位置信息
   * @return {Promise<{simple: string, complete: string}>}
   */
  async getCarAddressInfo() {
    const longitude = this.settings['longitude']
    const latitude = this.settings['latitude']

    const aMapKey = this.settings['aMapKey']
    const options = {
      url: `https://restapi.amap.com/v3/geocode/regeo?key=${aMapKey}&location=${longitude},${latitude}&radius=1000&extensions=base&batch=false&roadlevel=0`,
      method: 'GET'
    }
    try {
      const response = await this.http(options)
      if (response.status === '1') {
        const addressComponent = response.regeocode.addressComponent
        const simpleAddress = addressComponent.district + addressComponent.township
        const completeAddress = response.regeocode.formatted_address
        this.settings['simpleAddress'] = simpleAddress
        this.settings['completeAddress'] = completeAddress
        await this.saveSettings(false)
      } else {
        console.error('获取车辆位置失败，请检查高德地图 key 是否填写正常')
      }
    } catch (error) {
    }
  }

  /**
   * 获取车辆地址位置静态图片
   * @return {Promise<Image>}
   */
  async getCarAddressImage() {
    const longitude = this.settings['longitude']
    const latitude = this.settings['latitude']

    const aMapKey = this.settings['aMapKey']
    const image = `https://restapi.amap.com/v3/staticmap?key=${aMapKey}&markers=mid,0xFF0000,0:${longitude},${latitude}&size=100*60&scale=2&zoom=15&traffic=1`

    return this.getImageByUrl(image)
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
    this.actionStatementSettings(message).then(async () => {
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
    }).catch(() => {
    })
  }

  /**
   * 偏好设置
   */
  async actionPreferences() {}

  /**
   * 刷新数据
   */
  async actionRefreshData() {}

  /**
   * 重置登出
   */
  async actionLogOut() {}

  /**
   * 检查更新
   */
  async actionCheckUpdate() {
    const UPDATE_FILE = 'FVW-Audi-Joiner.js'
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    const request = new Request('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/fvw-audi-version.json')
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
   * 捐赠
   */
  async actionDonation() {
    Safari.open( 'https://joiner.i95.me/donation.html')
  }

  /**
   * 关于组件
   */
  async actionAbout() {
    Safari.open( 'https://joiner.i95.me/about.html')
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

// @组件代码结束
await Testing(Widget)
