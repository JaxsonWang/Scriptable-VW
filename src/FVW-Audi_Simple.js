// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: star;
//
// iOS 桌面组件脚本
// 开发说明：请从 Widget 类开始编写，注释请勿修改
//

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const { Base, Testing } = require('./depend')

// @组件代码开始
const SCRIPT_VERSION = '1.0.0'

const DEFAULT_AUDI_LOGO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/logo_20211127.png'

class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Audi Joiner 简约主题'
    this.desc = '依赖 FVW-Audi-Joiner 组件，额外支持全新风格主题'

    this.appSettings = this.getSettings(true, this.md5('FVW-Audi-Joiner'))

    if (config.runsInApp) {
      if (this.appSettings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('当前版本: v' + SCRIPT_VERSION, this.actionAbout)
    }
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render() {
    const data = await this.getData()
    if (data.isLogin) {
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
    widget.addText('开发者正在快马加鞭制作中...').centerAlignText()
    return widget
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium(data) {
    const widget = new ListWidget()
    widget.backgroundImage = await this.getImageByUrl(this.simpleTemplatePath('scriptable_style_type1_background'))

    const isEn = data.lang === 'English'
    const container = this.addStackTo(widget, 'horizontal')
    // container.addSpacer()

    const leftStack = this.addStackTo(container, 'vertical')
    const leftTopStack = this.addStackTo(leftStack, 'vertical')
    const logoStack = this.addStackTo(leftTopStack, 'horizontal')
    const logoImage = logoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    logoImage.imageSize = new Size(60, 20)
    logoImage.tintColor = new Color('#838383', 1)
    leftStack.addSpacer()
    const infoStack = this.addStackTo(leftTopStack, 'vertical')
    infoStack.addSpacer()
    // Car Name
    const nameStack = this.addStackTo(infoStack, 'horizontal')
    const nameText = nameStack.addText(data.seriesName)
    nameText.textColor = new Color('#ffffff', 1)
    nameText.font = isEn ? new Font('Futura-Medium', 22) : new Font('PingFangSC-Medium', 22)
    infoStack.spacing = 4
    // Time
    const updateStack = this.addStackTo(infoStack, 'horizontal')
    const updateImage = updateStack.addImage(await this.getSFSymbolImage('clock.badge.checkmark'))
    updateImage.tintColor = new Color('#838383', 1)
    updateImage.imageSize = new Size(14, 14)
    updateStack.spacing = 2
    const updateText = updateStack.addText(this.formatDate(new Date(data.updateTimeStamp), 'yyyy-MM-dd HH:mm'))
    updateText.textColor = new Color('#838383', 1)
    updateText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 12) : new Font('PingFangSC-Medium', 12)

    leftStack.addSpacer()
    // bottom left
    const leftBottomStack = this.addStackTo(leftStack, 'vertical')
    // region 续航里程
    const enduranceStack = this.addStackTo(leftBottomStack, 'horizontal')
    enduranceStack.centerAlignContent()
    const enduranceImageStack = this.addStackTo(enduranceStack, 'vertical')
    enduranceImageStack.centerAlignContent()
    const enduranceImage = enduranceImageStack.addImage(await this.getSFSymbolImage('signpost.right'))
    enduranceImage.imageSize = new Size(14, 16)
    enduranceImage.tintColor = new Color('#838383', 1)
    enduranceStack.addSpacer(5)
    const enduranceTextStack = this.addStackTo(enduranceStack, 'horizontal')
    enduranceTextStack.bottomAlignContent()
    const enduranceText = enduranceTextStack.addText(`${isEn ? 'Range' : '续航'}: ${data.fuelRange} km`)
    enduranceText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14)
    enduranceText.textColor = new Color('#838383', 1)
    // endregion
    leftBottomStack.spacing = 5
    // region 燃料信息
    const fuelStack = this.addStackTo(leftBottomStack, 'horizontal')
    fuelStack.centerAlignContent()
    const fuelImageStack = this.addStackTo(fuelStack, 'vertical')
    fuelImageStack.centerAlignContent()
    const fuelImage = fuelImageStack.addImage(await this.getSFSymbolImage('speedometer'))
    fuelImage.imageSize = new Size(14, 14)
    fuelImage.tintColor = new Color('#838383', 1)
    fuelStack.addSpacer(5)

    const fuelTitleStack = this.addStackTo(fuelStack, 'horizontal')
    fuelTitleStack.bottomAlignContent()
    const fuelTitle = fuelTitleStack.addText(`${isEn ? 'Fuel Level' : '燃料'}: `)
    fuelTitle.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14)
    fuelTitle.textColor = new Color('#838383', 1)
    if (data.fuelLevel) {
      // 汽油
      const fuelTextStack = this.addStackTo(fuelStack, 'horizontal')
      fuelTextStack.bottomAlignContent()
      const fuelText = fuelTextStack.addText(`${data.fuelLevel}%`)
      fuelText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14)
      fuelText.textColor = new Color('#838383', 1)
      fuelStack.addSpacer(5)
    }
    // 电池
    if (data.socLevel) {
      const socTextStack = this.addStackTo(fuelStack, 'horizontal')
      socTextStack.bottomAlignContent()
      const socText = socTextStack.addText(`${data.socLevel}%`)
      socText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14)
      socText.textColor = new Color('#838383', 1)
    }
    // endregion

    container.addSpacer()
    const rightStack = this.addStackTo(container, 'vertical')
    rightStack.addSpacer()
    const rightTopStack = this.addStackTo(rightStack, 'vertical')
    const carPhoto = await this.getMyCarPhoto()
    const carPhotoStack = rightTopStack.addImage(carPhoto)
    carPhotoStack.centerAlignImage()
    rightStack.spacing = 5
    const rightBottomStack = this.addStackTo(rightStack, 'horizontal')
    rightBottomStack.addSpacer()
    const statusStack = this.addStackTo(rightBottomStack, 'horizontal')
    statusStack.centerAlignContent()
    statusStack.backgroundColor = new Color('#ffffff', 0.25)
    statusStack.borderColor = data.isLocked ? new Color('#ffffff', 0.5) : this.dangerColor(0.5)
    statusStack.borderWidth = 2
    statusStack.cornerRadius = 5
    statusStack.setPadding(5, 15, 5, 15)
    statusStack.centerAlignContent()
    // 锁车解锁图标
    const statusIcon = statusStack.addImage(data.isLocked ? await this.getSFSymbolImage('lock.fill') : await this.getSFSymbolImage('lock.open.fill'))
    statusIcon.imageSize = new Size(18, 18)
    statusIcon.tintColor = data.isLocked ? new Color('#ffffff', 0.5) : this.dangerColor(1)
    statusStack.spacing = 5
    const statusText = statusStack.addText(data.isLocked ? isEn ? 'Car locked' : '已锁车' : isEn ? 'Car unlocked' : '未锁车')
    statusText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14)
    statusText.textColor = data.isLocked ? new Color('#ffffff', 0.5) : this.dangerColor(1)
    rightBottomStack.addSpacer()
    container.addSpacer()
    return widget
  }

  /**
   * 渲染大尺寸组件
   */
  async renderLarge(data) {
    const widget = new ListWidget()
    widget.addText('开发者正在快马加鞭制作中...').centerAlignText()
    return widget
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget()
    widget.addText('请使用 Audi Joiner 组件才能使用本主题组件').centerAlignText()
    return widget
  }

  /**
   * 获取数据
   */
  async getData() {
    const data = this.appSettings['widgetData'] || {}
    if (this.settings['myCarName']) data.seriesName = this.settings['myCarName']
    data.lang = this.settings['widgetLang'] ? this.settings['widgetLang'] : 'Chinese'
    return data
  }

  /**
   * 获取用户车辆照片
   * @returns {Promise<Image|*>}
   */
  async getMyCarPhoto() {
    let myCarPhoto = await this.getImageByUrl('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png')
    if (this.appSettings['myCarPhoto']) myCarPhoto = await FileManager.local().readImage(this.appSettings['myCarPhoto'])
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
        name: 'setMyCarPhoto',
        text: '自定义车辆照片',
        icon: '🚙'
      }, {
        name: 'setWidgetLang',
        text: '设置展示语言',
        icon: '🤟'
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
    alert.addTextField('请输入自定义名称', this.settings['myCarName'] || this.appSettings['myCarName'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarName'] = alert.textFieldValue(0) || this.appSettings['myCarName']
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
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `myCarPhoto_${this.SETTING_KEY}`)
      await FileManager.local().writeImage(imagePath, image)
      this.settings['myCarPhoto'] = imagePath
      await this.saveSettings()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 设置组件语言
   * @returns {Promise<void>}
   */
  async setWidgetLang() {
    const alert = new Alert()
    alert.title = '组件展示语言'
    alert.message = '根据语言习惯设置组件语言'
    alert.addAction('英文')
    alert.addCancelAction('中文')

    const id = await alert.presentAlert()
    if (id === -1) {
      this.settings['widgetLang'] = 'Chinese'
      await this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    this.settings['widgetLang'] = 'English'
    await this.saveSettings()
    return await this.actionPreferenceSettings()
  }

  /**
   * 检查更新
   */
  async actionCheckUpdate() {
    const UPDATE_FILE = 'FVW-Audi_Theme-Simple.js'
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    const request = new Request('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/themes/fvw-audi-simple-theme.json')
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

    await this.notify('Audi 桌面组件主题更新完毕！')
  }

  /**
   * 关于组件
   */
  async actionAbout() {
    Safari.open( 'https://joiner.i95.me/about.html')
  }

  /**
   * 固定模板 - 简约风格图片路径
   * @param name
   * @return {string}
   */
  simpleTemplatePath(name) {
    return 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/simple_template/' + name + '.png'
  }
}

// @组件代码结束
await Testing(Widget)
