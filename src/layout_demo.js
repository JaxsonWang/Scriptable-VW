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

if (typeof require === 'undefined') require = importModule
const { Base, Testing } = require('./depend')

// @组件代码开始
const AUDI_VERSION = 20211127.2

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
    const plateNoStack = this.addStackTo(headerRightStack, 'vertical')
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
    const mileageImage = mileageImageStack.addImage(this.getSFSymbolImage('car'))
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
    const dateTimeImage = dateTimeImageStack.addImage(this.getSFSymbolImage('goforward'))
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
    const carStatus = []
    // const carStatus = ['前左窗', '后左门', '后右门', '天窗']
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
          const statusItemImage = statusItemStack.addImage(this.getSFSymbolImage('bell.fill'))
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
      const statusItemImage = statusItemStack.addImage(this.getSFSymbolImage('checkmark.circle.fill'))
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
    footerWrapperStack.setPadding(20, 0, 0, 0)
    const footerStack = this.addStackTo(footerWrapperStack, 'horizontal')
    footerStack.cornerRadius = 25
    footerStack.borderColor = Color.dynamic(new Color('#ffffff', 0.5), new Color('#ffffff', 0.25))
    footerStack.borderWidth = 2
    footerStack.setPadding(0, 0, 0, 20)
    footerStack.centerAlignContent()
    // 地图图片
    const footerLeftStack = this.addStackTo(footerStack, 'vertical')
    footerLeftStack.cornerRadius = 25
    footerLeftStack.borderWidth = 2
    footerLeftStack.borderColor = Color.dynamic(new Color('#ffffff', 0.5), new Color('#ffffff', 0.25))
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
}

// @组件代码结束
await Testing(Widget)
