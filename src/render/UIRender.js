import Core from '../base/Core'
import { format2Array } from '../utils/index'

class UIRender extends Core {
  constructor(args = '') {
    super(args)

    // 默认背景色
    this.lightDefaultBackgroundColorGradient = ['#ffffff', '#dbefff']
    this.darkDefaultBackgroundColorGradient = ['#414345', '#232526']

    this.myCarPhotoUrl = ''
    this.myCarLogoUrl = ''
    this.logoWidth = 0
    this.logoHeight = 0

    this.defaultMyOne = ''
    this.locationBorderRadius = 15
  }

  /**
   * 成功色调
   * @param alpha
   * @returns {Color}
   */
  successColor = (alpha = 1) => new Color('#67C23A', alpha)

  /**
   * 警告色调
   * @param alpha
   * @returns {Color}
   */
  warningColor = (alpha = 1) => new Color('#E6A23C', alpha)

  /**
   * 危险色调
   * @param alpha
   * @returns {Color}
   */
  dangerColor = (alpha = 1) => new Color('#F56C6C', alpha)

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
   * 正常锁车风格
   * @returns {boolean}
   */
  getLockSuccessStyle() {
    return this.settings['lockSuccessStyle'] === 'successColor'
  }

  /**
   * logo 填充
   * @returns {boolean}
   */
  getLogoHasTint() {
    return this.settings['logoTintType'] ? this.settings['logoTintType'] === 'fontColor' : true
  }

  /**
   * 大组件弧度
   * @returns {number}
   */
  getLocationBorderRadius() {
    return parseInt(this.settings['locationBorderRadius'], 10) || this.locationBorderRadius
  }

  /**
   * 获取 logo 大小
   * @param {'width' || 'height'} type
   */
  getLogoSize(type) {
    if (type === 'width') return parseInt(this.settings['logoWidth'], 10) || this.logoWidth
    if (type === 'height') return parseInt(this.settings['logoHeight'], 10) || this.logoHeight
  }

  /**
   * 动态设置组件字体或者图片颜色
   * @param {WidgetText || WidgetImage || WidgetStack} widget
   * @param {'textColor' || 'tintColor' || 'borderColor' || 'backgroundColor'} type
   * @param {number} alpha
   */
  setWidgetNodeColor(widget, type = 'textColor', alpha = 1) {
    if (this.settings['backgroundPhotoMode']) {
      const textColor = this.settings['backgroundImageTextColor'] || '#ffffff'
      widget[type] = new Color(textColor, alpha)
    } else {
      const lightTextColor = this.settings['lightTextColor'] ? this.settings['lightTextColor'] : '#000000'
      const darkTextColor = this.settings['darkTextColor'] ? this.settings['darkTextColor'] : '#ffffff'
      widget[type] = Color.dynamic(new Color(lightTextColor, alpha), new Color(darkTextColor, alpha))
    }
  }

