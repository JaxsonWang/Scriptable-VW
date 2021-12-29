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
   */
  async renderSmall(data) {
    const widget = new ListWidget()
    widget.addText('Hello World').centerAlignText()
    return widget
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium(data) {
    const widget = new ListWidget()
    const padding = 10
    widget.setPadding(padding, padding, padding, padding)
    widget.backgroundColor = Color.red()

    // logo
    let rowLogo = this.addStackTo(widget, 'horizontal')
    rowLogo.centerAlignContent()
    rowLogo.backgroundColor = Color.blue()

    const logoStack = this.addStackTo(rowLogo, 'vertical')
    logoStack.backgroundColor = Color.darkGray()
    const airtelLogo = await this.getImageByUrl(DEFAULT_AUDI_LOGO)
    const airtelLogoImg = logoStack.addImage(airtelLogo)
    airtelLogoImg.imageSize = new Size(60, 30)
    airtelLogoImg.tintColor = new Color('#e6e6e6', 1)

    rowLogo.addSpacer()

    const headlineSurroundingStack = this.addStackTo(rowLogo, 'vertical')
    headlineSurroundingStack.backgroundColor = Color.brown()
    const headlineLabel = headlineSurroundingStack.addText('苏DY38AZ8')
    headlineLabel.leftAlignText()
    headlineLabel.font = Font.mediumSystemFont(16)
    headlineLabel.textColor = new Color('#e6e6e6', 1)

    return widget
  }

  /**
   * 渲染大尺寸组件
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
   * @returns {Promise<{Object}>}
   */
  async bootstrap() {
    return {}
  }

  /**
   * 获取数据
   */
  async getData() {
    return await this.bootstrap()
  }

  async getAirtelIcon(){
    let airtelIcon

    let fm = FileManager.iCloud()
    let backgroundImagePath = fm.joinPath(fm.documentsDirectory(), "AirtelLogo.png")
    if (fm.fileExists(backgroundImagePath)){
      airtelIcon = fm.readImage(backgroundImagePath)
    } else {
      let req = new Request("https://i.imgur.com/VJoIn5v.png")
      airtelIcon = await req.loadImage()
      fm.writeImage(backgroundImagePath, airtelIcon)
    }
    return airtelIcon
  }

  /**
   * 新增 Stack 布局
   * @param {WidgetStack | ListWidget} stack
   * @param {'horizontal' | 'vertical'} layout
   * @returns {WidgetStack}
   */
  addStackTo(stack, layout) {
    const newStack = stack.addStack()
    layout === 'horizontal' ? newStack.layoutHorizontally() : newStack.layoutVertically()
    return newStack
  }
}

// @组件代码结束
await Testing(Widget)
