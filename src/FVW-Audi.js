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
const SCRIPT_VERSION = '2.0.6'

const DEFAULT_AUDI_LOGO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/logo_20211127.png'

class Widget extends Base {
  successColor = new Color('#67C23A', 1)
  warningColor = new Color('#E6A23C', 1)
  dangerColor = new Color('#F56C6C', 1)

  lightDefaultBackgroundColorGradient = ['#ffffff', '#dbefff']
  darkDefaultBackgroundColorGradient = ['#414345', '#232526']

  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Audi 挂件'
    this.desc = 'Audi 车辆桌面组件展示'

    if (config.runsInApp) {
      if (!this.settings['isLogin']) this.registerAction('账户登录', this.actionAccountLogin)
      if (this.settings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings)
      if (this.settings['isLogin']) this.registerAction('刷新数据', this.actionRefreshData)
      if (this.settings['isLogin']) this.registerAction('登出重置', this.actionLogOut)
      if (this.settings['isLogin']) this.registerAction('调试日志', this.actionDebug)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('当前版本: v' + SCRIPT_VERSION, this.actionAbout)
    }
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   * @returns {Promise<ListWidget>}
   */
  async render() {
    if (this.settings['isLogin']) {
      const data = await this.getData()
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
    await this.setWidgetDynamicBackground(widget, 'Medium')
    widget.setPadding(15, 15, 15, 15)
    // region logoStack
    const rowHeader = this.addStackTo(widget, 'horizontal')
    rowHeader.setPadding(0, 0, 0, 0)
    rowHeader.topAlignContent()
    // 车辆名称
    const nameStack = this.addStackTo(rowHeader, 'vertical')
    const carText = nameStack.addText(data.seriesName)
    carText.font = new Font('PingFangSC-Medium', 18)
    this.setWidgetNodeColor(carText, 'textColor')
    // 2.0 140KW B9 40TFSI S-line
    const powerText = nameStack.addText(data.carModelName)
    powerText.font = new Font('PingFangSC-Regular', 10)
    this.setWidgetNodeColor(powerText, 'textColor')
    rowHeader.addSpacer()
    const headerRightStack = this.addStackTo(rowHeader, 'vertical')
    headerRightStack.centerAlignContent()
    const baseInfoStack = this.addStackTo(headerRightStack, 'horizontal')
    baseInfoStack.addSpacer()
    baseInfoStack.centerAlignContent()
    // 车牌显示
    if (data.showPlate) {
      const plateNoStack = this.addStackTo(baseInfoStack, 'vertical')
      plateNoStack.centerAlignContent()
      const plateNoText = plateNoStack.addText(data.carPlateNo)
      plateNoText.font = new Font('PingFangSC-Regular', 12)
      this.setWidgetNodeColor(plateNoText, 'textColor')
      baseInfoStack.addSpacer(5)
    }
    const logoStack = this.addStackTo(baseInfoStack, 'vertical')
    logoStack.centerAlignContent()
    const carLogoImage = logoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    carLogoImage.imageSize = new Size(40, 16)
    this.setWidgetNodeColor(carLogoImage, 'tintColor')
    headerRightStack.spacing = 4
    const statusStack = this.addStackTo(headerRightStack, 'horizontal')
    statusStack.centerAlignContent()
    statusStack.addSpacer()
    const carLockStack = this.addStackTo(statusStack, 'horizontal')
    carLockStack.centerAlignContent()
    // 门窗状态
    const doorAndWindowNormal = [...data.doorStatus, ...data.windowStatus].length !== 0
    // const doorAndWindowNormal = true
    if (doorAndWindowNormal) {
      const carDoorImage = carLockStack.addImage(await this.getSFSymbolImage('xmark.shield.fill'))
      carDoorImage.imageSize = new Size(12, 12)
      carDoorImage.tintColor = this.warningColor
    }
    carLockStack.spacing = 5
    // 锁车状态
    const carLockImage = carLockStack.addImage(await this.getSFSymbolImage('lock.shield.fill'))
    carLockImage.imageSize = new Size(12, 12)
    carLockImage.tintColor = data.isLocked ? this.successColor : this.dangerColor
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
    const carInfoImage = carInfoImageStack.addImage(await this.getSFSymbolImage('timer'))
    carInfoImage.imageSize = new Size(15, 15)
    this.setWidgetNodeColor(carInfoImage, 'tintColor')
    carInfoStack.addSpacer(5)
    const carInfoTextStack = this.addStackTo(carInfoStack, 'horizontal')
    carInfoTextStack.bottomAlignContent()
    const enduranceText = carInfoTextStack.addText(data.fuelRange + 'km')
    enduranceText.font = new Font('Futura-CondensedExtraBold', 14)
    this.setWidgetNodeColor(enduranceText, 'textColor')
    if (data.fuelLevel) {
      carInfoTextStack.addSpacer(3)
      const fuelText1 = carInfoTextStack.addText(data.fuelLevel + '%')
      fuelText1.font = new Font('Futura-Medium', 12)
      this.setWidgetNodeColor(fuelText1, 'textColor')
      carInfoTextStack.addSpacer(1)
    }
    if (data.socLevel) {
      const fuelText2 = carInfoTextStack.addText(data.socLevel + '%')
      fuelText2.font = new Font('Futura-Medium', 8)
      this.setWidgetNodeColor(fuelText2, 'textColor')
    }

    rowLeftStack.spacing = 5
    // 总里程
    const mileageStack = this.addStackTo(rowLeftStack, 'horizontal')
    mileageStack.bottomAlignContent()
    const mileageImageStack = this.addStackTo(mileageStack, 'vertical')
    mileageImageStack.bottomAlignContent()
    const mileageImage = mileageImageStack.addImage(await this.getSFSymbolImage('car'))
    mileageImage.imageSize = new Size(15, 15)
    this.setWidgetNodeColor(mileageImage, 'tintColor')
    mileageStack.addSpacer(5)
    const mileageTextStack = this.addStackTo(mileageStack, 'horizontal')
    mileageTextStack.bottomAlignContent()
    const mileageText = mileageTextStack.addText(data.mileage + 'km')
    mileageText.font = new Font('Futura-Medium', 12)
    this.setWidgetNodeColor(mileageText, 'textColor')

    rowLeftStack.spacing = 5
    // 更新日期
    const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal')
    dateTimeStack.bottomAlignContent()
    const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical')
    dateTimeImageStack.bottomAlignContent()
    const dateTimeImage = dateTimeImageStack.addImage(await this.getSFSymbolImage('goforward'))
    dateTimeImage.imageSize = new Size(15, 15)
    this.setWidgetNodeColor(dateTimeImage, 'tintColor')
    dateTimeStack.addSpacer(5)
    const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal')
    dateTimeTextStack.bottomAlignContent()
    const dateTimeText = dateTimeTextStack.addText(data.updateTime)
    dateTimeText.font = new Font('Futura-Medium', 12)
    this.setWidgetNodeColor(dateTimeText, 'textColor')
    // endregion
    mainStack.addSpacer()
    // region 右侧车辆图片
    const rowRightStack = this.addStackTo(mainStack, 'vertical')
    const carPhoto = await this.getMyCarPhoto()
    const carPhotoStack = rowRightStack.addImage(carPhoto)
    carPhotoStack.centerAlignImage()
    // endregion
    // endregion
    const footTextData = data.showLocation ? data.completeAddress : data.myOne
    const footerStack = this.addStackTo(widget, 'horizontal')
    footerStack.centerAlignContent()
    footerStack.addSpacer()
    const footerText = footerStack.addText(footTextData)
    footerText.font = new Font('PingFangSC-Regular', 10)
    this.setWidgetNodeColor(footerText, 'textColor')
    footerText.centerAlignText()
    footerStack.addSpacer()

    return widget
  }

  /**
   * 渲染大尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderLarge(data) {
    const widget = new ListWidget()
    await this.setWidgetDynamicBackground(widget, 'Large')

    widget.setPadding(15, 15, 15, 15)
    // region headerStack
    const rowHeader = this.addStackTo(widget, 'horizontal')
    rowHeader.setPadding(0, 0, 10, 0)
    rowHeader.topAlignContent()
    // 顶部左侧
    const headerLeftStack = this.addStackTo(rowHeader, 'vertical')
    // 车辆名称
    const nameStack = this.addStackTo(headerLeftStack, 'vertical')
    const carText = nameStack.addText(data.seriesName)
    carText.font = new Font('PingFangSC-Medium', 22)
    this.setWidgetNodeColor(carText, 'textColor')
    // 功率显示
    const powerStack = this.addStackTo(headerLeftStack, 'vertical')
    const powerText = powerStack.addText(data.carModelName)
    powerText.font = new Font('PingFangSC-Regular', 14)
    this.setWidgetNodeColor(powerText, 'textColor')
    // 俩侧分割
    rowHeader.addSpacer()
    // 顶部右侧
    const headerRightStack = this.addStackTo(rowHeader, 'vertical')
    // Logo
    const carLogoStack = this.addStackTo(headerRightStack, 'vertical')
    const carLogoImage = carLogoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    carLogoImage.imageSize = new Size(70, 20)
    this.setWidgetNodeColor(carLogoImage, 'tintColor')
    headerRightStack.addSpacer(5)
    // 车牌信息
    if (data.showPlate) {
      const plateNoStack = this.addStackTo(headerRightStack, 'horizontal')
      const plateNoText = plateNoStack.addText(data.carPlateNo)
      plateNoText.font = new Font('PingFangSC-Regular', 14)
      this.setWidgetNodeColor(plateNoText, 'textColor')
    }
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
    const enduranceImage = enduranceImageStack.addImage(await this.getSFSymbolImage('flag.circle'))
    enduranceImage.imageSize = new Size(18, 18)
    this.setWidgetNodeColor(enduranceImage, 'tintColor')
    enduranceStack.addSpacer(5)
    const enduranceTextStack = this.addStackTo(enduranceStack, 'horizontal')
    enduranceTextStack.bottomAlignContent()
    const enduranceText = enduranceTextStack.addText(data.fuelRange + 'km')
    enduranceText.font = new Font('Futura-Medium', 14)
    this.setWidgetNodeColor(enduranceText, 'textColor')
    // endregion
    rowLeftStack.addSpacer(5)
    // region 燃料信息
    const fuelStack = this.addStackTo(rowLeftStack, 'horizontal')
    fuelStack.bottomAlignContent()
    const fuelImageStack = this.addStackTo(fuelStack, 'vertical')
    fuelImageStack.bottomAlignContent()
    let fuelIcon = 'fuelpump.circle'
    if (data.socLevel) fuelIcon = 'bolt.circle'
    const fuelImage = fuelImageStack.addImage(await this.getSFSymbolImage(fuelIcon))
    fuelImage.imageSize = new Size(18, 18)
    this.setWidgetNodeColor(fuelImage, 'tintColor')
    fuelStack.addSpacer(5)
    // 汽油
    const fuelTextStack1 = this.addStackTo(fuelStack, 'horizontal')
    fuelTextStack1.bottomAlignContent()
    if (data.fuelLevel) {
      const fuelText1 = fuelTextStack1.addText(data.fuelLevel + '%')
      fuelText1.font = new Font('Futura-Medium', 14)
      this.setWidgetNodeColor(fuelText1, 'textColor')
      fuelStack.addSpacer(5)
    }
    // 电池
    if (data.socLevel) {
      const fuelTextStack2 = this.addStackTo(fuelStack, 'horizontal')
      fuelTextStack2.bottomAlignContent()
      const fuelText2 = fuelTextStack2.addText(data.socLevel + '%')
      fuelText2.font = new Font('Futura-Medium', 12)
      this.setWidgetNodeColor(fuelText2, 'textColor')
    }
    // endregion
    rowLeftStack.addSpacer(5)
    // region 总里程
    const mileageStack = this.addStackTo(rowLeftStack, 'horizontal')
    mileageStack.bottomAlignContent()
    const mileageImageStack = this.addStackTo(mileageStack, 'vertical')
    mileageImageStack.bottomAlignContent()
    const mileageImage = mileageImageStack.addImage(await this.getSFSymbolImage('car.circle'))
    mileageImage.imageSize = new Size(18, 18)
    this.setWidgetNodeColor(mileageImage, 'tintColor')
    mileageStack.addSpacer(5)
    const mileageTextStack = this.addStackTo(mileageStack, 'horizontal')
    mileageTextStack.bottomAlignContent()
    const mileageText = mileageTextStack.addText(data.mileage + 'km')
    mileageText.font = new Font('Futura-Medium', 14)
    this.setWidgetNodeColor(mileageText, 'textColor')
    // endregion
    rowLeftStack.addSpacer(5)
    // region 机油数据
    if (data.oilSupport && data.oilLevel !== '0.0') {
      const oilStack = this.addStackTo(rowLeftStack, 'horizontal')
      oilStack.bottomAlignContent()
      const oilImageStack = this.addStackTo(oilStack, 'vertical')
      oilImageStack.bottomAlignContent()
      const oilImage = oilImageStack.addImage(await this.getSFSymbolImage('drop.circle'))
      oilImage.imageSize = new Size(18, 18)
      if (Number(data.oilLevel) <= 12.5) {
        oilImage.tintColor = this.dangerColor
      } else {
        this.setWidgetNodeColor(oilImage, 'tintColor')
      }
      oilStack.addSpacer(5)
      const oilTextStack = this.addStackTo(oilStack, 'horizontal')
      oilTextStack.bottomAlignContent()
      const oilText = oilTextStack.addText(data.oilLevel + '%')
      oilText.font = new Font('Futura-Medium', 14)
      if (Number(data.oilLevel) <= 12.5) {
        oilText.textColor = this.dangerColor
      } else {
        this.setWidgetNodeColor(oilText, 'textColor')
      }
      rowLeftStack.addSpacer(5)
    }
    // endregion
    // region 锁车状态
    const lockedStack = this.addStackTo(rowLeftStack, 'horizontal')
    lockedStack.bottomAlignContent()
    const lockedImageStack = this.addStackTo(lockedStack, 'vertical')
    lockedImageStack.bottomAlignContent()
    const lockedImage = lockedImageStack.addImage(await this.getSFSymbolImage('lock.circle'))
    lockedImage.imageSize = new Size(18, 18)
    if (data.isLocked) {
      this.setWidgetNodeColor(lockedImage, 'tintColor')
    } else {
      lockedImage.tintColor = this.dangerColor
    }
    lockedStack.addSpacer(5)
    const lockedTextStack = this.addStackTo(lockedStack, 'horizontal')
    lockedTextStack.bottomAlignContent()
    const lockedText = lockedTextStack.addText(data.isLocked ? '已锁车' : '未锁车')
    lockedText.font = new Font('Futura-Medium', 14)
    if (data.isLocked) {
      this.setWidgetNodeColor(lockedText, 'textColor')
    } else {
      lockedText.textColor = this.dangerColor
    }
    // endregion
    rowLeftStack.addSpacer(5)
    // region 更新日期
    const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal')
    dateTimeStack.bottomAlignContent()
    const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical')
    dateTimeImageStack.bottomAlignContent()
    const dateTimeImage = dateTimeImageStack.addImage(await this.getSFSymbolImage('clock.arrow.2.circlepath'))
    dateTimeImage.imageSize = new Size(18, 18)
    this.setWidgetNodeColor(dateTimeImage, 'tintColor')
    dateTimeStack.addSpacer(5)
    const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal')
    dateTimeTextStack.bottomAlignContent()
    const dateTimeText = dateTimeTextStack.addText(data.updateTime)
    dateTimeText.font = new Font('Futura-Medium', 14)
    this.setWidgetNodeColor(dateTimeText, 'textColor')
    // endregion
    // endregion
    mainStack.addSpacer()
    // region 右侧车辆图片
    const rowRightStack = this.addStackTo(mainStack, 'vertical')
    rowRightStack.addSpacer()
    const carPhotoStack = this.addStackTo(rowRightStack, 'horizontal')
    carPhotoStack.addSpacer()
    carPhotoStack.centerAlignContent()
    const carPhoto = await this.getMyCarPhoto()
    const carPhotoImage = carPhotoStack.addImage(carPhoto)
    carPhotoImage.centerAlignImage()
    const statusStack = this.addStackTo(rowRightStack, 'vertical')
    statusStack.setPadding(5, 0, 0, 0)
    statusStack.centerAlignContent()
    const carStatus = [...data.doorStatus, ...data.windowStatus]
    // const carStatus = ['左前门', '后备箱', '右前窗', '右后窗', '天窗']
    if (carStatus.length !== 0) {
      const statusArray = this.format2Array(carStatus, 3)
      statusArray.forEach(arr => {
        const statusRowStack = this.addStackTo(statusStack, 'horizontal')
        statusRowStack.setPadding(2, 0, 2, 0)
        statusRowStack.centerAlignContent()
        arr.forEach(async (item) => {
          const statusItemStack = this.addStackTo(statusRowStack, 'horizontal')
          statusItemStack.addSpacer()
          statusItemStack.centerAlignContent()
          const image = await this.getSFSymbolImage('exclamationmark.shield.fill')
          const statusItemImage = statusItemStack.addImage(image)
          statusItemImage.imageSize = new Size(12, 12)
          statusItemImage.tintColor = this.warningColor
          statusItemStack.addSpacer(2)
          const statusItemText = statusItemStack.addText(item)
          statusItemText.font = new Font('PingFangSC-Regular', 12)
          statusItemText.textColor = this.warningColor
          statusItemText.centerAlignText()
          statusItemStack.addSpacer()
        })
      })
    } else {
      const statusItemStack = this.addStackTo(statusStack, 'horizontal')
      statusItemStack.setPadding(5, 0, 5, 0)
      statusItemStack.addSpacer()
      statusItemStack.centerAlignContent()
      const statusItemImage = statusItemStack.addImage(await this.getSFSymbolImage('checkmark.shield.fill'))
      statusItemImage.imageSize = new Size(12, 12)
      statusItemImage.tintColor = this.successColor
      statusItemStack.addSpacer(2)
      const statusItemText = statusItemStack.addText('当前车窗已全关闭')
      statusItemText.font = new Font('PingFangSC-Regular', 12)
      this.setWidgetNodeColor(statusItemText, 'textColor')
      statusItemText.centerAlignText()
      statusItemStack.addSpacer()
    }
    rowRightStack.addSpacer()
    // endregion
    // 地图/一言展示
    const leftImage = data.largeLocationPicture
    const rightText = data.showLocation ? data.completeAddress : data.myOne
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
    footerLeftStack.borderWidth = 2
    footerLeftStack.borderColor = Color.dynamic(new Color('#000000', 0.25), new Color('#ffffff', 0.25))
    const locationImage = await this.getImageByUrl(leftImage, !data.showLocation)
    const locationImageStack = footerLeftStack.addImage(locationImage)
    locationImageStack.imageSize = new Size(100, 60)
    if (!data.showLocation) this.setWidgetNodeColor(locationImageStack, 'tintColor')
    locationImageStack.centerAlignImage()
    footerStack.addSpacer()
    // 地理位置
    const footerRightStack = this.addStackTo(footerStack, 'vertical')
    const locationText = footerRightStack.addText(rightText)
    locationText.font = new Font('PingFangSC-Regular', 12)
    locationText.centerAlignText()
    this.setWidgetNodeColor(locationText, 'textColor')
    footerStack.addSpacer()
    // 有地理数据时候展示一言
    if (data.showLocation) {
      const oneStack = this.addStackTo(widget, 'horizontal')
      oneStack.setPadding(10, 0, 0, 0)
      oneStack.addSpacer()
      oneStack.centerAlignContent()
      const oneText = oneStack.addText(data.myOne)
      oneText.font = new Font('PingFangSC-Regular', 12)
      this.setWidgetNodeColor(oneText, 'textColor')
      oneText.centerAlignText()
      oneStack.addSpacer()
    }

    return widget
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget()

    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png'))

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
   * 获取数据
   * @param {boolean} debug 开启日志输出
   * @return {Promise<Object>}
   */
  async getData(debug = false) {
    // 日志追踪
    if (this.settings['trackingLogEnabled']) {
      const formatter = new DateFormatter()
      formatter.dateFormat = 'yyyy年MM月dd日 HH:mm:ss 更新\n'
      if (this.settings['debug_bootstrap_date_time']) {
        this.settings['debug_bootstrap_date_time'] += formatter.string(new Date())
      } else {
        this.settings['debug_bootstrap_date_time'] = '\n' + formatter.string(new Date())
      }
      await this.saveSettings(false)
    }

    const showLocation = this.settings['showLocation'] || false
    const showPlate = this.settings['showPlate'] || false

    const data = {
      carPlateNo: this.settings['carPlateNo'],
      seriesName: this.settings['myCarName'] || this.settings['seriesName'],
      carModelName: this.settings['myCarModelName'] || this.settings['carModelName'],
      carVIN: this.settings['carVIN'],
      myOne: this.settings['myOne'] || '世间美好，与您环环相扣',
      showLocation,
      showPlate,
      // 获取车辆状态信息
      ...await this.getVehiclesStatus(debug),
      // 获取车辆经纬度
      ...(showLocation ? await this.getVehiclesPosition(debug) : {}),
      // 获取车辆位置信息
      ...(showLocation ? await this.getCarAddressInfo(debug) : {}),
      // 获取静态位置图片
      largeLocationPicture: showLocation ? this.getCarAddressImage(debug) : 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/fvw_audi_joiner/audi_logo.png',
    }
    if (debug) {
      console.log('获取组件所需数据')
      console.log(data)
    }
    return data
  }

  /**
   * 传送给 Siri 快捷指令车辆信息数据
   * @returns {Object}
   */
  async siriShortcutData() {
    return await this.getData()
  }

  /**
   * 处理车辆状态信息
   * @param {Array} data 状态数据
   */
  handleVehiclesData(data) {
    // region 机油信息
    const oilSupport = data.find(i => i.id === '0x0204FFFFFF')?.field
    let oilLevel = null
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
    const fuelRange = statusArr.find(i => i.id === '0x0301030005')?.value || statusArr.find(i => i.id === '0x0301030006')?.value
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
    const formatter = new DateFormatter()
    formatter.dateFormat = 'MM-dd HH:mm'
    const updateDate = new Date(mileageArr.find(i => i.id === '0x0101010002').tsCarSentUtc)
    const updateTime = formatter.string(updateDate)
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
      await this.notify('请求失败', error)
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
      await this.notify('请求失败', error)
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
      await this.notify('请求失败', error)
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
      await this.notify('请求失败', error)
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
      await this.notify('请求失败', error)
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
      await this.notify('请求失败', error)
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
        let longitude = -1
        let latitude = -1
        if (response.storedPositionResponse) {
          longitude = response.storedPositionResponse.position.carCoordinate.longitude
          latitude = response.storedPositionResponse.position.carCoordinate.latitude
        } else if (response.findCarResponse) {
          longitude = response.findCarResponse.Position.carCoordinate.longitude
          latitude = response.findCarResponse.Position.carCoordinate.latitude
        }
        // todo 当 longitude 和 latitude 都返回 0 的时候做一下处理
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
    } catch (error) {
      await this.notify('请求失败', error)
      console.error(error)
      return {
        longitude: this.settings['longitude'] || 0,
        latitude: this.settings['latitude'] || 0
      }
    }
  }