  /**
   * 给图片加一层半透明遮罩
   * @param {Image} img 要处理的图片
   * @param {string} color 遮罩背景颜色
   * @param {number} opacity 透明度
   * @returns {Promise<Image>}
   */
  async shadowImage(img, color = '#000000', opacity = 0.7) {
    let ctx = new DrawContext()
    // 获取图片的尺寸
    ctx.size = img.size

    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color(color, opacity))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))

    return ctx.getImage()
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
   * 组件声明
   * @returns {Promise<number>}
   */
  async actionStatementSettings(message) {
    const alert = new Alert()
    alert.title = 'Joiner 组件声明'
    alert.message = message
    alert.addAction('同意')
    alert.addCancelAction('不同意')
    return await alert.presentAlert()
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
   * 动态设置组件背景色
   * @param {ListWidget || WidgetStack} widget
   * @param {'Small' || 'Medium' || 'Large'} widgetFamily
   */
  async setWidgetDynamicBackground(widget, widgetFamily) {
    if (this.settings['backgroundPhoto' + widgetFamily]) {
      widget.backgroundImage = await FileManager.local().readImage(this.settings['backgroundPhoto' + widgetFamily])
    } else {
      const bgColor = new LinearGradient()
      const lightBgColors = this.settings['lightBgColors'] ? this.settings['lightBgColors'].split(',') : this.lightDefaultBackgroundColorGradient
      const darkBgColors = this.settings['darkBgColors'] ? this.settings['darkBgColors'].split(',') : this.darkDefaultBackgroundColorGradient
      const colorArr = []
      lightBgColors.forEach((color, index) => {
        const dynamicColor = Color.dynamic(new Color(lightBgColors[index], 1), new Color(darkBgColors[index], 1))
        colorArr.push(dynamicColor)
      })
      bgColor.colors = colorArr
      bgColor.locations = this.settings['bgColorsLocations'] ? this.settings['bgColorsLocations'].split(',').map(i => parseFloat(i)) : [0.0, 1.0]
      widget.backgroundGradient = bgColor
    }
  }

  /**
   * 下载额外的主题文件
   * @returns {Promise<void>}
   */
  async actionDownloadThemes() {
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()

    const request = new Request('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/themes/themes.json')
    const response = await request.loadJSON()
    const themes = response['themes']

    const alert = new Alert()
    alert.title = '下载主题'
    alert.message = '点击下载你喜欢的主题，并且在桌面引入主题风格即可'

    themes.forEach(item => {
      alert.addAction(item.name)
    })

    alert.addCancelAction('退出菜单')
    const id = await alert.presentSheet()
    if (id === -1) return

    await this.notify('正在下载主题中...')
    const REMOTE_REQ = new Request(themes[id]?.download)
    const REMOTE_RES = await REMOTE_REQ.load()
    FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), themes[id]?.fileName), REMOTE_RES)

    await this.notify(`${themes[id]?.name} 主题下载完毕，快去使用吧！`)
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
      text: `${this.settings['trackingLogEnabled'] ? '开启' : '关闭'}追踪日志`
    }, {
      name: 'viewTrackingLog',
      text: '查阅追踪日志'
    }, {
      name: 'clearTrackingLog',
      text: '清除追踪日志'
    }, {
      name: 'viewErrorLog',
      text: '查阅报错日志'
    }, {
      name: 'clearErrorLog',
      text: '清除报错日志'
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
    console.log('数据更新日志：')
    console.log(this.settings['debug_bootstrap_date_time'])

    const alert = new Alert()
    alert.title = '查阅跟踪日志'
    alert.message = this.settings['debug_bootstrap_date_time'] || '暂无日志'
    alert.addAction('关闭')
    await alert.presentAlert()
    return await this.actionDebug()
  }

  /**
   * 清除日志
   * @returns {Promise<void>}
   */
  async clearTrackingLog() {
    this.settings['debug_bootstrap_date_time'] = undefined
    await this.saveSettings(false)
    return await this.actionDebug()
  }

  /**
   * 查阅错误日志
   * @return {Promise<void>}
   */
  async viewErrorLog() {
    console.log('错误日志：')
    console.log(this.settings['error_bootstrap_date_time'] || '暂无日志')

    const alert = new Alert()
    alert.title = '查阅错误日志'
    alert.message = this.settings['error_bootstrap_date_time'] || '暂无日志'
    alert.addAction('关闭')
    await alert.presentAlert()
    return await this.actionDebug()
  }

  /**
   * 清除错误日志
   * @return {Promise<void>}
   */
  async clearErrorLog() {
    this.settings['error_bootstrap_date_time'] = undefined
    await this.saveSettings(false)
    return await this.actionDebug()
  }

  /**
   * 写入错误日志
   * @param data
   * @param error
   * @return {Promise<void>}
   */
  async writeErrorLog(data, error) {
    const type = Object.prototype.toString.call(data)
    let log = data
    if (type === '[object Object]' || type === '[object Array]') {
      log = JSON.stringify(log)
    }
    this.settings['error_bootstrap_date_time'] = this.formatDate(new Date(), '\nyyyy年MM月dd日 HH:mm:ss 错误日志：\n') + ' - ' + error + log
    await this.saveSettings(false)
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
      },
      {
        name: 'setMyCarModelName',
        text: '自定义车辆功率',
        icon: '🛻'
      },
      {
        name: 'setMyCarPhoto',
        text: '自定义车辆照片',
        icon: '🚙'
      },
      {
        name: 'setAMapKey',
        text: '设置车辆位置',
        icon: '🎯'
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
   * 界面微调
   * @returns {Promise<void>}
   */
  async actionUIRenderSettings() {
    const alert = new Alert()
    alert.title = '组件个性化配置'
    alert.message = '根据您的喜好设置，更好展示组件数据'

    const menuList = [
      {
        name: 'setMyCarLogo',
        text: '自定义 LOGO 图片',
        icon: '🎱'
      },
      {
        name: 'setMyCarLogoSize',
        text: '设置 LOGO 大小',
        icon: '🔫'
      },
      {
        name: 'setBackgroundConfig',
        text: '自定义组件背景',
        icon: '🎨'
      },
      {
        name: 'setMyOne',
        text: '自定义一言一句',
        icon: '📝'
      },
      {
        name: 'setFontFamily',
        text: '设置字体风格',
        icon: '🌈'
      },
      {
        name: 'setLockSuccessStyle',
        text: '锁车提示风格',
        icon: '🔌'
      },
      {
        name: 'setLargeLocationBorderRadius',
        text: '大组件边界弧度',
        icon: '🍺'
      },
      {
        name: 'showPlate',
        text: '设置车牌显示',
        icon: '🚘'
      },
      {
        name: 'showOil',
        text: '设置机油显示',
        icon: '⛽️'
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
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `myCarPhoto_${this.SETTING_KEY}`)
      await FileManager.local().writeImage(imagePath, image)
      this.settings['myCarPhoto'] = imagePath
      await this.saveSettings()
      return await this.actionPreferenceSettings()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 自定义 LOGO
   * @returns {Promise<void>}
   */
  async setMyCarLogo() {
    const alert = new Alert()
    alert.title = 'LOGO 图片'
    alert.message = '请在相册选择 LOGO 图片以便展示到小组件上，最好是全透明背景PNG图。'
    alert.addAction('选择照片')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionUIRenderSettings()
    // 选择图片
    try {
      const image = await Photos.fromLibrary()
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `myCarLogo_${this.SETTING_KEY}`)
      await FileManager.local().writeImage(imagePath, image)
      this.settings['myCarLogo'] = imagePath
      await this.saveSettings()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
    // 设置图片颜色
    const message = '请选择是否需要图片颜色填充？\n' +
      '原彩色：保持图片颜色\n' +
      '字体色：和字体颜色统一'
    const sizes = ['原彩色', '字体色']
    const size = await this.generateAlert(message, sizes)
    if (size === 1) {
      this.settings['logoTintType'] = 'fontColor'
      await this.saveSettings()
      return await this.actionUIRenderSettings()
    }
    this.settings['logoTintType'] = 'default'
    await this.saveSettings()
    return await this.actionUIRenderSettings()
  }

  /**
   * 设置LOGO图片大小
   * @returns {Promise<void>}
   */
  async setMyCarLogoSize() {
    const alert = new Alert()
    alert.title = '设置 LOGO 大小'
    alert.message = `不填为默认，默认图片宽度为 ${this.logoWidth} 高度为 ${this.logoHeight}`

    alert.addTextField('logo 宽度', this.settings['logoWidth'])
    alert.addTextField('logo 高度', this.settings['logoHeight'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionUIRenderSettings()
    const logoWidth = alert.textFieldValue(0) || this.logoWidth
    const logoHeight = alert.textFieldValue(1) || this.logoHeight

    this.settings['logoWidth'] = logoWidth
    this.settings['logoHeight'] = logoHeight
    await this.saveSettings()
    return await this.actionUIRenderSettings()
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
      name: 'actionUIRenderSettings',
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
      '请根据自己的偏好进行设置，请确保您的手机「设置 - 显示与亮度」外观「自动」选项已打开\n' +
      '颜色列表只写一个为纯色背景，多个则是渐变背景，格式如下：' +
      '「#fff」或者「#333,#666,#999」\n' +
      '位置列表规格如下：「0.0, 1.0」请填写 0.0 到 1.0 范围内，根据值选项渲染渐变效果不同\n' +
      '使用英文逗号分隔，颜色值可以不限制填写，全部为空则不启用该功能'

    alert.addTextField('浅色背景颜色列表', this.settings['lightBgColors'])
    alert.addTextField('浅色字体颜色', this.settings['lightTextColor'])
    alert.addTextField('深色背景颜色列表', this.settings['darkBgColors'])
    alert.addTextField('深色字体颜色', this.settings['darkTextColor'])
    alert.addTextField('渐变位置列表值', this.settings['bgColorsLocations'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.setBackgroundConfig()
    const lightBgColors = alert.textFieldValue(0)
    const lightTextColor = alert.textFieldValue(1)
    const darkBgColors = alert.textFieldValue(2)
    const darkTextColor = alert.textFieldValue(3)
    const bgColorsLocations = alert.textFieldValue(4)

    if (lightBgColors.split(',').length !== darkBgColors.split(',').length) return this.setColorBackground()

    this.settings['lightBgColors'] = lightBgColors
    this.settings['lightTextColor'] = lightTextColor
    this.settings['darkBgColors'] = darkBgColors
    this.settings['darkTextColor'] = darkTextColor
    this.settings['bgColorsLocations'] = bgColorsLocations
    await this.saveSettings()
    return await this.setBackgroundConfig()
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
      text: '还原背景',
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

      // Crop image and finalize the widget.
      const imgCrop = this.cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))

      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `backgroundPhoto${widgetSize}_${this.SETTING_KEY}`)
      await FileManager.local().writeImage(imagePath, imgCrop)
      this.settings['backgroundPhoto' + widgetSize] = imagePath
      this.settings['backgroundPhotoMode'] = true
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

      const image = await Photos.fromLibrary()
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `backgroundPhoto${widgetSize}_${this.SETTING_KEY}`)
      await FileManager.local().writeImage(imagePath, image)
      this.settings['backgroundPhoto' + widgetSize] = imagePath
      this.settings['backgroundPhotoMode'] = true
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
    alert.message = '仅在设置图片背景情境下进行对字体颜色更改。字体颜色规格：#ffffff'
    alert.addTextField('请输入字体颜色值', this.settings['backgroundImageTextColor'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.setImageBackground()
    this.settings['backgroundImageTextColor'] = alert.textFieldValue(0)
    await this.saveSettings()

    return await this.setImageBackground()
  }

  /**
   * 移除背景图片
   * @return {Promise<void>}
   */
  async removeImageBackground() {
    this.settings['backgroundPhotoSmall'] = undefined
    this.settings['backgroundPhotoMedium'] = undefined
    this.settings['backgroundPhotoLarge'] = undefined
    this.settings['backgroundPhotoMode'] = false
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
    alert.message = `请输入一言，将会在桌面展示语句，不填则显示 「${this.defaultMyOne}」`
    alert.addTextField('请输入一言', this.settings['myOne'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionUIRenderSettings()
    this.settings['myOne'] = alert.textFieldValue(0)
    await this.saveSettings()

    return await this.actionUIRenderSettings()
  }

  /**
   * 设置车辆位置
   * @returns {Promise<void>}
   */
  async setAMapKey() {
    const alert = new Alert()
    alert.title = '设置车辆位置'
    alert.message = '请输入组件所需要的高德地图密钥，用于车辆逆地理编码以及地图资源\n如不填写则关闭地址显示'
    alert.addTextField('高德地图密钥', this.settings['aMapKey'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['aMapKey'] = alert.textFieldValue(0)
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
      return await this.actionUIRenderSettings()
    }
    // 开启车牌显示
    this.settings['showPlate'] = true
    await this.saveSettings()
    return await this.actionUIRenderSettings()
  }

  /**
   * 机油显示
   * @returns {Promise<void>}
   */
  async showOil() {
    const alert = new Alert()
    alert.title = '是否显示机油数据'
    alert.message = (this.settings['showOil'] ? '当前机油显示状态已开启' : '当前机油显示状态已关闭') + '，机油数据仅供参考，长时间停车会造成机油数据不准确，请悉知！'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    if (id === -1) {
      // 关闭车牌显示
      this.settings['showOil'] = false
      await this.saveSettings()
      return await this.actionUIRenderSettings()
    }
    // 开启车牌显示
    this.settings['showOil'] = true
    await this.saveSettings()
    return await this.actionUIRenderSettings()
  }

  /**
   * 设置字体风格
   * @returns {Promise<void>}
   */
  async setFontFamily() {
    const alert = new Alert()
    alert.title = '设置字体风格'
    alert.message = '目前默认是「PingFang SC」并且只有标准体和粗体，请到 http://iosfonts.com 选择您喜欢的字体风格吧'
    alert.addTextField('标准字体', this.settings['regularFont'])
    alert.addTextField('粗体', this.settings['boldFont'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionUIRenderSettings()
    const regularFont = alert.textFieldValue(0)
    const boldFont = alert.textFieldValue(1)

    this.settings['regularFont'] = regularFont
    this.settings['boldFont'] = boldFont
    await this.saveSettings()

    return await this.actionUIRenderSettings()
  }

  /**
   * 设置锁车风格
   * @returns {Promise<void>}
   */
  async setLockSuccessStyle() {
    const message = '用于设置锁车提示风格，可以设置绿色或者字体色俩种风格'
    const sizes = ['绿色', '字体色']
    const size = await this.generateAlert(message, sizes)
    if (size === 1) {
      this.settings['lockSuccessStyle'] = 'fontColor'
      await this.saveSettings()
      return await this.actionUIRenderSettings()
    }
    this.settings['lockSuccessStyle'] = 'successColor'
    await this.saveSettings()
    return await this.actionUIRenderSettings()
  }

  /**
   * 设置大组件位置边界弧度
   * @returns {Promise<void>}
   */
  async setLargeLocationBorderRadius() {
    const alert = new Alert()
    alert.title = '设置弧度'
    alert.message = `大组件下方长方形弧度设置，默认是 ${this.locationBorderRadius}，请输入数字类型。`
    alert.addTextField('弧度大小', this.settings['locationBorderRadius'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionUIRenderSettings()
    this.settings['locationBorderRadius'] = alert.textFieldValue(0)
    await this.saveSettings()

    return await this.actionUIRenderSettings()
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
    if (Keychain.contains(this.SETTING_KEY)) Keychain.remove(this.SETTING_KEY)
    await this.notify('登出成功', '敏感信息已全部删除')
  }

  /**
   * 检查更新
   */
  async checkUpdate(fileName, jsonName) {
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    const request = new Request(`https://gitee.com/JaxsonWang/scriptable-audi/raw/master/${jsonName}.json`)
    const response = await request.loadJSON()
    console.log(`远程版本：${response?.version}`)
    if (response?.version === this.version) return this.notify('无需更新', '远程版本一致，暂无更新')
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
    FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), fileName), REMOTE_RES)

    await this.notify('Joiner 桌面组件更新完毕！')
  }

  /**
   * 传送给 Siri 快捷指令车辆信息数据
   * @returns {Object}
   */
  async siriShortcutData() {
    return await this.getData()
  }

  /**
   * 获取车辆地理位置信息
   * @param {boolean} debug 开启日志输出
   * @return {Promise<{simpleAddress, completeAddress}|{simpleAddress: *, completeAddress: *}>}
   */
  async getCarAddressInfo(debug = false) {
    const longitude = this.settings['longitude']
    const latitude = this.settings['latitude']

    // 经纬度异常判断
    if (
      longitude === undefined ||
      latitude === undefined ||
      longitude === 0 ||
      latitude === 0
    ) {
      return {
        simpleAddress: '暂无位置信息',
        completeAddress: '暂无位置信息'
      }
    } else if (
      longitude === -1 ||
      latitude === -1
    ) {
      return {
        simpleAddress: '当前车辆可能正在行驶中...',
        completeAddress: '当前车辆可能正在行驶中...'
      }
    }

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
        this.settings['simpleAddress'] = '暂无位置信息'
        this.settings['completeAddress'] = '暂无位置信息'
        return {
          simpleAddress: this.settings['simpleAddress'],
          completeAddress: this.settings['completeAddress']
        }
      }
    } catch (error) {
      await this.notify('请求失败', '提示：' + error)
      console.error(error)
      this.settings['simpleAddress'] = '暂无位置信息'
      this.settings['completeAddress'] = '暂无位置信息'
      return {
        simpleAddress: this.settings['simpleAddress'],
        completeAddress: this.settings['completeAddress']
      }
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
    try {
      const widget = new ListWidget()
      await this.setWidgetDynamicBackground(widget, 'Small')
      widget.setPadding(10, 10, 10, 10)

      const doorStatus = data.doorStatus
      const windowStatus = data.windowStatus
      const doorAndWindowNormal = doorStatus.concat(windowStatus).length !== 0
      const isLocked = data.isLocked

      const containerStack = this.addStackTo(widget, 'vertical')
      // 续航/燃料信息
      const carInfoStack = this.addStackTo(containerStack, 'horizontal')
      carInfoStack.addSpacer()
      carInfoStack.centerAlignContent()
      const carInfoTextStack = this.addStackTo(carInfoStack, 'horizontal')
      carInfoTextStack.bottomAlignContent()
      const enduranceText = carInfoTextStack.addText(`${data.fuelRange}km`)
      this.setFontFamilyStyle(enduranceText, 14, 'bold')
      this.setWidgetNodeColor(enduranceText, 'textColor')
      if (
        data.fuelLevel && data.fuelLevel <= 20 ||
        data.socLevel && data.socLevel <= 20
      ) {
        enduranceText.textColor = this.dangerColor()
      }
      if (data.fuelLevel) {
        carInfoTextStack.spacing = 4
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal')
        fuelStack.setPadding(0, 0, 2, 0)
        const fuelText = fuelStack.addText(`${data.fuelLevel}%`)
        this.setFontFamilyStyle(fuelText, 12, 'regular')
        this.setWidgetNodeColor(fuelText, 'textColor')
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor()
        }
      }
      if (data.socLevel) {
        carInfoTextStack.spacing = 4
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal')
        fuelStack.setPadding(0, 0, data.fuelLevel ? 3 : 2, 0)
        const fuelText = fuelStack.addText(data.socLevel + '%')
        this.setFontFamilyStyle(fuelText, data.fuelLevel ? 10 : 12, 'regular')
        this.setWidgetNodeColor(fuelText, 'textColor')
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor()
        }
      }
      carInfoStack.addSpacer()
      containerStack.spacing = 5
      const carPhotoStack = this.addStackTo(containerStack, 'horizontal')
      carPhotoStack.addSpacer()
      const carPhoto = await this.getMyCarPhoto(this.myCarPhotoUrl)
      const inContainerImage = carPhotoStack.addImage(carPhoto)
      carPhotoStack.addSpacer()
      inContainerImage.centerAlignImage()
      const updateTimeStack = this.addStackTo(containerStack, 'horizontal')
      updateTimeStack.bottomAlignContent()
      updateTimeStack.addSpacer()
      const updateTimeText = updateTimeStack.addText(`${this.formatDate(data.updateTimeStamp, 'MM-dd HH:mm')}`)
      this.setFontFamilyStyle(updateTimeText, 12, 'regular')
      this.setWidgetNodeColor(updateTimeText, 'textColor')
      updateTimeStack.addSpacer()
      const statusMainStack = this.addStackTo(containerStack, 'horizontal')
      statusMainStack.addSpacer()
      const statusStack = this.addStackTo(statusMainStack, 'horizontal')
      statusStack.centerAlignContent()
      statusStack.setPadding(5, 10, 5, 10)
      statusStack.cornerRadius = 10
      statusStack.borderWidth = 2
      if (this.getLockSuccessStyle()) statusStack.backgroundColor = this.successColor(0.25)
      else this.setWidgetNodeColor(statusStack, 'backgroundColor', 0.25)
      if (doorAndWindowNormal) statusStack.backgroundColor = this.warningColor(0.25)
      if (!isLocked) statusStack.backgroundColor = this.dangerColor(0.25)
      if (this.getLockSuccessStyle()) statusStack.borderColor = this.successColor(0.5)
      else this.setWidgetNodeColor(statusStack, 'borderColor', 0.5)
      if (doorAndWindowNormal) statusStack.borderColor = this.warningColor(0.5)
      if (!isLocked) statusStack.borderColor = this.dangerColor(0.5)

      let icon = await this.getSFSymbolImage('lock.fill')
      if (doorAndWindowNormal) icon = await this.getSFSymbolImage('exclamationmark.shield.fill')
      if (!isLocked) icon = await this.getSFSymbolImage('lock.open.fill')
      const statusImage = statusStack.addImage(icon)
      statusImage.imageSize = new Size(12, 12)
      if (this.getLockSuccessStyle()) statusImage.tintColor = this.successColor()
      else this.setWidgetNodeColor(statusImage, 'tintColor')
      if (doorAndWindowNormal) statusImage.tintColor = this.warningColor()
      if (!isLocked) statusImage.tintColor = this.dangerColor()
      statusStack.spacing = 4

      const infoStack = this.addStackTo(statusStack, 'vertical')
      let status = '车辆已锁定'
      if (doorAndWindowNormal) status = '门窗未锁定'
      if (!isLocked) status = '未锁车'
      const statusText = infoStack.addText(status)
      this.setFontFamilyStyle(statusText, 12, 'regular')
      if (this.getLockSuccessStyle()) statusText.textColor = this.successColor()
      else this.setWidgetNodeColor(statusText, 'textColor')
      if (doorAndWindowNormal) statusText.textColor = this.warningColor()
      if (!isLocked) statusText.textColor = this.dangerColor()
      statusMainStack.addSpacer()

      return widget
    } catch (error) {
      await this.writeErrorLog(data, error)
      throw error
    }
  }

  /**
   * 渲染中尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderMedium(data) {
    try {
      const widget = new ListWidget()
      await this.setWidgetDynamicBackground(widget, 'Medium')
      widget.setPadding(15, 15, 10, 15)
      // region logoStack
      const rowHeader = this.addStackTo(widget, 'horizontal')
      rowHeader.setPadding(0, 0, 0, 0)
      rowHeader.topAlignContent()
      // 车辆名称
      const nameStack = this.addStackTo(rowHeader, 'vertical')
      const carText = nameStack.addText(data.seriesName)
      this.setFontFamilyStyle(carText, 18, 'bold')
      this.setWidgetNodeColor(carText, 'textColor')
      // 2.0 140KW B9 40TFSI S-line
      const powerText = nameStack.addText(data.carModelName)
      this.setFontFamilyStyle(powerText, 10, 'regular')
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
        this.setFontFamilyStyle(plateNoText, 12, 'regular')
        this.setWidgetNodeColor(plateNoText, 'textColor')
        baseInfoStack.spacing = 5
      }
      const logoStack = this.addStackTo(baseInfoStack, 'vertical')
      logoStack.centerAlignContent()
      const carLogo = await this.getMyCarLogo(this.myCarLogoUrl)
      const carLogoImage = logoStack.addImage(carLogo)
      carLogoImage.imageSize = new Size(this.getLogoSize('width'), this.getLogoSize('height'))
      if (this.getLogoHasTint()) this.setWidgetNodeColor(carLogoImage, 'tintColor')
      headerRightStack.spacing = 4
      const statusStack = this.addStackTo(headerRightStack, 'horizontal')
      statusStack.centerAlignContent()
      statusStack.addSpacer()
      const carLockStack = this.addStackTo(statusStack, 'horizontal')
      carLockStack.centerAlignContent()
      // 门窗状态
      const doorStatus = data.doorStatus
      const windowStatus = data.windowStatus
      const doorAndWindowNormal = doorStatus.concat(windowStatus).length !== 0
      // const doorAndWindowNormal = true
      if (doorAndWindowNormal) {
        const carDoorImage = carLockStack.addImage(await this.getSFSymbolImage('xmark.shield.fill'))
        carDoorImage.imageSize = new Size(14, 14)
        carDoorImage.tintColor = this.warningColor()
      }
      carLockStack.spacing = 5
      // 锁车状态
      const carLockImage = carLockStack.addImage(await this.getSFSymbolImage('lock.shield.fill'))
      carLockImage.imageSize = new Size(14, 14)
      carLockImage.tintColor = data.isLocked ? this.successColor() : this.dangerColor()
      // endregion
      // region mainStack
      const mainStack = this.addStackTo(widget, 'horizontal')
      mainStack.setPadding(0, 0, 0, 0)
      mainStack.centerAlignContent()
      // region 状态信息展示
      const rowLeftStack = this.addStackTo(mainStack, 'vertical')
      // 续航/燃料信息
      const carInfoStack = this.addStackTo(rowLeftStack, 'horizontal')
      carInfoStack.centerAlignContent()
      const carInfoImageStack = this.addStackTo(carInfoStack, 'vertical')
      carInfoImageStack.bottomAlignContent()
      const carInfoImage = carInfoImageStack.addImage(await this.getSFSymbolImage('gauge'))
      carInfoImage.imageSize = new Size(14, 14)
      this.setWidgetNodeColor(carInfoImage, 'tintColor')
      carInfoStack.addSpacer(5)
      const carInfoTextStack = this.addStackTo(carInfoStack, 'horizontal')
      carInfoTextStack.bottomAlignContent()
      const enduranceText = carInfoTextStack.addText(`${data.fuelRange}km`)
      this.setFontFamilyStyle(enduranceText, 14, 'bold')
      this.setWidgetNodeColor(enduranceText, 'textColor')
      if (
        data.fuelLevel && data.fuelLevel <= 20 ||
        data.socLevel && data.socLevel <= 20
      ) {
        enduranceText.textColor = this.dangerColor()
        carInfoImage.tintColor = this.dangerColor()
      }
      if (data.fuelLevel) {
        carInfoTextStack.spacing = 4
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal')
        fuelStack.setPadding(0, 0, 2, 0)
        const fuelText = fuelStack.addText(`${data.fuelLevel}%`)
        this.setFontFamilyStyle(fuelText, 12, 'regular')
        this.setWidgetNodeColor(fuelText, 'textColor')
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor()
        }
      }
      if (data.socLevel) {
        carInfoTextStack.spacing = 4
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal')
        fuelStack.setPadding(0, 0, data.fuelLevel ? 3 : 2, 0)
        const fuelText = fuelStack.addText(data.socLevel + '%')
        this.setFontFamilyStyle(fuelText, data.fuelLevel ? 8 : 12, 'regular')
        this.setWidgetNodeColor(fuelText, 'textColor')
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor()
        }
      }

      rowLeftStack.spacing = 5
      // 总里程
      const mileageStack = this.addStackTo(rowLeftStack, 'horizontal')
      mileageStack.bottomAlignContent()
      const mileageImageStack = this.addStackTo(mileageStack, 'vertical')
      mileageImageStack.bottomAlignContent()
      const mileageImage = mileageImageStack.addImage(await this.getSFSymbolImage('car'))
      mileageImage.imageSize = new Size(14, 14)
      this.setWidgetNodeColor(mileageImage, 'tintColor')
      mileageStack.addSpacer(5)
      const mileageTextStack = this.addStackTo(mileageStack, 'horizontal')
      mileageTextStack.bottomAlignContent()
      const mileageText = mileageTextStack.addText(data.mileage + 'km')
      this.setFontFamilyStyle(mileageText, 12, 'regular')
      this.setWidgetNodeColor(mileageText, 'textColor')

      rowLeftStack.spacing = 5
      // 更新日期
      const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal')
      dateTimeStack.bottomAlignContent()
      const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical')
      dateTimeImageStack.bottomAlignContent()
      const dateTimeImage = dateTimeImageStack.addImage(await this.getSFSymbolImage('arrow.clockwise.icloud'))
      dateTimeImage.imageSize = new Size(15, 15)
      this.setWidgetNodeColor(dateTimeImage, 'tintColor')
      dateTimeStack.addSpacer(5)
      const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal')
      dateTimeTextStack.bottomAlignContent()
      const dateTimeText = dateTimeTextStack.addText(this.formatDate(data.updateTimeStamp, 'MM-dd HH:mm'))
      this.setFontFamilyStyle(dateTimeText, 12, 'regular')
      this.setWidgetNodeColor(dateTimeText, 'textColor')
      // endregion
      mainStack.addSpacer()
      // region 右侧车辆图片
      const rowRightStack = this.addStackTo(mainStack, 'vertical')
      const carPhoto = await this.getMyCarPhoto(this.myCarPhotoUrl)
      const carPhotoStack = rowRightStack.addImage(carPhoto)
      carPhotoStack.centerAlignImage()
      // endregion
      // endregion
      const footTextData = data.showLocation ? data.completeAddress : data.myOne
      const footerStack = this.addStackTo(widget, 'horizontal')
      footerStack.setPadding(5, 0, 0, 0)
      footerStack.centerAlignContent()
      footerStack.addSpacer()
      const footerText = footerStack.addText(footTextData)
      this.setFontFamilyStyle(footerText, 10, 'regular')
      this.setWidgetNodeColor(footerText, 'textColor')
      footerText.centerAlignText()
      footerStack.addSpacer()

      return widget
    } catch (error) {
      await this.writeErrorLog(data, error)
      throw error
    }
  }

  /**
   * 渲染大尺寸组件
   * @param data
   * @returns {Promise<ListWidget>}
   */
  async renderLarge(data) {
    try {
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
      this.setFontFamilyStyle(carText, 22, 'bold')
      this.setWidgetNodeColor(carText, 'textColor')
      // 功率显示
      const powerStack = this.addStackTo(headerLeftStack, 'vertical')
      const powerText = powerStack.addText(data.carModelName)
      this.setFontFamilyStyle(powerText, 14, 'regular')
      this.setWidgetNodeColor(powerText, 'textColor')
      // 俩侧分割
      rowHeader.addSpacer()
      // 顶部右侧
      const headerRightStackWidth = data.carPlateNo.length * 12
      const headerRightStackHeight = this.logoHeight * 1.5 + 25
      const headerRightStack = this.addStackTo(rowHeader, 'vertical')
      headerRightStack.size = new Size(headerRightStackWidth, headerRightStackHeight)
      // Logo
      const carLogoStack = this.addStackTo(headerRightStack, 'horizontal')
      carLogoStack.addText('')
      carLogoStack.addSpacer()
      const carLogo = await this.getMyCarLogo(this.myCarLogoUrl)
      const carLogoImage = carLogoStack.addImage(carLogo)
      carLogoImage.imageSize = new Size(this.getLogoSize('width') * 1.5, this.getLogoSize('height') * 1.5)
      if (this.getLogoHasTint()) this.setWidgetNodeColor(carLogoImage, 'tintColor')
      headerRightStack.spacing = 5
      // 车牌信息
      if (data.showPlate) {
        const plateNoStack = this.addStackTo(headerRightStack, 'horizontal')
        plateNoStack.addText('')
        plateNoStack.addSpacer()
        const plateNoText = plateNoStack.addText(data.carPlateNo)
        this.setFontFamilyStyle(plateNoText, 12, 'regular')
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
      this.setFontFamilyStyle(enduranceText, 14, 'bold')
      this.setWidgetNodeColor(enduranceText, 'textColor')
      if (
        data.fuelLevel && data.fuelLevel <= 20 ||
        data.socLevel && data.socLevel <= 20
      ) {
        enduranceImage.tintColor = this.dangerColor()
        enduranceText.textColor = this.dangerColor()
      }
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
      if (
        data.fuelLevel && data.fuelLevel <= 20 ||
        data.socLevel && data.socLevel <= 20
      ) {
        fuelImage.tintColor = this.dangerColor()
      }
      fuelStack.addSpacer(5)
      // 汽油
      const fuelTextStack1 = this.addStackTo(fuelStack, 'horizontal')
      fuelTextStack1.bottomAlignContent()
      if (data.fuelLevel) {
        const fuelText1 = fuelTextStack1.addText(data.fuelLevel + '%')
        this.setFontFamilyStyle(fuelText1, 14, 'regular')
        this.setWidgetNodeColor(fuelText1, 'textColor')
        fuelStack.addSpacer(5)
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText1.textColor = this.dangerColor()
        }
      }
      // 电池
      if (data.socLevel) {
        const fuelTextStack2 = this.addStackTo(fuelStack, 'horizontal')
        fuelTextStack2.bottomAlignContent()
        const fuelText2 = fuelTextStack2.addText(data.socLevel + '%')
        this.setFontFamilyStyle(fuelText2, data.fuelLevel ? 12 : 14, 'regular')
        this.setWidgetNodeColor(fuelText2, 'textColor')
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText2.textColor = this.dangerColor()
        }
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
      this.setFontFamilyStyle(mileageText, 14, 'regular')
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
          oilImage.tintColor = this.dangerColor()
        } else {
          this.setWidgetNodeColor(oilImage, 'tintColor')
        }
        oilStack.addSpacer(5)
        const oilTextStack = this.addStackTo(oilStack, 'horizontal')
        oilTextStack.bottomAlignContent()
        const oilText = oilTextStack.addText(data.oilLevel + '%')
        this.setFontFamilyStyle(oilText, 14, 'regular')
        if (Number(data.oilLevel) <= 12.5) {
          oilText.textColor = this.dangerColor()
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
      if (this.getLockSuccessStyle()) lockedImage.tintColor = this.successColor()
      else this.setWidgetNodeColor(lockedImage, 'tintColor')
      if (!data.isLocked) lockedImage.tintColor = this.dangerColor()
      lockedStack.addSpacer(5)
      const lockedTextStack = this.addStackTo(lockedStack, 'horizontal')
      lockedTextStack.bottomAlignContent()
      const lockedText = lockedTextStack.addText(data.isLocked ? '已锁车' : '未锁车')
      this.setFontFamilyStyle(lockedText, 14, 'regular')
      if (this.getLockSuccessStyle()) lockedText.textColor = this.successColor()
      else this.setWidgetNodeColor(lockedText, 'textColor')
      if (!data.isLocked) lockedText.textColor = this.dangerColor()
      // endregion
      rowLeftStack.addSpacer(5)
      // region 数据更新日期
      const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal')
      dateTimeStack.bottomAlignContent()
      const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical')
      dateTimeImageStack.bottomAlignContent()
      const dateTimeImage = dateTimeImageStack.addImage(await this.getSFSymbolImage('arrow.clockwise.icloud'))
      dateTimeImage.imageSize = new Size(18, 18)
      this.setWidgetNodeColor(dateTimeImage, 'tintColor')
      dateTimeStack.addSpacer(5)
      const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal')
      dateTimeTextStack.bottomAlignContent()
      const dateTimeText = dateTimeTextStack.addText(this.formatDate(data.updateTimeStamp, 'MM-dd HH:mm'))
      this.setFontFamilyStyle(dateTimeText, 14, 'regular')
      this.setWidgetNodeColor(dateTimeText, 'textColor')
      // endregion
      rowLeftStack.addSpacer(5)
      // region 刷新日期
      const updateStack = this.addStackTo(rowLeftStack, 'horizontal')
      updateStack.bottomAlignContent()
      const updateImageStack = this.addStackTo(updateStack, 'vertical')
      updateImageStack.bottomAlignContent()
      const updateImage = updateImageStack.addImage(await this.getSFSymbolImage('clock.arrow.2.circlepath'))
      updateImage.imageSize = new Size(18, 18)
      this.setWidgetNodeColor(updateImage, 'tintColor')
      updateStack.addSpacer(5)
      const updateTextStack = this.addStackTo(updateStack, 'horizontal')
      updateTextStack.bottomAlignContent()
      const updateText = updateTextStack.addText(this.formatDate(data.updateNowDate, 'MM-dd HH:mm'))
      this.setFontFamilyStyle(updateText, 14, 'regular')
      this.setWidgetNodeColor(updateText, 'textColor')
      // endregion
      // endregion
      mainStack.addSpacer()
      // region 右侧车辆图片
      const rowRightStack = this.addStackTo(mainStack, 'vertical')
      rowRightStack.addSpacer()
      const carPhotoStack = this.addStackTo(rowRightStack, 'horizontal')
      carPhotoStack.addSpacer()
      carPhotoStack.centerAlignContent()
      const carPhoto = await this.getMyCarPhoto(this.myCarPhotoUrl)
      const carPhotoImage = carPhotoStack.addImage(carPhoto)
      carPhotoImage.centerAlignImage()
      const statusStack = this.addStackTo(rowRightStack, 'vertical')
      statusStack.setPadding(5, 0, 0, 0)
      statusStack.centerAlignContent()

      const doorStatus = data.doorStatus || []
      const windowStatus = data.windowStatus || []
      const carStatus = doorStatus.concat(windowStatus)
      // const carStatus = ['左前门', '后备箱', '右前窗', '右后窗', '天窗']
      if (carStatus.length !== 0) {
        const statusArray = format2Array(carStatus, 3)
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
            statusItemImage.tintColor = this.warningColor()
            statusItemStack.addSpacer(2)
            const statusItemText = statusItemStack.addText(item)
            this.setFontFamilyStyle(statusItemText, 12)
            statusItemText.textColor = this.warningColor()
            statusItemText.centerAlignText()
            statusItemStack.addSpacer()
          })
        })
      } else {
        statusStack.addSpacer(5)
        const statusInfoStack = this.addStackTo(statusStack, 'horizontal')
        statusInfoStack.addSpacer()
        const statusItemStack = this.addStackTo(statusInfoStack, 'horizontal')
        // statusItemStack.setPadding(5, 0, 5, 0)
        statusItemStack.setPadding(5, 10, 5, 10)
        statusItemStack.cornerRadius = 10
        statusItemStack.borderWidth = 2
        if (this.getLockSuccessStyle()) statusItemStack.borderColor = this.successColor(0.5)
        else this.setWidgetNodeColor(statusItemStack, 'borderColor', 0.5)
        if (this.getLockSuccessStyle()) statusItemStack.backgroundColor = this.successColor(0.25)
        else this.setWidgetNodeColor(statusItemStack, 'backgroundColor', 0.25)

        statusItemStack.centerAlignContent()
        const statusItemImage = statusItemStack.addImage(await this.getSFSymbolImage('checkmark.shield.fill'))
        statusItemImage.imageSize = new Size(12, 12)
        if (this.getLockSuccessStyle()) statusItemImage.tintColor = this.successColor()
        else this.setWidgetNodeColor(statusItemImage, 'tintColor')
        statusItemStack.addSpacer(2)
        const statusItemText = statusItemStack.addText('当前车窗已全关闭')
        this.setFontFamilyStyle(statusItemText, 12)
        if (this.getLockSuccessStyle()) statusItemText.textColor = this.successColor()
        else this.setWidgetNodeColor(statusItemText, 'textColor')
        statusItemText.centerAlignText()
        statusInfoStack.addSpacer()
      }
      rowRightStack.addSpacer()
      // endregion
      // 地图/一言展示
      const leftImage = data.largeLocationPicture
      const rightText = data.showLocation ? data.completeAddress : data.myOne
      const footerWrapperStack = this.addStackTo(widget, 'horizontal')
      footerWrapperStack.setPadding(0, 0, 0, 0)
      const footerStack = this.addStackTo(footerWrapperStack, 'horizontal')
      footerStack.cornerRadius = this.getLocationBorderRadius()
      this.setWidgetNodeColor(footerStack, 'borderColor', 0.25)
      footerStack.borderWidth = 2
      footerStack.setPadding(0, 0, 0, 0)
      footerStack.centerAlignContent()
      // 地图图片
      if (data.showLocation) {
        const footerLeftStack = this.addStackTo(footerStack, 'vertical')
        const locationImage = await this.getImageByUrl(leftImage, !data.showLocation)
        const locationImageStack = footerLeftStack.addImage(locationImage)
        locationImageStack.imageSize = new Size(100, 60)
        locationImageStack.centerAlignImage()
        footerStack.addSpacer()
      }
      // 地理位置
      const footerRightStack = this.addStackTo(footerStack, 'horizontal')
      if (!data.showLocation) footerStack.setPadding(25, 20, 25, 20)
      footerRightStack.addSpacer()
      const locationText = footerRightStack.addText(rightText)
      this.setFontFamilyStyle(locationText, 12)
      locationText.centerAlignText()
      this.setWidgetNodeColor(locationText, 'textColor')
      footerRightStack.addSpacer()
      footerStack.addSpacer()
      // 有地理数据时候展示一言
      if (data.showLocation) {
        const oneStack = this.addStackTo(widget, 'horizontal')
        oneStack.setPadding(10, 0, 0, 0)
        oneStack.addSpacer()
        oneStack.centerAlignContent()
        const oneText = oneStack.addText(data.myOne)
        this.setFontFamilyStyle(oneText, 12)
        this.setWidgetNodeColor(oneText, 'textColor')
        oneText.centerAlignText()
        oneStack.addSpacer()
      }

      return widget
    } catch (error) {
      await this.writeErrorLog(data, error)
      throw error
    }
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget()

    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/default.png'))

    const text = widget.addText('欢迎使用 Joiner 系列汽车组件')
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
}

export default UIRender
