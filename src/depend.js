// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code-branch;
//

class Base {
  localFile = FileManager.local()

  constructor(arg = '') {
    this.arg = arg
    this._actions = {}
    this.init()
  }

  /**
   * 初始化配置
   * @param {string} widgetFamily
   */
  init(widgetFamily = config.widgetFamily) {
    // 组件大小：small,medium,large
    this.widgetFamily = widgetFamily
    // 系统设置的key，这里分为三个类型：
    // 1. 全局
    // 2. 不同尺寸的小组件
    // 3. 不同尺寸+小组件自定义的参数
    // 当没有key2时，获取key1，没有key1获取全局key的设置
    // this.SETTING_KEY = this.md5(Script.name()+'@'+this.widgetFamily+'@'+this.arg)
    // this.SETTING_KEY1 = this.md5(Script.name()+'@'+this.widgetFamily)
    this.SETTING_KEY = this.md5(Script.name())
    // 插件设置
    this.settings = this.getSettings()
  }

  /**
   * 注册点击操作菜单
   * @param {string} name 操作函数名
   * @param {Function} func 点击后执行的函数
   */
  registerAction(name, func) {
    this._actions[name] = func.bind(this)
  }

  /**
   * 生成操作回调URL，点击后执行本脚本，并触发相应操作
   * @param {string} name 操作的名称
   * @param {string} data 传递的数据
   */
  actionUrl(name = '', data = '') {
    let u = URLScheme.forRunningScript()
    let q = `act=${encodeURIComponent(name)}&data=${encodeURIComponent(data)}&__arg=${encodeURIComponent(this.arg)}&__size=${this.widgetFamily}`
    let result = ''
    if (u.includes('run?')) {
      result = `${u}&${q}`
    } else {
      result = `${u}?${q}`
    }
    return result
  }

  /**
   * HTTP 请求接口
   * @param {Object} options request 选项配置
   * @returns {Promise<JSON | String>}
   */
  async http(options) {
    const url = options?.url || url
    const method = options?.method || 'GET'
    const headers = options?.headers || {}
    const body = options?.body || ''
    const json = options?.json || true

    let response = new Request(url)
    response.method = method
    response.headers = headers
    if (method === 'POST' || method === 'post') response.body = body
    return (json ? response.loadJSON() : response.loadString())
  }

