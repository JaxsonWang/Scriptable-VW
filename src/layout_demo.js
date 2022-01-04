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
    const padding = 10
    widget.setPadding(padding, padding, padding, padding)

    // region logoStack
    const rowLogo = this.addStackTo(widget, 'horizontal')
    rowLogo.centerAlignContent()

    const logoStack = this.addStackTo(rowLogo, 'vertical')
    const airtelLogo = await this.getImageByUrl(DEFAULT_AUDI_LOGO)
    const airtelLogoImg = logoStack.addImage(airtelLogo)
    airtelLogoImg.imageSize = new Size(60, 30)
    airtelLogoImg.tintColor = new Color('#ffffff', 1)

    rowLogo.addSpacer()

    const headlineSurroundingStack = this.addStackTo(rowLogo, 'vertical')
    const headlineLabel = headlineSurroundingStack.addText('苏DY38Z8')
    headlineLabel.leftAlignText()
    headlineLabel.font = Font.mediumSystemFont(16)
    // endregion

    widget.addSpacer(4)

    // region mainStack
    const mainStack = this.addStackTo(widget, 'horizontal')
    mainStack.centerAlignContent()

    mainStack.addSpacer()

    // region 状态信息展示
    const rowStack1 = this.addStackTo(mainStack, 'vertical')

    const infoStack1 = this.addStackTo(rowStack1, 'horizontal')
    infoStack1.bottomAlignContent()

    const metaStack1 = this.addStackTo(infoStack1, 'vertical')
    metaStack1.bottomAlignContent()
    const imageStack1 = metaStack1.addImage(this.getSFSymbolImage('fuelpump.fill'))
    imageStack1.imageSize = new Size(20, 20)
    imageStack1.tintColor = new Color('#ffffff', 1)

    infoStack1.addSpacer(5)

    const metaStack2 = this.addStackTo(infoStack1, 'horizontal')
    metaStack2.bottomAlignContent()
    const textMetaStack1 = metaStack2.addText('210km')
    textMetaStack1.font = Font.boldMonospacedSystemFont(14)
    metaStack2.addSpacer(3)
    const textMetaStack2 = metaStack2.addText('21%')
    textMetaStack2.font = Font.mediumSystemFont(12)
    metaStack2.addSpacer(1)
    const textMetaStack3 = metaStack2.addText('56%')
    textMetaStack3.font = Font.mediumSystemFont(8)

    rowStack1.addSpacer(2)

    const infoStack2 = this.addStackTo(rowStack1, 'horizontal')
    infoStack2.bottomAlignContent()
    const metaStack3 = this.addStackTo(infoStack2, 'vertical')
    metaStack3.bottomAlignContent()
    const imageStack2 = metaStack3.addImage(this.getSFSymbolImage('car.fill'))
    imageStack2.imageSize = new Size(20, 20)
    imageStack2.tintColor = new Color('#ffffff', 1)

    infoStack2.addSpacer(5)

    const metaStack4 = this.addStackTo(infoStack2, 'horizontal')
    metaStack4.bottomAlignContent()
    const textStack4 = metaStack4.addText('22941km')
    textStack4.font = Font.mediumSystemFont(12)

    rowStack1.addSpacer(2)

    const infoStack3 = this.addStackTo(rowStack1, 'horizontal')
    infoStack3.bottomAlignContent()
    const metaStack5 = this.addStackTo(infoStack3, 'vertical')
    metaStack5.bottomAlignContent()
    const imageStack3 = metaStack5.addImage(this.getSFSymbolImage('clock.arrow.circlepath'))
    imageStack3.imageSize = new Size(21, 20)
    imageStack3.tintColor = new Color('#ffffff', 1)

    infoStack3.addSpacer(5)

    const metaStack6 = this.addStackTo(infoStack3, 'horizontal')
    metaStack6.bottomAlignContent()
    const textStack5 = metaStack6.addText('2020-12-01 12:20:12')
    textStack5.font = Font.mediumSystemFont(12)
    // endregion

    // region 右侧车辆图片
    const carStack = this.addStackTo(mainStack, 'vertical')
    const carPhoto = await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO)
    const carPhotoStack = carStack.addImage(carPhoto)
    carPhotoStack.rightAlignImage()
    // endregion

    // endregion

    widget.addSpacer(2)

    const locationText = widget.addText('江苏省苏州市工业园区斜塘街翰林苑小区')
    locationText.font = Font.mediumSystemFont(12)
    locationText.centerAlignText()

    return widget
  }

  /**
   * 渲染大尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderLarge(data) {
    const widget = new ListWidget()
    widget.addText('Hello World').centerAlignText()
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