  /**
   * 获取车辆地理位置信息
   * @param {boolean} debug 开启日志输出
   * @return {Promise<{simpleAddress, completeAddress}|{simpleAddress: *, completeAddress: *}>}
   */
  async getCarAddressInfo(debug = false) {
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
        const simpleAddress = addressComponent.district + addressComponent.township || '暂无位置信息'
        const completeAddress = response.regeocode.formatted_address || '暂无位置信息'
        this.settings['simpleAddress'] = simpleAddress
        this.settings['completeAddress'] = completeAddress
        await this.saveSettings(false)
        console.log('获取车辆地理位置信息成功')
        if (debug) {
          console.log('当前车辆地理位置：')
          console.log('简洁地址：' + simpleAddress)
          console.log('详细地址：' + completeAddress)
          console.log('车辆地理位置返回数据：')
          console.log(response)
        }
        return {
          simpleAddress,
          completeAddress
        }
      } else {
        console.error('获取车辆位置失败，请检查高德地图 key 是否填写正常')
        await this.notify('逆编码地理位置失败', '请检查高德地图 key 是否填写正常')
        return {
          simpleAddress: this.settings['simpleAddress'] || '暂无位置信息',
          completeAddress: this.settings['completeAddress'] || '暂无位置信息'
        }
      }
    } catch (error) {
      await this.notify('请求失败', error)
      console.error(error)
      return {
        simpleAddress: this.settings['simpleAddress'] || '暂无位置信息',
        completeAddress: this.settings['completeAddress'] || '暂无位置信息'
      }
    }
  }

  /**
   * 获取车辆地址位置静态图片
   * @param {boolean} debug 开启日志输出
   * @return {string}
   */
  getCarAddressImage(debug = false) {
    const longitude = this.settings['longitude']
    const latitude = this.settings['latitude']
    const aMapKey = this.settings['aMapKey']
    const aMapUrl = `https://restapi.amap.com/v3/staticmap?key=${aMapKey}&markers=mid,0xFF0000,0:${longitude},${latitude}&size=100*60&scale=2&zoom=12&traffic=1`
    if (debug) {
      console.log('位置图片请求地址：')
      console.log(aMapUrl)
    }
    return aMapUrl
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
   * 偏好设置
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings() {
    const alert = new Alert()
    alert.title = '组件个性化配置'
    alert.message = '根据您的喜好设置，更好展示组件数据'

    const menuList = [
      {
        name: 'setMyCarName',
        text: '自定义车辆名称',
        icon: '💡'
      }, {
        name: 'setMyCarModelName',
        text: '自定义车辆功率',
        icon: '🛻'
      }, {
        name: 'setMyCarPhoto',
        text: '自定义车辆照片',
        icon: '🚙'
      }, {
        name: 'setBackgroundConfig',
        text: '自定义组件背景',
        icon: '🎨'
      }, {
        name: 'setMyOne',
        text: '自定义一言一句',
        icon: '📝'
      }, {
        name: 'setAMapKey',
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
    await this[menuList[id].name]()
  }

  /**
   * 自定义车辆名称
   * @returns {Promise<void>}
   */
  async setMyCarName() {
    const alert = new Alert()
    alert.title = '车辆名称'
    alert.message = '如果您不喜欢系统返回的名称可以自己定义名称'
    alert.addTextField('请输入自定义名称', this.settings['myCarName'] || this.settings['seriesName'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarName'] = alert.textFieldValue(0) || this.settings['seriesName']
    await this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆功率
   * @returns {Promise<void>}
   */
  async setMyCarModelName() {
    const alert = new Alert()
    alert.title = '车辆功率'
    alert.message = '根据车辆实际情况可自定义功率类型，不填为系统默认'
    alert.addTextField('请输入自定义功率', this.settings['myCarModelName'] || this.settings['carModelName'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarModelName'] = alert.textFieldValue(0) || this.settings['carModelName']
    await this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆图片
   * @returns {Promise<void>}
   */
  async setMyCarPhoto() {
    const alert = new Alert()
    alert.title = '车辆图片'
    alert.message = '请在相册选择您最喜欢的车辆图片以便展示到小组件上，最好是全透明背景PNG图。'
    alert.addAction('选择照片')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    try {
      const image = await Photos.fromLibrary()
      const imagePath = this.localFile.joinPath(this.localFile.documentsDirectory(), `myCarPhoto_${this.SETTING_KEY}`)
      await this.localFile.writeImage(imagePath, image)
      this.settings['myCarPhoto'] = imagePath
      await this.saveSettings()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 自定义组件背景
   * @returns {Promise<void>}
   */
  async setBackgroundConfig() {
    const alert = new Alert()
    alert.title = '自定义组件背景'
    alert.message = '颜色背景和图片背景共同存存在时，图片背景设置优先级更高，将会加载图片背景\n' +
      '只有清除组件背景图片时候颜色背景才能生效！'

    const menuList = [{
      name: 'setColorBackground',
      text: '设置颜色背景',
      icon: '🖍'
    }, {
      name: 'setImageBackground',
      text: '设置图片背景',
      icon: '🏞'
    }, {
      name: 'actionPreferenceSettings',
      text: '返回上一级',
      icon: '👈'
    }]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this[menuList[id].name]()
  }

  /**
   * 设置组件颜色背景
   * @returns {Promise<void>}
   */
  async setColorBackground() {
    const alert = new Alert()
    alert.title = '自定义颜色背景'
    alert.message = '系统浅色模式适用于白天情景\n' +
      '系统深色模式适用于晚上情景\n' +
      '请根据自己的偏好进行设置，请确保您的手机「设置 - 显示与亮度」外观「自动」选项已打开'

    const menuList = [{
      name: 'setColorBackgroundLightMode',
      text: '系统浅色模式',
      icon: '🌕'
    }, {
      name: 'setColorBackgroundDarkMode',
      text: '系统深色模式',
      icon: '🌑'
    }, {
      name: 'setBackgroundConfig',
      text: '返回上一级',
      icon: '👈'
    }]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this[menuList[id].name]()
  }

  /**
   * 设置组件图片背景
   * @returns {Promise<void>}
   */
  async setImageBackground() {
    const alert = new Alert()
    alert.title = '自定义图片背景'
    alert.message = '目前自定义图片背景可以设置下列俩种场景\n' +
      '透明背景：因为组件限制无法实现，目前使用桌面图片裁剪实现所谓对透明组件，设置之前需要先对桌面壁纸进行裁剪哦，请选择「裁剪壁纸」菜单进行获取透明背景图片\n' +
      '图片背景：选择您最喜欢的图片作为背景'

    const menuList = [{
      name: 'setTransparentBackground',
      text: '透明壁纸',
      icon: '🌅'
    }, {
      name: 'setPhotoBackground',
      text: '自选图片',
      icon: '🌄'
    }, {
      name: 'setColorBackgroundTextColor',
      text: '字体颜色',
      icon: '✍️'
    }, {
      name: 'removeImageBackground',
      text: '移除图片',
      icon: '🪣'
    }, {
      name: 'setBackgroundConfig',
      text: '返回上一级',
      icon: '👈'
    }]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this[menuList[id].name]()
  }

  /**
   * 浅色模式背景
   * @returns {Promise<void>}
   */
  async setColorBackgroundLightMode() {
    const alert = new Alert()
    alert.title = '浅色模式颜色代码'
    alert.message = '如果都输入相同的颜色代码小组件则是纯色背景色，如果是不同的代码则是渐变背景色，不填写采取默认背景色\n\r' +
      '默认背景颜色代码：' + this.lightDefaultBackgroundColorGradient[0] + ' 和 ' + this.lightDefaultBackgroundColorGradient[1] + '\n\r' +
      '默认字体颜色代码：#000000'
    alert.addTextField('背景颜色代码一', this.settings['lightBgColor1'] || this.lightDefaultBackgroundColorGradient[0])
    alert.addTextField('背景颜色代码二', this.settings['lightBgColor2'] || this.lightDefaultBackgroundColorGradient[1])
    alert.addTextField('字体颜色', this.settings['lightTextColor'] || '#000000')
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.setColorBackground()
    const lightBgColor1 = alert.textFieldValue(0)
    const lightBgColor2 = alert.textFieldValue(1)
    const lightTextColor = alert.textFieldValue(2)

    this.settings['lightBgColor1'] = lightBgColor1
    this.settings['lightBgColor2'] = lightBgColor2
    this.settings['lightTextColor'] = lightTextColor
    await this.saveSettings()

    return await this.setColorBackground()
  }

  /**
   * 深色模式背景
   * @returns {Promise<void>}
   */
  async setColorBackgroundDarkMode() {
    const alert = new Alert()
    alert.title = '深色模式颜色代码'
    alert.message = '如果都输入相同的颜色代码小组件则是纯色背景色，如果是不同的代码则是渐变背景色，不填写采取默认背景色\n\r' +
      '默认背景颜色代码：' + this.darkDefaultBackgroundColorGradient[0] + ' 和 ' + this.darkDefaultBackgroundColorGradient[1] + '\n\r' +
      '默认字体颜色代码：#ffffff'
    alert.addTextField('颜色代码一', this.settings['darkBgColor1'] || this.darkDefaultBackgroundColorGradient[0])
    alert.addTextField('颜色代码二', this.settings['darkBgColor2'] || this.darkDefaultBackgroundColorGradient[1])
    alert.addTextField('字体颜色', this.settings['darkTextColor'] || '#ffffff')
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.setColorBackground()
    const darkBgColor1 = alert.textFieldValue(0)
    const darkBgColor2 = alert.textFieldValue(1)
    const darkTextColor = alert.textFieldValue(2)

    this.settings['darkBgColor1'] = darkBgColor1
    this.settings['darkBgColor2'] = darkBgColor2
    this.settings['darkTextColor'] = darkTextColor
    await this.saveSettings()

    return await this.setColorBackground()
  }

  /**
   * 透明（剪裁）壁纸
   * @returns {Promise<void>}
   */
  async setTransparentBackground() {
    let message = '开始之前，请转到主屏幕并进入桌面编辑模式，滚动到最右边的空页面，然后截图！'
    const exitOptions = ['前去截图', '继续']
    const shouldExit = await this.generateAlert(message, exitOptions)
    if (!shouldExit) return

    // Get screenshot and determine phone size.
    try {
      const img = await Photos.fromLibrary()
      const height = img.size.height
      const phone = this.phoneSizes()[height]
      if (!phone) {
        message = '您选择的照片好像不是正确的截图，或者您的机型暂时不支持。'
        await this.generateAlert(message,['OK'])
        return await this.setImageBackground()
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

      const imagePath = this.localFile.joinPath(this.localFile.documentsDirectory(), `backgroundPhoto${widgetSize}${widgetMode}_${this.SETTING_KEY}`)
      await this.localFile.writeImage(imagePath, imgCrop)
      this.settings['backgroundPhoto' + widgetSize + widgetMode] = imagePath
      await this.saveSettings()
      await this.setImageBackground()
    } catch (error) {
      // 取消图片会异常 暂时不用管
      console.error(error)
    }
  }

  /**
   * 自选图片
   * @returns {Promise<void>}
   */
  async setPhotoBackground() {
    try {
      let message = '您创建组件的是什么规格？'
      const sizes = ['小组件', '中组件', '大组件']
      const _sizes = ['Small','Medium','Large']
      const size = await this.generateAlert(message, sizes)
      const widgetSize = _sizes[size]

      // 系统外观模式
      message = '您要在系统外观设置什么模式？'
      const modes = ['浅色模式', '深色模式']
      const _modes = ['Light', 'Dark']
      const mode = await this.generateAlert(message, modes)
      const widgetMode = _modes[mode]
      const image = await Photos.fromLibrary()
      const imagePath = this.localFile.joinPath(this.localFile.documentsDirectory(), `backgroundPhoto${widgetSize}${widgetMode}_${this.SETTING_KEY}`)
      await this.localFile.writeImage(imagePath, image)
      this.settings['backgroundPhoto' + widgetSize + widgetMode] = imagePath
      await this.saveSettings()
      await this.setImageBackground()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 设置图片背景下的字体颜色
   * @return {Promise<void>}
   */
  async setColorBackgroundTextColor() {
    const alert = new Alert()
    alert.title = '字体颜色'
    alert.message = '仅在设置图片背景情境下进行对字体颜色更改，字体规格：#ffffff'
    alert.addTextField('请输入浅色模式字体颜色值', this.settings['backgroundImageLightTextColor'] || '#ffffff')
    alert.addTextField('请输入深色模式字体颜色值', this.settings['backgroundImageDarkTextColor'] || '#000000')
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.setImageBackground()
    this.settings['backgroundImageLightTextColor'] = alert.textFieldValue(0)
    this.settings['backgroundImageDarkTextColor'] = alert.textFieldValue(1)
    await this.saveSettings()

    return await this.setImageBackground()
  }

  /**
   * 移除背景图片
   * @return {Promise<void>}
   */
  async removeImageBackground() {
    this.settings['backgroundPhotoSmallLight'] = undefined
    this.settings['backgroundPhotoSmallDark'] = undefined
    this.settings['backgroundPhotoMediumLight'] = undefined
    this.settings['backgroundPhotoMediumDark'] = undefined
    this.settings['backgroundPhotoLargeLight'] = undefined
    this.settings['backgroundPhotoLargeDark'] = undefined
    await this.saveSettings()
    await this.setImageBackground()
  }

  /**
   * 输入一言
   * @returns {Promise<void>}
   */
  async setMyOne() {
    const alert = new Alert()
    alert.title = '输入一言'
    alert.message = '请输入一言，将会在桌面展示语句，不填则显示 "世间美好，与您环环相扣"'
    alert.addTextField('请输入一言', this.settings['myOne'] || '世间美好，与您环环相扣')
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myOne'] = alert.textFieldValue(0) ? alert.textFieldValue(0) : '世间美好，与您环环相扣'
    await this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 高德地图Key
   * @returns {Promise<void>}
   */
  async setAMapKey() {
    const alert = new Alert()
    alert.title = '高德地图密钥'
    alert.message = '请输入组件所需要的高德地图 key 用于车辆逆地理编码以及地图资源'
    alert.addTextField('key 密钥', this.settings['aMapKey'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['aMapKey'] = alert.textFieldValue(0)
    await this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 车辆位置显示
   * @returns {Promise<void>}
   */
  async showLocation() {
    const alert = new Alert()
    alert.title = '是否显示车辆地理位置'
    alert.message = this.settings['showLocation'] ? '当前地理位置状态已开启' : '当前地理位置状态已关闭'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    if (id === -1) {
      // 关闭显示位置
      this.settings['showLocation'] = false
      await this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    // 开启显示位置
    this.settings['showLocation'] = true
    await this.saveSettings()
    return await this.actionPreferenceSettings()
  }

  /**
   * 车牌显示
   * @returns {Promise<void>}
   */
  async showPlate() {
    const alert = new Alert()
    alert.title = '是否显示车牌显示'
    alert.message = this.settings['showPlate'] ? '当前车牌显示状态已开启' : '当前车牌显示状态已关闭'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    if (id === -1) {
      // 关闭车牌显示
      this.settings['showPlate'] = false
      await this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    // 开启车牌显示
    this.settings['showPlate'] = true
    await this.saveSettings()
    return await this.actionPreferenceSettings()
  }

  /**
   * 刷新数据
   */
  async actionRefreshData() {
    const alert = new Alert()
    alert.title = '刷新数据'
    alert.message = '如果发现数据延迟，选择对应函数获取最新数据，同样也是获取日志分享给开发者使用。'

    const menuList = [{
      name: 'getData',
      text: '全部信息'
    }, {
      name: 'handleLoginRequest',
      text: '用户信息数据'
    }, {
      name: 'getVehiclesStatus',
      text: '当前车辆状态数据'
    }, {
      name: 'getVehiclesPosition',
      text: '车辆经纬度数据'
    }, {
      name: 'getCarAddressInfo',
      text: '车辆位置数据'
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
   * 重置登出
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
      'clientID',
      'carPlateNo',
      'seriesName',
      'carModelName',
      'carVIN',
      'longitude',
      'latitude',
      'vehicleData',
      'simpleAddress',
      'completeAddress',
      'username',
      'password',
      'userAccessToken',
      'userIDToken',
      'refreshAuthToken',
      'authToken',
      'ApiBaseURI',
      'aMapKey',
      'isLogin'
    ]
    keys.forEach(key => {
      this.settings[key] = undefined
      delete this.settings[key]
      console.log(key + ' 缓存信息已删除')
    })
    if (Keychain.contains(this.SETTING_KEY)) Keychain.remove(this.SETTING_KEY)
    await this.notify('登出成功', '敏感信息已全部删除')
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
   * 调试日志
   */
  async actionDebug() {
    const alert = new Alert()
    alert.title = '组件调试日志'
    alert.message = '用于调试一些奇怪的问题，配合开发者调试数据'

    const menuList = [{
      name: 'setTrackingLog',
      text: '数据追踪日志'
    }, {
      name: 'viewTrackingLog',
      text: '查阅追踪日志'
    }, {
      name: 'clearTrackingLog',
      text: '清除追踪日志'
    }]

    menuList.forEach(item => {
      alert.addAction(item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this[menuList[id].name]()
  }

  /**
   * 开启日志追踪
   * @returns {Promise<void>}
   */
  async setTrackingLog() {
    const alert = new Alert()
    alert.title = '是否开启数据更新日志追踪'
    alert.message = this.settings['trackingLogEnabled'] ? '当前日志追踪状态已开启' : '当前日志追踪状态已关闭'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    this.settings['trackingLogEnabled'] = id !== -1
    await this.saveSettings(false)
    return await this.actionDebug()
  }

  /**
   * 查阅日志
   * @returns {Promise<void>}
   */
  async viewTrackingLog() {
    console.log(this.settings['debug_bootstrap_date_time'])

    const alert = new Alert()
    alert.title = '查阅跟踪日志'
    alert.message = this.settings['debug_bootstrap_date_time']
    alert.addAction('关闭')
    await alert.presentAlert()
  }

  /**
   * 清除日志
   * @returns {Promise<void>}
   */
  async clearTrackingLog() {
    this.settings['debug_bootstrap_date_time'] = undefined
    await this.saveSettings(false)
  }

  /**
   * 关于组件
   */
  async actionAbout() {
    Safari.open( 'https://joiner.i95.me/about.html')
  }

  /**
   * 获取动态字体颜色
   * @returns {Color}
   */
  dynamicTextColor() {
    const lightTextColor = this.settings['lightTextColor'] ? this.settings['lightTextColor'] : '#000000'
    const darkTextColor = this.settings['darkTextColor'] ? this.settings['darkTextColor'] : '#ffffff'
    return Color.dynamic(new Color(lightTextColor, 1), new Color(darkTextColor, 1))
  }

  /**
   * 动态背景色
   * @returns {LinearGradient}
   */
  dynamicBackgroundColor() {
    const bgColor = new LinearGradient()

    const lightBgColor1 = this.settings['lightBgColor1'] ? this.settings['lightBgColor1'] : this.lightDefaultBackgroundColorGradient[0]
    const lightBgColor2 = this.settings['lightBgColor2'] ? this.settings['lightBgColor2'] : this.lightDefaultBackgroundColorGradient[1]
    const darkBgColor1 = this.settings['darkBgColor1'] ? this.settings['darkBgColor1'] : this.darkDefaultBackgroundColorGradient[0]
    const darkBgColor2 = this.settings['darkBgColor2'] ? this.settings['darkBgColor2'] : this.darkDefaultBackgroundColorGradient[1]

    const startColor = Color.dynamic(new Color(lightBgColor1, 1), new Color(darkBgColor1, 1))
    const endColor = Color.dynamic(new Color(lightBgColor2, 1), new Color(darkBgColor2, 1))

    bgColor.colors = [startColor, endColor]

    bgColor.locations = [0.0, 1.0]

    return bgColor
  }

  /**
   * 动态设置组件字体或者图片颜色
   * @param {WidgetText || WidgetImage} widget
   * @param {'textColor' || 'tintColor'} type
   */
  setWidgetNodeColor(widget, type = 'textColor') {
    if (
      this.settings['backgroundPhotoSmallLight'] ||
      this.settings['backgroundPhotoSmallDark'] ||
      this.settings['backgroundPhotoMediumLight'] ||
      this.settings['backgroundPhotoMediumDark'] ||
      this.settings['backgroundPhotoLargeLight'] ||
      this.settings['backgroundPhotoLargeDark']
    ) {
      const lightTextColor = this.settings['backgroundImageLightTextColor'] || '#ffffff'
      const darkTextColor = this.settings['backgroundImageDarkTextColor'] || '#000000'
      widget[type] = Color.dynamic(new Color(lightTextColor, 1), new Color(darkTextColor, 1))
    } else {
      widget[type] = this.dynamicTextColor()
    }
  }

  /**
   * 动态设置组件字体或者图片颜色
   * @param {ListWidget} widget
   * @param {'Small' || 'Medium' || 'Large'} widgetFamily
   */
  async setWidgetDynamicBackground(widget, widgetFamily) {
    if (await this.isUsingDarkAppearance() === false && this.settings['backgroundPhoto' + widgetFamily + 'Light']) {
      widget.backgroundImage = await this.localFile.readImage(this.settings['backgroundPhoto' + widgetFamily + 'Light'])
    } else if (await this.isUsingDarkAppearance() === true && this.settings['backgroundPhoto' + widgetFamily + 'Dark']) {
      widget.backgroundImage = await this.localFile.readImage(this.settings['backgroundPhoto' + widgetFamily + 'Dark'])
    } else {
      widget.backgroundGradient = this.dynamicBackgroundColor()
    }
  }

  /**
   * 获取用户车辆照片
   * @returns {Promise<Image|*>}
   */
  async getMyCarPhoto() {
    let myCarPhoto = await this.getImageByUrl('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png')
    if (this.settings['myCarPhoto']) myCarPhoto = await FileManager.local().readImage(this.settings['myCarPhoto'])
    return myCarPhoto
  }

  /**
   * SFSymbol 图标
   * @param sfSymbolName
   * @returns {Promise<Image>}
   */
  async getSFSymbolImage(sfSymbolName) {
    return await this.getImageByUrl(`https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/fvw_audi_joiner/sf_icons/${sfSymbolName}@2x.png`)
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
// await Testing(Widget)
(async function() {
  await Testing(Widget)
})()