  /**
   * 获取远程图片内容
   * @param {string} url 图片地址
   * @param {boolean} useCache 是否使用缓存（请求失败时获取本地缓存）
   */
  async getImageByUrl(url, useCache = true) {
    const cacheKey = this.md5(url)
    const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey)
    // 判断是否有缓存
    if (useCache && FileManager.local().fileExists(cacheFile)) {
      return Image.fromFile(cacheFile)
    }
    try {
      const req = new Request(url)
      const img = await req.loadImage()
      // 存储到缓存
      FileManager.local().writeImage(cacheFile, img)
      return img
    } catch (e) {
      // 没有缓存+失败情况下，返回自定义的绘制图片（红色背景）
      let ctx = new DrawContext()
      ctx.size = new Size(100, 100)
      ctx.setFillColor(Color.red())
      ctx.fillRect(new Rect(0, 0, 100, 100))
      return ctx.getImage()
    }
  }

  /**
   * 弹出一个通知
   * @param {string} title 通知标题
   * @param {string} body 通知内容
   * @param {string} url 点击后打开的URL
   * @param {Object} opts
   * @returns {Promise<void>}
   */
  async notify(title, body = '', url = undefined, opts = {}) {
    let n = new Notification()
    n = Object.assign(n, opts)
    n.title = title
    n.body = body
    if (url) n.openURL = url
    return await n.schedule()
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
   * 存储当前设置
   * @param {boolean} notify 是否通知提示
   */
  async saveSettings(notify = true) {
    const result = (typeof this.settings === 'object') ? JSON.stringify(this.settings) : String(this.settings)
    Keychain.set(this.SETTING_KEY, result)
    if (notify) await this.notify('设置成功', '桌面组件稍后将自动刷新')
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
   * 判断系统外观模式
   * @return {Promise<boolean>}
   */
  async isUsingDarkAppearance() {
    return !(Color.dynamic(Color.white(), Color.black()).red)
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
   * 获取当前插件的设置
   * @param {boolean} json 是否为json格式
   */
  getSettings(json = true) {
    let result = json ? {} : ''
    let cache = ''
    if (Keychain.contains(this.SETTING_KEY)) {
      cache = Keychain.get(this.SETTING_KEY)
    }
    if (json) {
      try {
        result = JSON.parse(cache)
      } catch (error) {
        // throw new Error('JSON 数据解析失败' + error)
      }
    } else {
      result = cache
    }

    return result
  }

  /**
   * md5 加密
   * @param string
   * @returns {string}
   */
  md5(string) {
    const safeAdd = (x, y) => {
      let lsw = (x & 0xFFFF) + (y & 0xFFFF)
      return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF)
    }
    const bitRotateLeft = (num, cnt) => (num << cnt) | (num >>> (32 - cnt))
    const md5cmn = (q, a, b, x, s, t) => safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b),
      md5ff = (a, b, c, d, x, s, t) => md5cmn((b & c) | ((~b) & d), a, b, x, s, t),
      md5gg = (a, b, c, d, x, s, t) => md5cmn((b & d) | (c & (~d)), a, b, x, s, t),
      md5hh = (a, b, c, d, x, s, t) => md5cmn(b ^ c ^ d, a, b, x, s, t),
      md5ii = (a, b, c, d, x, s, t) => md5cmn(c ^ (b | (~d)), a, b, x, s, t)
    const firstChunk = (chunks, x, i) => {
        let [a, b, c, d] = chunks
        a = md5ff(a, b, c, d, x[i + 0], 7, -680876936)
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)

        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)

        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)

        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

        return [a, b, c, d]
      },
      secondChunk = (chunks, x, i) => {
        let [a, b, c, d] = chunks
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
        b = md5gg(b, c, d, a, x[i], 20, -373897302)

        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)

        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)

        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

        return [a, b, c, d]
      },
      thirdChunk = (chunks, x, i) => {
        let [a, b, c, d] = chunks
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)

        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)

        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
        d = md5hh(d, a, b, c, x[i], 11, -358537222)
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)

        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

        return [a, b, c, d]
      },
      fourthChunk = (chunks, x, i) => {
        let [a, b, c, d] = chunks
        a = md5ii(a, b, c, d, x[i], 6, -198630844)
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)

        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)

        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)

        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)
        return [a, b, c, d]
      }
    const binlMD5 = (x, len) => {
      /* append padding */
      x[len >> 5] |= 0x80 << (len % 32)
      x[(((len + 64) >>> 9) << 4) + 14] = len
      let commands = [firstChunk, secondChunk, thirdChunk, fourthChunk],
        initialChunks = [
          1732584193,
          -271733879,
          -1732584194,
          271733878
        ]
      return Array.from({length: Math.floor(x.length / 16) + 1}, (v, i) => i * 16)
        .reduce((chunks, i) => commands
          .reduce((newChunks, apply) => apply(newChunks, x, i), chunks.slice())
          .map((chunk, index) => safeAdd(chunk, chunks[index])), initialChunks)

    }
    const binl2rstr = input => Array(input.length * 4).fill(8).reduce((output, k, i) => output + String.fromCharCode((input[(i * k) >> 5] >>> ((i * k) % 32)) & 0xFF), '')
    const rstr2binl = input => Array.from(input).map(i => i.charCodeAt(0)).reduce((output, cc, i) => {
      let resp = output.slice()
      resp[(i * 8) >> 5] |= (cc & 0xFF) << ((i * 8) % 32)
      return resp
    }, [])
    const rstrMD5 = string => binl2rstr(binlMD5(rstr2binl(string), string.length * 8))
    const rstr2hex = input => {
      const hexTab = (pos) => '0123456789abcdef'.charAt(pos)
      return Array.from(input).map(c => c.charCodeAt(0)).reduce((output, x) => output + hexTab((x >>> 4) & 0x0F) + hexTab(x & 0x0F), '')
    }
    const str2rstrUTF8 = unicodeString => {
      if (typeof unicodeString !== 'string') throw new TypeError('parameter ‘unicodeString’ is not a string')
      const cc = c => c.charCodeAt(0)
      return unicodeString
        .replace(/[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
          c => String.fromCharCode(0xc0 | cc(c) >> 6, 0x80 | cc(c) & 0x3f))
        .replace(/[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
          c => String.fromCharCode(0xe0 | cc(c) >> 12, 0x80 | cc(c) >> 6 & 0x3F, 0x80 | cc(c) & 0x3f))
    }
    const rawMD5 = s => rstrMD5(str2rstrUTF8(s))
    const hexMD5 = s => rstr2hex(rawMD5(s))
    return hexMD5(string)
  }

  /**
   * 新增 Stack 布局
   * @param {WidgetStack | ListWidget} stack 节点信息
   * @param {'horizontal' | 'vertical'} layout 布局类型
   * @returns {WidgetStack}
   */
  addStackTo(stack, layout) {
    const newStack = stack.addStack()
    layout === 'horizontal' ? newStack.layoutHorizontally() : newStack.layoutVertically()
    return newStack
  }

  /**
   * 根据百分比输出 hex 颜色
   * @param {number} pct
   * @returns {Color}
   */
  getColorForPercentage(pct) {
    const percentColors = [
      { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
      { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
    ]

    let i = 1
    for (i; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break
      }
    }
    const lower = percentColors[i - 1]
    const upper = percentColors[i]
    const range = upper.pct - lower.pct
    const rangePct = (pct - lower.pct) / range
    const pctLower = 1 - rangePct
    const pctUpper = rangePct
    const color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    }
    // return 'rgb(' + [color.r, color.g, color.b].join(',') + ')'
    return new Color('#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1), 1)
  }

  /**
   * 一维数组转换二维数组
   * @param arr
   * @param num
   * @returns {*[]}
   */
  format2Array(arr, num) {
    const  pages = []
    arr.forEach((item, index) => {
      const page = Math.floor(index / num)
      if (!pages[page]) {
        pages[page] = []
      }
      pages[page].push(item)
    })
    return pages
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
}

// @base.end
// 运行环境
// @running.start
const Running = async (Widget, default_args = '') => {
  let M = null
  // 判断hash是否和当前设备匹配
  if (config.runsInWidget) {
    M = new Widget(args.widgetParameter || '')
    const W = await M.render()
    Script.setWidget(W)
    Script.complete()
  } else if (config.runsWithSiri) {
    M = new Widget(args.shortcutParameter || '')
    const data = await M.siriShortcutData()
    Script.setShortcutOutput(data)
  } else {
    let { act, data, __arg, __size } = args.queryParameters
    M = new Widget(__arg || default_args || '')
    if (__size) M.init(__size)
    if (!act || !M['_actions']) {
      // 弹出选择菜单
      const actions = M['_actions']
      const _actions = []
      const alert = new Alert()
      alert.title = M.name
      alert.message = M.desc
      for (let _ in actions) {
        alert.addAction(_)
        _actions.push(actions[_])
      }
      alert.addCancelAction('取消操作')
      const idx = await alert.presentSheet()
      if (_actions[idx]) {
        const func = _actions[idx]
        await func()
      }
      return
    }
    let _tmp = act.split('-').map(_ => _[0].toUpperCase() + _.substr(1)).join('')
    let _act = `action${_tmp}`
    if (M[_act] && typeof M[_act] === 'function') {
      const func = M[_act].bind(M)
      await func(data)
    }
  }
}
// @running.end

// 测试环境
const Testing = async (Widget, default_args = '') => {
  let M = null
  // 判断hash是否和当前设备匹配
  if (config.runsInWidget) {
    M = new Widget(args.widgetParameter || '')
    const W = await M.render()
    Script.setWidget(W)
    Script.complete()
  } else if (config.runsWithSiri) {
    M = new Widget(args.shortcutParameter || '')
    const data = await M.siriShortcutData()
    Script.setShortcutOutput(data)
  } else {
    let { act, data, __arg, __size } = args.queryParameters
    M = new Widget(__arg || default_args || '')
    if (__size) M.init(__size)
    if (!act || !M['_actions']) {
      // 弹出选择菜单
      const actions = M['_actions']
      const _actions = [
        // 远程开发
        async () => {
          // 1. 获取服务器ip
          const a = new Alert()
          a.title = '服务器 IP'
          a.message = '请输入远程开发服务器（电脑）IP地址'
          let xjj_debug_server = '192.168.1.3'
          if (Keychain.contains('xjj_debug_server')) {
            xjj_debug_server = Keychain.get('xjj_debug_server')
          }
          a.addTextField('server-ip', xjj_debug_server)
          a.addAction('连接')
          a.addCancelAction('取消')
          const id = await a.presentAlert()
          if (id === -1) return
          const ip = a.textFieldValue(0)
          // 保存到本地
          Keychain.set('xjj_debug_server', ip)
          const server_api = `http://${ip}:5566`
          // 2. 发送当前文件到远程服务器
          const SELF_FILE = module.filename.replace('depend', Script.name())
          const req = new Request(`${server_api}/sync`)
          req.method = 'POST'
          req.addFileToMultipart(SELF_FILE, 'Widget', Script.name())
          try {
            const res = await req.loadString()
            if (res !== 'ok') {
              return M.notify('连接失败', res)
            }
          } catch (e) {
            return M.notify('连接错误', e.message)
          }
          M.notify('连接成功', '编辑文件后保存即可进行下一步预览操作')
          // 重写console.log方法，把数据传递到nodejs
          const rconsole_log = async (data, t = 'log') => {
            const _req = new Request(`${server_api}/console`)
            _req.method = 'POST'
            _req.headers = {
              'Content-Type': 'application/json'
            }
            _req.body = JSON.stringify({
              t,
              data
            })
            return await _req.loadString()
          }
          const lconsole_log = console.log.bind(console)
          const lconsole_warn = console.warn.bind(console)
          const lconsole_error = console.error.bind(console)
          console.log = d => {
            lconsole_log(d)
            rconsole_log(d, 'log')
          }
          console.warn = d => {
            lconsole_warn(d)
            rconsole_log(d, 'warn')
          }
          console.error = d => {
            lconsole_error(d)
            rconsole_log(d, 'error')
          }
          // 3. 同步
          // eslint-disable-next-line no-constant-condition
          while (1) {
            let _res = ''
            try {
              const _req = new Request(`${server_api}/sync?name=${encodeURIComponent(Script.name())}`)
              _res = await _req.loadString()
            } catch (e) {
              M.notify('停止调试', '与开发服务器的连接已终止')
              break
            }
            if (_res === 'stop') {
              console.log('[!] 停止同步')
              break
            } else if (_res === 'no') {
              // console.log('[-] 没有更新内容')
            } else if (_res.length > 0) {
              M.notify('同步成功', '新文件已同步，大小：' + _res.length)
              // 重新加载组件
              // 1. 读取当前源码
              const _code = _res.split('// @组件代码开始')[1].split('// @组件代码结束')[0]
              // 2. 解析 widget class
              let NewWidget = null
              try {
                const _func = new Function(`const _Debugger = Base => {\n${_code}\nreturn Widget\n}\nreturn _Debugger`)
                NewWidget = _func()(Base)
              } catch (e) {
                M.notify('解析失败', e.message)
              }
              if (!NewWidget) continue
              // 3. 重新执行 widget class
              // delete M
              M = new NewWidget(__arg || default_args || '')
              if (__size) M.init(__size)
              // 写入文件
              FileManager.local().writeString(SELF_FILE, _res)
              // 执行预览
              let i = await _actions[1](true)
              if (i === (4 + Object.keys(actions).length)) break
            }
          }
        },
        // 预览组件
        async (debug = false) => {
          let a = new Alert()
          a.title = '预览组件'
          a.message = '测试桌面组件在各种尺寸下的显示效果'
          a.addAction('小尺寸 Small')
          a.addAction('中尺寸 Medium')
          a.addAction('大尺寸 Large')
          a.addAction('全部 All')
          a.addCancelAction('取消操作')
          const funcs = []
          if (debug) {
            for (let _ in actions) {
              a.addAction(_)
              funcs.push(actions[_].bind(M))
            }
            a.addDestructiveAction('停止调试')
          }
          let i = await a.presentSheet()
          if (i === -1) return
          let w
          switch (i) {
            case 0:
              M.widgetFamily = 'small'
              w = await M.render()
              await w.presentSmall()
              break
            case 1:
              M.widgetFamily = 'medium'
              w = await M.render()
              await w.presentMedium()
              break
            case 2:
              M.widgetFamily = 'large'
              w = await M.render()
              await w.presentLarge()
              break
            case 3:
              M.widgetFamily = 'small'
              w = await M.render()
              await w.presentSmall()
              M.widgetFamily = 'medium'
              w = await M.render()
              await w.presentMedium()
              M.widgetFamily = 'large'
              w = await M.render()
              await w.presentLarge()
              break
            default:
              if (funcs[i - 4]) await funcs[i - 4]()
              break
          }

          return i
        },
        // 复制源码
        async () => {
          const SELF_FILE = module.filename.replace('depend', Script.name())
          const source = FileManager.local().readString(SELF_FILE)
          Pasteboard.copyString(source)
          await M.notify('复制成功', '当前脚本的源代码已复制到剪贴板！')
        }
      ]
      const alert = new Alert()
      alert.title = M.name
      alert.message = M.desc
      alert.addAction('远程开发')
      alert.addAction('预览组件')
      alert.addAction('复制源码')
      for (let _ in actions) {
        alert.addAction(_)
        _actions.push(actions[_])
      }
      alert.addCancelAction('取消操作')
      const idx = await alert.presentSheet()
      if (_actions[idx]) {
        const func = _actions[idx]
        await func()
      }
      return
    }
    let _tmp = act.split('-').map(_ => _[0].toUpperCase() + _.substr(1)).join('')
    let _act = `action${_tmp}`
    if (M[_act] && typeof M[_act] === 'function') {
      const func = M[_act].bind(M)
      await func(data)
    }
  }
}

module.exports = {
  Base,
  Testing,
  Running,
}
