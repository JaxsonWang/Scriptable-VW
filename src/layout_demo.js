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
    let rowLogo = this.addStackTo(widget, 'horizontal')
    rowLogo.centerAlignContent()

    const logoStack = this.addStackTo(rowLogo, 'vertical')
    const airtelLogo = await this.getImageByUrl(DEFAULT_AUDI_LOGO)
    const airtelLogoImg = logoStack.addImage(airtelLogo)
    airtelLogoImg.imageSize = new Size(60, 30)

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

    // region 右侧车辆图片
    const carStack = this.addStackTo(mainStack, 'vertical')
    const carPhoto = await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO)
    const carPhotoStack = carStack.addImage(carPhoto)
    carPhotoStack.rightAlignImage()
    // carPhotoStack.imageSize = new Size(120, 180)
    // endregion

    mainStack.addSpacer()

    // region 状态信息展示
    const rowStack1 = this.addStackTo(mainStack, 'vertical')

    const infoStack1 = this.addStackTo(rowStack1, 'vertical')

    const metaStack1 = this.addStackTo(infoStack1, 'vertical')
    const imageStack1 = metaStack1.addImage(this.getSFSymbolImage('car.fill'))
    imageStack1.imageSize = new Size(20, 20)

    const metaStack2 = this.addStackTo(infoStack1, 'horizontal')
    const textMetaStack1 = metaStack2.addText('210km')
    textMetaStack1.font = Font.mediumSystemFont(12)
    const textMetaStack2 = metaStack2.addText('18%')
    textMetaStack2.font = Font.mediumSystemFont(12)
    textMetaStack2.textColor = 18 < 20 ? new Color('#000000', 1) : this.getColorForPercentage(18)
    // const textMetaStack3 = metaStack2.addText('56%')
    // textMetaStack3.font = Font.mediumSystemFont(8)

    const infoStack2 = this.addStackTo(rowStack1, 'vertical')

    const metaStack3 = this.addStackTo(infoStack2, 'vertical')
    const textStack3 = metaStack3.addText('测试3')
    textStack3.font = Font.mediumSystemFont(16)

    const metaStack4 = this.addStackTo(infoStack2, 'vertical')
    const textStack4 = metaStack4.addText('测试4')
    textStack4.font = Font.mediumSystemFont(16)

    const rowStack2 = this.addStackTo(mainStack, 'vertical')

    const infoStack3 = this.addStackTo(rowStack2, 'vertical')

    const metaStack5 = this.addStackTo(infoStack3, 'vertical')
    const textStack5 = metaStack5.addText('测试5')
    textStack5.font = Font.mediumSystemFont(16)

    const metaStack6 = this.addStackTo(infoStack3, 'vertical')
    const textStack6 = metaStack6.addText('测试6')
    textStack6.font = Font.mediumSystemFont(16)

    const infoStack4 = this.addStackTo(rowStack2, 'vertical')

    const metaStack7 = this.addStackTo(infoStack4, 'vertical')
    const textStack7 = metaStack7.addText('测试7')
    textStack7.font = Font.mediumSystemFont(16)

    const metaStack8 = this.addStackTo(infoStack4, 'vertical')
    const textStack8 = metaStack8.addText('测试8')
    textStack8.font = Font.mediumSystemFont(16)
    // endregion

    // endregion

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
