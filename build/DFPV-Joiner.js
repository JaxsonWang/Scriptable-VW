// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: car;
// Variables used by Scriptable.
//
// author: 淮城一只猫<i@iiong.com>

/**
 * md5 加密
 * @param string
 * @returns {string}
 */
const md5 = string => {
  const safeAdd = (x, y) => {
    let lsw = (x & 0xFFFF) + (y & 0xFFFF);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF)
  };
  const bitRotateLeft = (num, cnt) => (num << cnt) | (num >>> (32 - cnt));
  const md5cmn = (q, a, b, x, s, t) => safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b),
    md5ff = (a, b, c, d, x, s, t) => md5cmn((b & c) | ((~b) & d), a, b, x, s, t),
    md5gg = (a, b, c, d, x, s, t) => md5cmn((b & d) | (c & (~d)), a, b, x, s, t),
    md5hh = (a, b, c, d, x, s, t) => md5cmn(b ^ c ^ d, a, b, x, s, t),
    md5ii = (a, b, c, d, x, s, t) => md5cmn(c ^ (b | (~d)), a, b, x, s, t);
  const firstChunk = (chunks, x, i) => {
      let [a, b, c, d] = chunks;
      a = md5ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);

      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);

      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);

      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      return [a, b, c, d]
    },
    secondChunk = (chunks, x, i) => {
      let [a, b, c, d] = chunks;
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);

      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);

      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);

      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      return [a, b, c, d]
    },
    thirdChunk = (chunks, x, i) => {
      let [a, b, c, d] = chunks;
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);

      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);

      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);

      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      return [a, b, c, d]
    },
    fourthChunk = (chunks, x, i) => {
      let [a, b, c, d] = chunks;
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);

      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);

      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);

      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      return [a, b, c, d]
    };
  const binlMD5 = (x, len) => {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let commands = [firstChunk, secondChunk, thirdChunk, fourthChunk],
      initialChunks = [
        1732584193,
        -271733879,
        -1732584194,
        271733878
      ];
    return Array.from({length: Math.floor(x.length / 16) + 1}, (v, i) => i * 16)
      .reduce((chunks, i) => commands
        .reduce((newChunks, apply) => apply(newChunks, x, i), chunks.slice())
        .map((chunk, index) => safeAdd(chunk, chunks[index])), initialChunks)

  };
  const binl2rstr = input => Array(input.length * 4).fill(8).reduce((output, k, i) => output + String.fromCharCode((input[(i * k) >> 5] >>> ((i * k) % 32)) & 0xFF), '');
  const rstr2binl = input => Array.from(input).map(i => i.charCodeAt(0)).reduce((output, cc, i) => {
    let resp = output.slice();
    resp[(i * 8) >> 5] |= (cc & 0xFF) << ((i * 8) % 32);
    return resp
  }, []);
  const rstrMD5 = string => binl2rstr(binlMD5(rstr2binl(string), string.length * 8));
  const rstr2hex = input => {
    const hexTab = (pos) => '0123456789abcdef'.charAt(pos);
    return Array.from(input).map(c => c.charCodeAt(0)).reduce((output, x) => output + hexTab((x >>> 4) & 0x0F) + hexTab(x & 0x0F), '')
  };
  const str2rstrUTF8 = unicodeString => {
    if (typeof unicodeString !== 'string') throw new TypeError('parameter ‘unicodeString’ is not a string')
    const cc = c => c.charCodeAt(0);
    return unicodeString
      .replace(/[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        c => String.fromCharCode(0xc0 | cc(c) >> 6, 0x80 | cc(c) & 0x3f))
      .replace(/[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        c => String.fromCharCode(0xe0 | cc(c) >> 12, 0x80 | cc(c) >> 6 & 0x3F, 0x80 | cc(c) & 0x3f))
  };
  const rawMD5 = s => rstrMD5(str2rstrUTF8(s));
  const hexMD5 = s => rstr2hex(rawMD5(s));
  return hexMD5(string)
};

class Core {
  constructor(arg = '') {
    this.arg = arg;
    this.staticUrl = 'https://gitlab.com/JaxsonWang/Scriptable-VW/-/raw/master';
    this._actions = {};
    this.init();
  }

  /**
   * 初始化配置
   * @param {string} widgetFamily
   */
  init(widgetFamily = config.widgetFamily) {
    // 组件大小：small,medium,large
    this.widgetFamily = widgetFamily;
    // 系统设置的key，这里分为三个类型：
    // 1. 全局
    // 2. 不同尺寸的小组件
    // 3. 不同尺寸+小组件自定义的参数
    // 当没有key2时，获取key1，没有key1获取全局key的设置
    // this.SETTING_KEY = md5(Script.name()+'@'+this.widgetFamily+'@'+this.arg)
    // this.SETTING_KEY1 = md5(Script.name()+'@'+this.widgetFamily)
    this.SETTING_KEY = md5(Script.name());
    // 插件设置
    this.settings = this.getSettings();
  }

  /**
   * 注册点击操作菜单
   * @param {string} name 操作函数名
   * @param {Function} func 点击后执行的函数
   */
  registerAction(name, func) {
    this._actions[name] = func.bind(this);
  }

  /**
   * 设置字体
   * @param {WidgetText} widget
   * @param size
   * @param { 'regular' || 'bold' } type
   */
  setFontFamilyStyle(widget, size, type = 'regular') {
    const regularFont = this.settings['regularFont'] || 'PingFangSC-Regular';
    const boldFont = this.settings['boldFont'] || 'PingFangSC-Semibold';

    widget.font = new Font(type === 'regular' ? regularFont : boldFont, size);
  }

  /**
   * 获取当前插件的设置
   * @param {boolean} json 是否为json格式
   * @param key
   */
  getSettings(json = true, key = this.SETTING_KEY) {
    let result = json ? {} : '';
    let cache = '';
    if (Keychain.contains(key)) {
      cache = Keychain.get(key);
    }
    if (json) {
      try {
        result = JSON.parse(cache);
      } catch (error) {
        // throw new Error('JSON 数据解析失败' + error)
      }
    } else {
      result = cache;
    }

    return result
  }

  /**
   * 新增 Stack 布局
   * @param {WidgetStack | ListWidget} stack 节点信息
   * @param {'horizontal' | 'vertical'} layout 布局类型
   * @returns {WidgetStack}
   */
  addStackTo(stack, layout) {
    const newStack = stack.addStack();
    layout === 'horizontal' ? newStack.layoutHorizontally() : newStack.layoutVertically();
    return newStack
  }

  /**
   * 时间格式化
   * @param date
   * @param format
   * @return {string}
   */
  formatDate(date = new Date(), format = 'MM-dd HH:mm') {
    const formatter = new DateFormatter();
    formatter.dateFormat = format;
    const updateDate = new Date(date);
    return formatter.string(updateDate)
  }

  /**
   * 生成操作回调URL，点击后执行本脚本，并触发相应操作
   * @param {string} name 操作的名称
   * @param {string} data 传递的数据
   */
  actionUrl(name = '', data = '') {
    let u = URLScheme.forRunningScript();
    let q = `act=${encodeURIComponent(name)}&data=${encodeURIComponent(data)}&__arg=${encodeURIComponent(this.arg)}&__size=${this.widgetFamily}`;
    let result = '';
    if (u.includes('run?')) {
      result = `${u}&${q}`;
    } else {
      result = `${u}?${q}`;
    }
    return result
  }

  /**
   * 获取资源服务器地址
   * @returns {string}
   */
  getStaticUrl() {
    return this.settings['staticUrl'] || this.staticUrl
  }

  /**
   * 数据类型判断
   * @param data
   * @returns {boolean}
   */
  isExist(data) {
    return data !== undefined && data !== null && data !== ''
  }

  /**
   * HTTP 请求接口
   * @param {Object} options request 选项配置
   * @returns {Promise<JSON | String>}
   */
  async http(options) {
    const url = options?.url || url;
    const method = options?.method || 'GET';
    const headers = options?.headers || {};
    const body = options?.body || '';
    const json = options?.json || true;

    let response = new Request(url);
    response.method = method;
    response.headers = headers;
    if (method === 'POST' || method === 'post') response.body = body;
    return (json ? response.loadJSON() : response.loadString())
  }

  /**
   * 获取远程图片内容
   * @param {string} url 图片地址
   * @param {boolean} useCache 是否使用缓存（请求失败时获取本地缓存）
   */
  async getImageByUrl(url, useCache = true) {
    const cacheKey = md5(url);
    const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey);
    // 判断是否有缓存
    if (useCache && FileManager.local().fileExists(cacheFile)) {
      return Image.fromFile(cacheFile)
    }
    try {
      const req = new Request(url);
      const img = await req.loadImage();
      // 存储到缓存
      FileManager.local().writeImage(cacheFile, img);
      return img
    } catch (e) {
      // 没有缓存+失败情况下，返回自定义的绘制图片（红色背景）
      let ctx = new DrawContext();
      ctx.size = new Size(100, 100);
      ctx.setFillColor(Color.red());
      ctx.fillRect(new Rect(0, 0, 100, 100));
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
    try {
      let n = new Notification();
      n = Object.assign(n, opts);
      n.title = title;
      n.body = body;
      if (url) n.openURL = url;
      return await n.schedule()
    } catch (error) {
      console.warn(error);
    }
  }

  /**
   * 存储当前设置
   * @param {boolean} notify 是否通知提示
   */
  async saveSettings(notify = true) {
    const result = (typeof this.settings === 'object') ? JSON.stringify(this.settings) : String(this.settings);
    Keychain.set(this.SETTING_KEY, result);
    if (notify) await this.notify('设置成功', '桌面组件稍后将自动刷新');
  }

  /**
   * 获取用户车辆照片
   * @returns {Promise<Image|*>}
   */
  async getMyCarPhoto(photo) {
    let myCarPhoto = await this.getImageByUrl(photo);
    if (this.settings['myCarPhoto']) myCarPhoto = await FileManager.local().readImage(this.settings['myCarPhoto']);
    return myCarPhoto
  }

  /**
   * 获取LOGO照片
   * @returns {Promise<Image|*>}
   */
  async getMyCarLogo(logo) {
    let myCarLogo = await this.getImageByUrl(logo);
    if (this.settings['myCarLogo']) myCarLogo = await FileManager.local().readImage(this.settings['myCarLogo']);
    return myCarLogo
  }

  /**
   * 关于组件
   */
  async actionAbout() {
    const alert = new Alert();
    alert.title = '关于组件';

    const menuList = [
      {
        type: 'function',
        name: 'actionCheckUpdate',
        text: '检查更新'
      },
      {
        type: 'url',
        url: 'https://joiner.i95.me/about.html',
        text: 'Joiner 小组件官网'
      },
      {
        type: 'url',
        url: 'https://www.yuque.com/docs/share/ee1d0306-e22d-479f-a2e3-7d347aaf06b1',
        text: '申请高德地图 Web 服务密钥'
      },
      {
        text: '版权说明',
        title: '版权说明',
        message: '\n' +
          'Joiner 小组件是开源免费的，由大众系粉丝车主兴趣开发，所有责任与一汽奥迪、一汽大众、上汽大众等大众集团车企无关。\n' +
          'Joiner 小组件不会收集您的个人账户信息，所有账号信息将存在 iCloud 或者 iPhone 上但也请您妥善保管自己的账号。\n' +
          'Joiner 小组件会不定期推出新功能，如果车企官方推出了小组件，Joiner 将会停止更新与支持。\n' +
          '如果市面上第三方开发组件和本组件没有任何关系，请认证开发者《淮城一只猫》所开发的 Joiner 小组件。\n' +
          'Joiner 小组件是开源的，可以随时审查代码：https://github.com/JaxsonWang/Scriptable-VW \n',
        type: 'text'
      },
    ];

    menuList.forEach(item => {
      alert.addAction(item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    switch (menuList[id].type) {
      case 'url':
        Safari.open(menuList[id].url);
        break
      case 'text':
        const alert = new Alert();
        alert.title = menuList[id].title;
        alert.message = menuList[id].message;
        await alert.presentSheet();
        break
      case 'function':
        await this[menuList[id].name]();
        break
    }
  }

  /**
   * 关于作者
   * @return {Promise<void>}
   */
  async actionAuthor() {
    Safari.open('https://qr.alipay.com/fkx16611d9qgth0qzixse66');
  }

  /**
   * 预览组件
   * @param {Widget} Widget
   * @return {Promise<void>}
   */
  async actionPreview(Widget) {
    const alert = new Alert();
    alert.title = '预览组件';
    alert.message = '用于调试和测试组件样式';

    const menuList = [{
      name: 'Small',
      text: '小尺寸'
    }, {
      name: 'Medium',
      text: '中尺寸'
    }, {
      name: 'Large',
      text: '大尺寸'
    }];

    menuList.forEach(item => {
      alert.addAction(item.text);
    });

    alert.addCancelAction('退出菜单');
    const id = await alert.presentSheet();
    if (id === -1) return
    // 执行函数
    const widget = new Widget(args.widgetParameter || '');
    widget.widgetFamily = (menuList[id].name).toLowerCase();
    const w = await widget.render();
    await w['present' + menuList[id].name]();
  }
}

/**
 * 根据百分比输出 hex 颜色
 * @param {number} pct
 * @returns {Color}
 */

/**
 * 一维数组转换多维数组
 * @param arr
 * @param num
 * @returns {*[]}
 */
const format2Array = (arr, num) => {
  const  pages = [];
  arr.forEach((item, index) => {
    const page = Math.floor(index / num);
    if (!pages[page]) {
      pages[page] = [];
    }
    pages[page].push(item);
  });
  return pages
};

class UIRender extends Core {
  constructor(args = '') {
    super(args);

    // 默认背景色
    this.lightDefaultBackgroundColorGradient = ['#ffffff', '#dbefff'];
    this.darkDefaultBackgroundColorGradient = ['#414345', '#232526'];

    this.myCarPhotoUrl = '';
    this.myCarLogoUrl = '';
    this.logoWidth = 0;
    this.logoHeight = 0;

    this.defaultMyOne = '';
    this.locationBorderRadius = 15;
    this.locationMapZoom = 12;

    this.version = '2.4.5';
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
    const draw = new DrawContext();
    draw.size = new Size(rect.width, rect.height);

    draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y));
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
   * @param {Object} location 位置
   * @param {boolean} debug 开启日志输出
   * @return {string}
   */
  getCarAddressImage(location, debug = false) {
    const longitude = location?.longitude || this.settings['longitude'];
    const latitude = location?.latitude || this.settings['latitude'];

    const aMapKey = this.settings['aMapKey']?.trim();
    const size = this.settings['largeMapType'] ? '500*280' : '100*60';
    const aMapUrl = `https://restapi.amap.com/v3/staticmap?key=${aMapKey}&markers=mid,0xFF0000,0:${longitude},${latitude}&size=${size}&scale=1&zoom=${this.getLocationMapZoom()}&traffic=1`;
    if (debug) {
      console.log('位置图片请求地址：');
      console.log(aMapUrl);
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
   * 地图缩放比例
   * @returns {number|number}
   */
  getLocationMapZoom() {
    return parseInt(this.settings['locationMapZoom'], 10) || this.locationMapZoom
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
    const widgetFamily = this.widgetFamily === 'small' ? 'Small' : this.widgetFamily === 'medium' ? 'Medium' : 'Large';
    if (this.settings['backgroundPhoto' + widgetFamily]) {
      const textColor = this.settings['backgroundImageTextColor'] || '#ffffff';
      widget[type] = new Color(textColor, alpha);
    } else {
      const lightTextColor = this.settings['lightTextColor'] || '#000000';
      const darkTextColor = this.settings['darkTextColor'] || '#ffffff';
      widget[type] = Color.dynamic(new Color(lightTextColor, alpha), new Color(darkTextColor, alpha));
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
    let ctx = new DrawContext();
    // 获取图片的尺寸
    ctx.size = img.size;

    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']));
    ctx.setFillColor(new Color(color, opacity));
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']));

    return ctx.getImage()
  }

  /**
   * Alert 弹窗封装
   * @param title
   * @param message
   * @param options
   * @returns {Promise<number>}
   */
  async generateAlert(title = 'Joiner 提示', message, options) {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    for (const option of options) {
      alert.addAction(option);
    }
    return await alert.presentAlert()
  }

  /**
   * 组件声明
   * @returns {Promise<number>}
   */
  async actionStatementSettings(message) {
    const alert = new Alert();
    alert.title = 'Joiner 组件声明';
    alert.message = message;
    alert.addAction('同意');
    alert.addCancelAction('不同意');
    return await alert.presentAlert()
  }

  /**
   * SFSymbol 图标
   * @param sfSymbolName
   * @returns {Promise<Image>}
   */
  async getSFSymbolImage(sfSymbolName) {
    return await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/joiner_v2/${sfSymbolName}%402x.png`)
  }

  /**
   * 动态设置组件背景色
   * @param {ListWidget || WidgetStack} widget
   * @param {'Small' || 'Medium' || 'Large'} widgetFamily
   */
  async setWidgetDynamicBackground(widget, widgetFamily) {
    if (this.settings['backgroundPhoto' + widgetFamily]) {
      widget.backgroundImage = await FileManager.local().readImage(this.settings['backgroundPhoto' + widgetFamily]);
    } else {
      const bgColor = new LinearGradient();
      const lightBgColors = this.settings['lightBgColors'] ? this.settings['lightBgColors'].split(',') : this.lightDefaultBackgroundColorGradient;
      const darkBgColors = this.settings['darkBgColors'] ? this.settings['darkBgColors'].split(',') : this.darkDefaultBackgroundColorGradient;
      const colorArr = [];
      lightBgColors.forEach((color, index) => {
        const dynamicColor = Color.dynamic(new Color(lightBgColors[index], 1), new Color(darkBgColors[index], 1));
        colorArr.push(dynamicColor);
      });
      bgColor.colors = colorArr;
      bgColor.locations = this.settings['bgColorsLocations'] ? this.settings['bgColorsLocations'].split(',').map(i => parseFloat(i)) : [0.0, 1.0];
      widget.backgroundGradient = bgColor;
    }
  }

  /**
   * 下载额外的主题文件
   * @returns {Promise<void>}
   */
  async actionDownloadThemes() {
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();

    const request = new Request(`${this.getStaticUrl()}/build/themes.json`);
    const response = await request.loadJSON();
    const themes = response['themes'];

    const alert = new Alert();
    alert.title = '下载主题';
    alert.message = '点击下载你喜欢的主题，并且在桌面引入主题风格即可';

    themes.forEach(item => {
      alert.addAction(item.name);
    });

    alert.addCancelAction('退出菜单');
    const id = await alert.presentSheet();
    if (id === -1) return

    await this.notify('正在下载主题中...');
    const REMOTE_REQ = new Request(themes[id]?.download);
    const REMOTE_RES = await REMOTE_REQ.load();
    FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), themes[id]?.fileName), REMOTE_RES);

    await this.notify(`${themes[id]?.name} 主题下载完毕，快去使用吧！`);
  }

  /**
   * 调试日志
   */
  async actionDebug() {
    const alert = new Alert();
    alert.title = '组件调试日志';
    alert.message = '用于调试一些奇怪的问题，配合开发者调试数据';

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
    }];

    menuList.forEach(item => {
      alert.addAction(item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    await this[menuList[id].name]();
  }

  /**
   * 开启日志追踪
   * @returns {Promise<void>}
   */
  async setTrackingLog() {
    const alert = new Alert();
    alert.title = '是否开启数据更新日志追踪';
    alert.message = this.settings['trackingLogEnabled'] ? '当前日志追踪状态已开启' : '当前日志追踪状态已关闭';
    alert.addAction('开启');
    alert.addCancelAction('关闭');

    const id = await alert.presentAlert();
    this.settings['trackingLogEnabled'] = id !== -1;
    await this.saveSettings(false);
    return await this.actionDebug()
  }

  /**
   * 查阅日志
   * @returns {Promise<void>}
   */
  async viewTrackingLog() {
    console.log('数据更新日志：');
    console.log(this.settings['debug_bootstrap_date_time']);

    const alert = new Alert();
    alert.title = '查阅跟踪日志';
    alert.message = this.settings['debug_bootstrap_date_time'] || '暂无日志';
    alert.addAction('关闭');
    await alert.presentAlert();
    return await this.actionDebug()
  }

  /**
   * 清除日志
   * @returns {Promise<void>}
   */
  async clearTrackingLog() {
    this.settings['debug_bootstrap_date_time'] = undefined;
    await this.saveSettings(false);
    return await this.actionDebug()
  }

  /**
   * 查阅错误日志
   * @return {Promise<void>}
   */
  async viewErrorLog() {
    console.log('错误日志：');
    console.log(this.settings['error_bootstrap_date_time'] || '暂无日志');

    const alert = new Alert();
    alert.title = '查阅错误日志';
    alert.message = this.settings['error_bootstrap_date_time'] || '暂无日志';
    alert.addAction('关闭');
    await alert.presentAlert();
    return await this.actionDebug()
  }

  /**
   * 清除错误日志
   * @return {Promise<void>}
   */
  async clearErrorLog() {
    this.settings['error_bootstrap_date_time'] = undefined;
    await this.saveSettings(false);
    return await this.actionDebug()
  }

  /**
   * 写入错误日志
   * @param data
   * @param error
   * @return {Promise<void>}
   */
  async writeErrorLog(data, error) {
    const type = Object.prototype.toString.call(data);
    let log = data;
    if (type === '[object Object]' || type === '[object Array]') {
      log = JSON.stringify(log);
    }
    this.settings['error_bootstrap_date_time'] = this.formatDate(new Date(), '\nyyyy年MM月dd日 HH:mm:ss 错误日志：\n') + ' - ' + error + log;
    await this.saveSettings(false);
  }

  /**
   * 偏好设置
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings() {
    const alert = new Alert();
    alert.title = '组件个性化配置';
    alert.message = '根据您的喜好设置，更好展示组件数据';

    const menuList = [
      {
        name: 'setStaticUrl',
        text: '自定义资源地址',
        icon: '🛠'
      },
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
        name: 'setMyCarLogo',
        text: '自定义 LOGO 图片',
        icon: '🥅'
      },
      {
        name: 'setMyCarLogoSize',
        text: '设置 LOGO 大小',
        icon: '🔫'
      },
      {
        name: 'setMyOne',
        text: '自定义一言一句',
        icon: '📝'
      },
      {
        name: 'setAMapKey',
        text: '设置车辆位置',
        icon: '🎯'
      },
      {
        name: 'setLocationFormat',
        text: '位置信息格式',
        icon: '💫'
      },
      {
        name: 'setShowType',
        text: '信息描述风格',
        icon: '🌭'
      }
    ];

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' + item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    await this[menuList[id].name]();
  }

  /**
   * 界面微调
   * @returns {Promise<void>}
   */
  async actionUIRenderSettings() {
    const alert = new Alert();
    alert.title = '组件个性化配置';
    alert.message = '根据您的喜好设置，更好展示组件数据';

    const menuList = [
      {
        name: 'setBackgroundConfig',
        text: '自定义组件背景',
        icon: '🎨'
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
        name: 'setLargeMapType',
        text: '大组件地图风格',
        icon: '🌏'
      },
      {
        name: 'setMapZoom',
        text: '设置地图缩放',
        icon: '🍎'
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
    ];

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' + item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    await this[menuList[id].name]();
  }

  /**
   * 自定义资源地址
   * @returns {Promise<void>}
   */
  async setStaticUrl() {
    const alert = new Alert();
    alert.title = '资源地址';
    alert.message = '如果你所用的资源服务器无法正常使用，可以自行定义资源服务器地址';
    alert.addTextField('请输入自定义资源地址', this.settings['staticUrl'] || this.staticUrl);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['staticUrl'] = alert.textFieldValue(0) || this.staticUrl;
    await this.saveSettings();

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆名称
   * @returns {Promise<void>}
   */
  async setMyCarName() {
    const alert = new Alert();
    alert.title = '车辆名称';
    alert.message = '如果您不喜欢系统返回的名称可以自己定义名称';
    alert.addTextField('请输入自定义名称', this.settings['myCarName'] || this.settings['seriesName']);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarName'] = alert.textFieldValue(0) || this.settings['seriesName'];
    await this.saveSettings();

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆功率
   * @returns {Promise<void>}
   */
  async setMyCarModelName() {
    const alert = new Alert();
    alert.title = '车辆功率';
    alert.message = '根据车辆实际情况可自定义功率类型，不填为系统默认';
    alert.addTextField('请输入自定义功率', this.settings['myCarModelName'] || this.settings['carModelName']);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarModelName'] = alert.textFieldValue(0) || this.settings['carModelName'];
    await this.saveSettings();

    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义车辆图片
   * @returns {Promise<void>}
   */
  async setMyCarPhoto() {
    const alert = new Alert();
    alert.title = '车辆图片';
    alert.message = '请在相册选择您最喜欢的车辆图片以便展示到小组件上，最好是全透明背景PNG图。';
    alert.addAction('选择照片');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    try {
      const image = await Photos.fromLibrary();
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `myCarPhoto_${this.SETTING_KEY}`);
      await FileManager.local().writeImage(imagePath, image);
      this.settings['myCarPhoto'] = imagePath;
      await this.saveSettings();
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
    const alert = new Alert();
    alert.title = 'LOGO 图片';
    alert.message = '请在相册选择 LOGO 图片以便展示到小组件上，最好是全透明背景PNG图。';
    alert.addAction('选择照片');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    // 选择图片
    try {
      const image = await Photos.fromLibrary();
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `myCarLogo_${this.SETTING_KEY}`);
      await FileManager.local().writeImage(imagePath, image);
      this.settings['myCarLogo'] = imagePath;
      await this.saveSettings();
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
    // 设置图片颜色
    const message = '请选择是否需要图片颜色填充？\n' +
      '原彩色：保持图片颜色\n' +
      '字体色：和字体颜色统一';
    const sizes = ['原彩色', '字体色'];
    const size = await this.generateAlert('提示', message, sizes);
    if (size === 1) {
      this.settings['logoTintType'] = 'fontColor';
      await this.saveSettings();
      return await this.actionPreferenceSettings()
    }
    this.settings['logoTintType'] = 'default';
    await this.saveSettings();
    return await this.actionPreferenceSettings()
  }

  /**
   * 设置LOGO图片大小
   * @returns {Promise<void>}
   */
  async setMyCarLogoSize() {
    const alert = new Alert();
    alert.title = '设置 LOGO 大小';
    alert.message = `不填为默认，默认图片宽度为 ${this.logoWidth} 高度为 ${this.logoHeight}`;

    alert.addTextField('logo 宽度', this.settings['logoWidth'] || this.logoWidth);
    alert.addTextField('logo 高度', this.settings['logoHeight'] || this.logoHeight);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    const logoWidth = alert.textFieldValue(0) || this.logoWidth;
    const logoHeight = alert.textFieldValue(1) || this.logoHeight;

    this.settings['logoWidth'] = logoWidth;
    this.settings['logoHeight'] = logoHeight;
    await this.saveSettings();
    return await this.actionPreferenceSettings()
  }

  /**
   * 自定义组件背景
   * @returns {Promise<void>}
   */
  async setBackgroundConfig() {
    const alert = new Alert();
    alert.title = '自定义组件背景';
    alert.message = '颜色背景和图片背景共同存存在时，图片背景设置优先级更高，将会加载图片背景\n' +
      '只有清除组件背景图片时候颜色背景才能生效！';

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
    }];

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' + item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    await this[menuList[id].name]();
  }

  /**
   * 设置组件颜色背景
   * @returns {Promise<void>}
   */
  async setColorBackground() {
    const alert = new Alert();
    alert.title = '自定义颜色背景';
    alert.message = '系统浅色模式适用于白天情景\n' +
      '系统深色模式适用于晚上情景\n' +
      '请根据自己的偏好进行设置，请确保您的手机「设置 - 显示与亮度」外观「自动」选项已打开\n' +
      '颜色列表只写一个为纯色背景，多个则是渐变背景，格式如下：' +
      '「#fff」或者「#333, #666, #999」\n' +
      '位置列表规格如下：「0.0, 1.0」请填写 0.0 到 1.0 范围内，根据值选项渲染渐变效果不同\n' +
      '使用英文逗号分隔，颜色值可以不限制填写，全部为空则不启用该功能';

    alert.addTextField('浅色背景颜色列表', this.settings['lightBgColors'] || '#ffffff, #dbefff');
    alert.addTextField('浅色字体颜色', this.settings['lightTextColor'] || '#000000');
    alert.addTextField('深色背景颜色列表', this.settings['darkBgColors'] || '#414345, #232526');
    alert.addTextField('深色字体颜色', this.settings['darkTextColor'] || '#ffffff');
    alert.addTextField('渐变位置列表值', this.settings['bgColorsLocations'] || '0.0, 1.0');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.setBackgroundConfig()
    const lightBgColors = alert.textFieldValue(0);
    const lightTextColor = alert.textFieldValue(1);
    const darkBgColors = alert.textFieldValue(2);
    const darkTextColor = alert.textFieldValue(3);
    const bgColorsLocations = alert.textFieldValue(4);

    if (lightBgColors.split(',').length !== darkBgColors.split(',').length) return this.setColorBackground()

    this.settings['lightBgColors'] = lightBgColors;
    this.settings['lightTextColor'] = lightTextColor;
    this.settings['darkBgColors'] = darkBgColors;
    this.settings['darkTextColor'] = darkTextColor;
    this.settings['bgColorsLocations'] = bgColorsLocations;
    await this.saveSettings();
    return await this.setBackgroundConfig()
  }

  /**
   * 设置组件图片背景
   * @returns {Promise<void>}
   */
  async setImageBackground() {
    const alert = new Alert();
    alert.title = '自定义图片背景';
    alert.message = '目前自定义图片背景可以设置下列俩种场景\n' +
      '透明背景：因为组件限制无法实现，目前使用桌面图片裁剪实现所谓对透明组件，设置之前需要先对桌面壁纸进行裁剪哦，请选择「裁剪壁纸」菜单进行获取透明背景图片\n' +
      '图片背景：选择您最喜欢的图片作为背景';

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
    }];

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' + item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    await this[menuList[id].name]();
  }

  /**
   * 透明（剪裁）壁纸
   * @returns {Promise<void>}
   */
  async setTransparentBackground() {
    let message = '开始之前，请转到主屏幕并进入桌面编辑模式，滚动到最右边的空页面，然后截图！';
    const exitOptions = ['前去截图', '继续'];
    const shouldExit = await this.generateAlert('提示', message, exitOptions);
    if (!shouldExit) return

    // Get screenshot and determine phone size.
    try {
      const img = await Photos.fromLibrary();
      const height = img.size.height;
      const phone = this.phoneSizes()[height];
      if (!phone) {
        message = '您选择的照片好像不是正确的截图，或者您的机型暂时不支持。';
        await this.generateAlert('提示', message, ['OK']);
        return await this.setImageBackground()
      }

      // Prompt for widget size and position.
      message = '您创建组件的是什么规格？';
      const sizes = ['小组件', '中组件', '大组件'];
      const _sizes = ['Small', 'Medium', 'Large'];
      const size = await this.generateAlert('提示', message, sizes);
      const widgetSize = _sizes[size];

      message = '在桌面上组件存在什么位置？';
      message += (height === 1136 ? ' （备注：当前设备只支持两行小组件，所以下边选项中的「中间」和「底部」的选项是一致的）' : '');

      // Determine image crop based on phone size.
      const crop = {w: '', h: '', x: '', y: ''};
      let positions = '';
      let _positions = '';
      let position = '';
      switch (widgetSize) {
        case 'Small':
          crop.w = phone.small;
          crop.h = phone.small;
          positions = ['Top left', 'Top right', 'Middle left', 'Middle right', 'Bottom left', 'Bottom right'];
          _positions = ['左上角', '右上角', '中间左', '中间右', '左下角', '右下角'];
          position = await this.generateAlert('提示', message, _positions);

          // Convert the two words into two keys for the phone size dictionary.
          const keys = positions[position].toLowerCase().split(' ');
          crop.y = phone[keys[0]];
          crop.x = phone[keys[1]];
          break
        case 'Medium':
          crop.w = phone.medium;
          crop.h = phone.small;

          // Medium and large widgets have a fixed x-value.
          crop.x = phone.left;
          positions = ['Top', 'Middle', 'Bottom'];
          _positions = ['顶部', '中部', '底部'];
          position = await this.generateAlert('提示', message, _positions);
          const key = positions[position].toLowerCase();
          crop.y = phone[key];
          break
        case 'Large':
          crop.w = phone.medium;
          crop.h = phone.large;
          crop.x = phone.left;
          positions = ['Top', 'Bottom'];
          _positions = ['顶部', '底部'];
          position = await this.generateAlert('提示', message, _positions);

          // Large widgets at the bottom have the 'middle' y-value.
          crop.y = position ? phone.middle : phone.top;
          break
      }

      // Crop image and finalize the widget.
      const imgCrop = this.cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h));

      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `backgroundPhoto${widgetSize}_${this.SETTING_KEY}`);
      await FileManager.local().writeImage(imagePath, imgCrop);
      this.settings['backgroundPhoto' + widgetSize] = imagePath;
      await this.saveSettings();
      await this.setImageBackground();
    } catch (error) {
      // 取消图片会异常 暂时不用管
      console.error(error);
    }
  }

  /**
   * 自选图片
   * @returns {Promise<void>}
   */
  async setPhotoBackground() {
    try {
      let message = '您创建组件的是什么规格？';
      const sizes = ['小组件', '中组件', '大组件'];
      const _sizes = ['Small', 'Medium', 'Large'];
      const size = await this.generateAlert('提示', message, sizes);
      const widgetSize = _sizes[size];

      const image = await Photos.fromLibrary();
      const imagePath = FileManager.local().joinPath(FileManager.local().documentsDirectory(), `backgroundPhoto${widgetSize}_${this.SETTING_KEY}`);
      await FileManager.local().writeImage(imagePath, image);
      this.settings['backgroundPhoto' + widgetSize] = imagePath;
      await this.saveSettings();
      await this.setImageBackground();
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 设置图片背景下的字体颜色
   * @return {Promise<void>}
   */
  async setColorBackgroundTextColor() {
    const alert = new Alert();
    alert.title = '字体颜色';
    alert.message = '仅在设置图片背景情境下进行对字体颜色更改。字体颜色规格：#ffffff';
    alert.addTextField('请输入字体颜色值', this.settings['backgroundImageTextColor'] || '#ffffff');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.setImageBackground()
    this.settings['backgroundImageTextColor'] = alert.textFieldValue(0);
    await this.saveSettings();

    return await this.setImageBackground()
  }

  /**
   * 移除背景图片
   * @return {Promise<void>}
   */
  async removeImageBackground() {
    this.settings['backgroundPhotoSmall'] = undefined;
    this.settings['backgroundPhotoMedium'] = undefined;
    this.settings['backgroundPhotoLarge'] = undefined;
    await this.saveSettings();
    await this.setImageBackground();
  }

  /**
   * 输入一言
   * @returns {Promise<void>}
   */
  async setMyOne() {
    const alert = new Alert();
    alert.title = '输入一言';
    alert.message = `请输入一言，将会在桌面展示语句，不填则显示 「${this.defaultMyOne}」`;
    alert.addTextField('请输入一言', this.settings['myOne'] || this.defaultMyOne);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myOne'] = alert.textFieldValue(0);
    await this.saveSettings();

    return await this.actionPreferenceSettings()
  }

  /**
   * 设置显示风格
   * @returns {Promise<void>}
   */
  async setShowType() {
    const message = '设置组件信息根据你的选择进行展示？';
    const menus = ['图标描述', '文字描述'];
    // 默认 显示图标描述
    this.settings['showType'] = Boolean(await this.generateAlert('组件信息描述', message, menus));
    await this.saveSettings();
    return await this.actionPreferenceSettings()
  }

  /**
   * 设置车辆位置
   * @returns {Promise<void>}
   */
  async setAMapKey() {
    const alert = new Alert();
    alert.title = '设置车辆位置';
    alert.message = '请输入组件所需要的高德地图密钥，用于车辆逆地理编码以及地图资源\n如不填写则关闭地址显示';
    alert.addTextField('高德地图密钥', this.settings['aMapKey']);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['aMapKey'] = alert.textFieldValue(0);
    await this.saveSettings();

    return await this.actionPreferenceSettings()
  }

  /**
   * 位置信息格式
   * @returns {Promise<void>}
   */
  async setLocationFormat() {
    const alert = new Alert();
    alert.title = '位置信息格式';
    alert.message = '请输入组件所需要的位置信息格式，格式如下【国|省|市|区|乡镇|街道|社区|建筑|区域】\n如不填写则默认显示标准位置信息';
    alert.addTextField('位置信息格式', this.settings['locationFormat']);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['locationFormat'] = alert.textFieldValue(0);
    await this.saveSettings();

    return await this.actionPreferenceSettings()
  }

  /**
   * 车牌显示
   * @returns {Promise<void>}
   */
  async showPlate() {
    const title = '是否显示车牌显示';
    const message = this.settings['showPlate'] ? '当前车牌显示状态已开启' : '当前车牌显示状态已关闭';
    const menus = ['关闭显示', '开启显示'];
    this.settings['showPlate'] = Boolean(await this.generateAlert(title, message, menus));
    await this.saveSettings();
    return await this.actionUIRenderSettings()
  }

  /**
   * 机油显示
   * @returns {Promise<void>}
   */
  async showOil() {
    const title = '是否显示机油数据';
    const message = (this.settings['showOil'] ? '当前机油显示状态已开启' : '当前机油显示状态已关闭') + '，机油数据仅供参考，长时间停车会造成机油数据不准确，请悉知！';
    const menus = ['关闭显示', '开启显示'];
    this.settings['showOil'] = Boolean(await this.generateAlert(title, message, menus));
    await this.saveSettings();
    return await this.actionUIRenderSettings()
  }

  /**
   * 设置字体风格
   * @returns {Promise<void>}
   */
  async setFontFamily() {
    const alert = new Alert();
    alert.title = '设置字体风格';
    alert.message = '目前默认是「PingFang SC」并且只有标准体和粗体，请到 http://iosfonts.com 选择您喜欢的字体风格吧';
    alert.addTextField('标准字体', this.settings['regularFont'] || 'PingFangSC-Regular');
    alert.addTextField('粗体', this.settings['boldFont'] || 'PingFangSC-Semibold');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionUIRenderSettings()
    const regularFont = alert.textFieldValue(0);
    const boldFont = alert.textFieldValue(1);

    this.settings['regularFont'] = regularFont;
    this.settings['boldFont'] = boldFont;
    await this.saveSettings();

    return await this.actionUIRenderSettings()
  }

  /**
   * 设置锁车风格
   * @returns {Promise<void>}
   */
  async setLockSuccessStyle() {
    const message = '用于设置锁车提示风格，可以设置绿色或者字体色俩种风格';
    const sizes = ['绿色', '字体色'];
    const size = await this.generateAlert('提示', message, sizes);
    if (size === 1) {
      this.settings['lockSuccessStyle'] = 'fontColor';
      await this.saveSettings();
      return await this.actionUIRenderSettings()
    }
    this.settings['lockSuccessStyle'] = 'successColor';
    await this.saveSettings();
    return await this.actionUIRenderSettings()
  }

  /**
   * 设置大组件位置边界弧度
   * @returns {Promise<void>}
   */
  async setLargeLocationBorderRadius() {
    const alert = new Alert();
    alert.title = '设置弧度';
    alert.message = `大组件下方长方形弧度设置，默认是 ${this.locationBorderRadius}，请输入数字类型。`;
    alert.addTextField('弧度大小', this.settings['locationBorderRadius'] || '15');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionUIRenderSettings()
    this.settings['locationBorderRadius'] = alert.textFieldValue(0);
    await this.saveSettings();

    return await this.actionUIRenderSettings()
  }

  /**
   * 设置大组件地图展示风格
   * @returns {Promise<void>}
   */
  async setLargeMapType() {
    const message = '用于大组件展示地图风格';
    const menus = ['默认', '全地图'];
    this.settings['largeMapType'] = Boolean(await this.generateAlert('提示', message, menus));
    await this.saveSettings();
    return await this.actionUIRenderSettings()
  }

  /**
   * 设置大组件地图缩放
   * @returns {Promise<void>}
   */
  async setMapZoom() {
    const alert = new Alert();
    alert.title = '设置缩放比例';
    alert.message = `大组件下方地图缩放数字越小缩放越大，范围在（1 ~ 17），默认是 ${this.locationMapZoom}，请输入数字类型。`;
    alert.addTextField('缩放大小', this.settings['locationMapZoom'] || '12');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionUIRenderSettings()
    this.settings['locationMapZoom'] = alert.textFieldValue(0);
    await this.saveSettings();

    return await this.actionUIRenderSettings()
  }

  /**
   * 刷新数据
   */
  async actionRefreshData() {
    const alert = new Alert();
    alert.title = '刷新数据';
    alert.message = '如果发现数据延迟，选择对应函数获取最新数据，同样也是获取日志分享给开发者使用。';

    const menuList = [{
      name: 'getData',
      text: '组件数据'
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
    }];

    menuList.forEach(item => {
      alert.addAction(item.text);
    });

    alert.addCancelAction('退出菜单');
    const id = await alert.presentSheet();
    if (id === -1) return
    // 执行函数
    await this[menuList[id].name](true);
  }

  /**
   * 重置登出
   */
  async actionLogOut() {
    const alert = new Alert();
    alert.title = '退出账号';
    alert.message = '您所登录的账号包括缓存本地的数据将全部删除，请慎重操作。';
    alert.addAction('登出');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return
    if (Keychain.contains(this.SETTING_KEY)) Keychain.remove(this.SETTING_KEY);
    await this.notify('登出成功', '敏感信息已全部删除');
  }

  /**
   * 检查更新
   */
  async checkUpdate(jsonName) {
    const fileName = Script.name() + '.js';
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
    const request = new Request(`${this.getStaticUrl()}/build/${jsonName}.json`);
    const response = await request.loadJSON();
    console.log(`远程版本：${response?.version}`);
    if (response?.version === this.version) return this.notify('无需更新', '远程版本一致，暂无更新')
    console.log('发现新的版本');

    const log = response?.changelog.join('\n');
    const alert = new Alert();
    alert.title = '更新提示';
    alert.message = `是否需要升级到${response?.version.toString()}版本\n\r${log}`;
    alert.addAction('更新');
    alert.addCancelAction('取消');
    const id = await alert.presentAlert();
    if (id === -1) return
    await this.notify('正在更新中...');
    const REMOTE_REQ = new Request(response?.download);
    const REMOTE_RES = await REMOTE_REQ.load();
    FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), fileName), REMOTE_RES);

    await this.notify('Joiner 桌面组件更新完毕！');
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
   * @param {Object} location 经纬度
   * @param {boolean} debug 开启日志输出
   * @return {Promise<{customAddress, completeAddress}|{customAddress: *, completeAddress: *}>}
   */
  async getCarAddressInfo(location, debug = false) {
    const longitude = location?.longitude || this.settings['longitude'];
    const latitude = location?.latitude || this.settings['latitude'];

    // 经纬度异常判断
    if (longitude === undefined || latitude === undefined) {
      return {
        customAddress: '暂无位置信息',
        completeAddress: '暂无位置信息'
      }
    }

    const aMapKey = this.settings['aMapKey']?.trim();
    const options = {
      url: `https://restapi.amap.com/v3/geocode/regeo?key=${aMapKey}&location=${longitude},${latitude}&radius=1000&extensions=all&batch=false&roadlevel=0`,
      method: 'GET'
    };
    try {
      const response = await this.http(options);
      if (response.status === '1') {
        const addressComponent = response.regeocode.addressComponent;
        const aois = response.regeocode.aois;
        let customAddress = '';
        const format = this.settings['locationFormat']?.split('|')?.map(item => {
          switch (item) {
            case '国':
              item = 'country';
              break
            case '省':
              item = 'province';
              break
            case '市':
              item = 'city';
              break
            case '区':
              item = 'district';
              break
            case '乡镇':
              item = 'township';
              break
            case '社区':
              item = 'neighborhood';
              break
            case '街道':
              item = 'streetNumber';
              break
            case '建筑':
              item = 'building';
              break
            case '区域':
              item = 'aois';
              break
          }
          return item
        });
        if (Array.isArray(format)) {
          format.forEach(item => {
            if (item === 'neighborhood') {
              customAddress += (addressComponent[item].name || '');
            } else if (item === 'building') {
              customAddress += (addressComponent[item].name || '');
            } else if (item === 'streetNumber') {
              customAddress += (addressComponent[item].street || '');
            } else if (item === 'aois') {
              customAddress += (aois[0]?.name || '');
            } else {
              customAddress += (addressComponent[item] || '');
            }
          });
        }
        const completeAddress = response.regeocode.formatted_address || '暂无位置信息';
        this.settings['customAddress'] = customAddress;
        this.settings['completeAddress'] = completeAddress;
        await this.saveSettings(false);
        console.log('获取车辆地理位置信息成功');
        if (debug) {
          console.log('当前车辆地理位置：');
          console.log('自定义地址：' + customAddress);
          console.log('详细地址：' + completeAddress);
          console.log('车辆地理位置返回数据：');
          console.log(response);
        }
        return {
          customAddress,
          completeAddress
        }
      } else {
        console.error('获取车辆位置失败，请检查高德地图 key 是否填写正常');
        await this.notify('逆编码地理位置失败', '请检查高德地图 key 是否填写正常');
        this.settings['customAddress'] = '暂无位置信息';
        this.settings['completeAddress'] = '暂无位置信息';
        return {
          customAddress: this.settings['customAddress'],
          completeAddress: this.settings['completeAddress']
        }
      }
    } catch (error) {
      await this.notify('请求失败', '提示：' + error);
      console.error(error);
      this.settings['customAddress'] = '暂无位置信息';
      this.settings['completeAddress'] = '暂无位置信息';
      return {
        customAddress: this.settings['customAddress'],
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
      const data = await this.getData();
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
      const widget = new ListWidget();
      await this.setWidgetDynamicBackground(widget, 'Small');
      widget.setPadding(10, 10, 10, 10);

      const doorStatus = data.doorStatus;
      const windowStatus = data.windowStatus;
      const doorAndWindowNormal = doorStatus.concat(windowStatus).length !== 0;
      const isLocked = data.isLocked;

      const containerStack = this.addStackTo(widget, 'vertical');
      // 续航/燃料信息
      const carInfoStack = this.addStackTo(containerStack, 'horizontal');
      carInfoStack.addSpacer();
      carInfoStack.centerAlignContent();
      const carInfoTextStack = this.addStackTo(carInfoStack, 'horizontal');
      carInfoTextStack.bottomAlignContent();
      const enduranceText = carInfoTextStack.addText(`${data.fuelRange}km`);
      this.setFontFamilyStyle(enduranceText, 14, 'bold');
      this.setWidgetNodeColor(enduranceText, 'textColor');
      if (
        data.fuelLevel && data.fuelLevel <= 20 ||
        data.socLevel && data.socLevel <= 20
      ) {
        enduranceText.textColor = this.dangerColor();
      }
      if (data.fuelLevel) {
        carInfoTextStack.spacing = 4;
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal');
        fuelStack.setPadding(0, 0, 2, 0);
        const fuelText = fuelStack.addText(`${data.fuelLevel}%`);
        this.setFontFamilyStyle(fuelText, 12, 'regular');
        this.setWidgetNodeColor(fuelText, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor();
        }
      }
      if (data.socLevel) {
        carInfoTextStack.spacing = 4;
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal');
        fuelStack.setPadding(0, 0, data.fuelLevel ? 3 : 2, 0);
        const fuelText = fuelStack.addText(data.socLevel + '%');
        this.setFontFamilyStyle(fuelText, data.fuelLevel ? 10 : 12, 'regular');
        this.setWidgetNodeColor(fuelText, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor();
        }
      }
      carInfoStack.addSpacer();
      containerStack.spacing = 5;
      const carPhotoStack = this.addStackTo(containerStack, 'horizontal');
      carPhotoStack.addSpacer();
      const carPhoto = await this.getMyCarPhoto(this.myCarPhotoUrl);
      const inContainerImage = carPhotoStack.addImage(carPhoto);
      carPhotoStack.addSpacer();
      inContainerImage.centerAlignImage();
      const updateTimeStack = this.addStackTo(containerStack, 'horizontal');
      updateTimeStack.bottomAlignContent();
      updateTimeStack.addSpacer();
      const updateTimeText = updateTimeStack.addText(`${this.formatDate(data.updateTimeStamp, 'MM-dd HH:mm')}`);
      this.setFontFamilyStyle(updateTimeText, 12, 'regular');
      this.setWidgetNodeColor(updateTimeText, 'textColor');
      updateTimeStack.addSpacer();

      if (this.isExist(isLocked)) {
        const statusMainStack = this.addStackTo(containerStack, 'horizontal');
        statusMainStack.addSpacer();
        const statusStack = this.addStackTo(statusMainStack, 'horizontal');
        statusStack.centerAlignContent();
        statusStack.setPadding(5, 10, 5, 10);
        statusStack.cornerRadius = 10;
        statusStack.borderWidth = 2;
        if (this.getLockSuccessStyle()) statusStack.backgroundColor = this.successColor(0.25);
        else this.setWidgetNodeColor(statusStack, 'backgroundColor', 0.25);
        if (doorAndWindowNormal) statusStack.backgroundColor = this.warningColor(0.25);
        if (!isLocked) statusStack.backgroundColor = this.dangerColor(0.25);
        if (this.getLockSuccessStyle()) statusStack.borderColor = this.successColor(0.5);
        else this.setWidgetNodeColor(statusStack, 'borderColor', 0.5);
        if (doorAndWindowNormal) statusStack.borderColor = this.warningColor(0.5);
        if (!isLocked) statusStack.borderColor = this.dangerColor(0.5);

        let icon = await this.getSFSymbolImage('lock.fill');
        if (doorAndWindowNormal) icon = await this.getSFSymbolImage('exclamationmark.shield.fill');
        if (!isLocked) icon = await this.getSFSymbolImage('lock.open.fill');
        const statusImage = statusStack.addImage(icon);
        statusImage.imageSize = new Size(12, 12);
        if (this.getLockSuccessStyle()) statusImage.tintColor = this.successColor();
        else this.setWidgetNodeColor(statusImage, 'tintColor');
        if (doorAndWindowNormal) statusImage.tintColor = this.warningColor();
        if (!isLocked) statusImage.tintColor = this.dangerColor();
        statusStack.spacing = 4;

        const infoStack = this.addStackTo(statusStack, 'vertical');
        let status = '车辆已锁定';
        if (doorAndWindowNormal) status = '门窗未锁定';
        if (!isLocked) status = '未锁车';
        const statusText = infoStack.addText(status);
        this.setFontFamilyStyle(statusText, 12, 'regular');
        if (this.getLockSuccessStyle()) statusText.textColor = this.successColor();
        else this.setWidgetNodeColor(statusText, 'textColor');
        if (doorAndWindowNormal) statusText.textColor = this.warningColor();
        if (!isLocked) statusText.textColor = this.dangerColor();
        statusMainStack.addSpacer();
      }

      return widget
    } catch (error) {
      await this.writeErrorLog(data, error);
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
      const widget = new ListWidget();
      await this.setWidgetDynamicBackground(widget, 'Medium');
      widget.setPadding(15, 15, 10, 15);
      // region logoStack
      const rowHeader = this.addStackTo(widget, 'horizontal');
      rowHeader.setPadding(0, 0, 0, 0);
      rowHeader.topAlignContent();
      // 车辆名称
      const nameStack = this.addStackTo(rowHeader, 'vertical');
      const carText = nameStack.addText(data.seriesName);
      this.setFontFamilyStyle(carText, 18, 'bold');
      this.setWidgetNodeColor(carText, 'textColor');
      // 2.0 140KW B9 40TFSI S-line
      const powerText = nameStack.addText(data.carModelName);
      this.setFontFamilyStyle(powerText, 10, 'regular');
      this.setWidgetNodeColor(powerText, 'textColor');
      rowHeader.addSpacer();
      const headerRightStack = this.addStackTo(rowHeader, 'vertical');
      headerRightStack.centerAlignContent();
      const baseInfoStack = this.addStackTo(headerRightStack, 'horizontal');
      baseInfoStack.addSpacer();
      baseInfoStack.centerAlignContent();
      // 车牌显示
      if (data.showPlate) {
        const plateNoStack = this.addStackTo(baseInfoStack, 'vertical');
        plateNoStack.centerAlignContent();
        const plateNoText = plateNoStack.addText(data.carPlateNo);
        this.setFontFamilyStyle(plateNoText, 12, 'regular');
        this.setWidgetNodeColor(plateNoText, 'textColor');
        baseInfoStack.spacing = 5;
      }
      const logoStack = this.addStackTo(baseInfoStack, 'vertical');
      logoStack.centerAlignContent();
      const carLogo = await this.getMyCarLogo(this.myCarLogoUrl);
      const carLogoImage = logoStack.addImage(carLogo);
      carLogoImage.imageSize = new Size(this.getLogoSize('width'), this.getLogoSize('height'));
      if (this.getLogoHasTint()) this.setWidgetNodeColor(carLogoImage, 'tintColor');
      headerRightStack.spacing = 4;
      const statusStack = this.addStackTo(headerRightStack, 'horizontal');
      statusStack.centerAlignContent();
      statusStack.addSpacer();
      const carLockStack = this.addStackTo(statusStack, 'horizontal');
      carLockStack.centerAlignContent();
      // 门窗状态
      if (this.isExist(data.doorStatus) && this.isExist(data.windowStatus)) {
        const doorStatus = data.doorStatus;
        const windowStatus = data.windowStatus;
        const doorAndWindowNormal = doorStatus.concat(windowStatus).length !== 0;
        // const doorAndWindowNormal = true
        if (doorAndWindowNormal) {
          const carDoorImage = carLockStack.addImage(await this.getSFSymbolImage('xmark.shield.fill'));
          carDoorImage.imageSize = new Size(14, 14);
          carDoorImage.tintColor = this.warningColor();
        }
        carLockStack.spacing = 5;
      }
      // 锁车状态
      if (this.isExist(data.isLocked)) {
        const carLockImage = carLockStack.addImage(await this.getSFSymbolImage('lock.shield.fill'));
        carLockImage.imageSize = new Size(14, 14);
        carLockImage.tintColor = data.isLocked ? this.successColor() : this.dangerColor();
      }
      // endregion
      // region mainStack
      const mainStack = this.addStackTo(widget, 'horizontal');
      mainStack.setPadding(0, 0, 0, 0);
      mainStack.centerAlignContent();
      // region 状态信息展示
      const rowLeftStack = this.addStackTo(mainStack, 'vertical');
      // 续航/燃料信息
      const carInfoStack = this.addStackTo(rowLeftStack, 'horizontal');
      carInfoStack.centerAlignContent();
      const carInfoImageStack = this.addStackTo(carInfoStack, 'vertical');
      carInfoImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const carInfoText = carInfoImageStack.addText('续航里程:');
        this.setFontFamilyStyle(carInfoText, 12);
        this.setWidgetNodeColor(carInfoText, 'textColor');
      } else {
        const carInfoImage = carInfoImageStack.addImage(await this.getSFSymbolImage('gauge'));
        carInfoImage.imageSize = new Size(14, 14);
        this.setWidgetNodeColor(carInfoImage, 'tintColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          carInfoImage.tintColor = this.dangerColor();
        }
      }
      carInfoStack.addSpacer(5);
      const carInfoTextStack = this.addStackTo(carInfoStack, 'horizontal');
      carInfoTextStack.bottomAlignContent();
      const enduranceText = carInfoTextStack.addText(`${data.fuelRange}km`);
      this.setFontFamilyStyle(enduranceText, 14, 'bold');
      this.setWidgetNodeColor(enduranceText, 'textColor');
      if (
        data.fuelLevel && data.fuelLevel <= 20 ||
        data.socLevel && data.socLevel <= 20
      ) {
        enduranceText.textColor = this.dangerColor();
      }
      if (data.fuelLevel) {
        carInfoTextStack.spacing = 4;
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal');
        fuelStack.setPadding(0, 0, 2, 0);
        const fuelText = fuelStack.addText(`${data.fuelLevel}%`);
        this.setFontFamilyStyle(fuelText, 12, 'regular');
        this.setWidgetNodeColor(fuelText, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor();
        }
      }
      if (data.socLevel) {
        carInfoTextStack.spacing = 4;
        const fuelStack = this.addStackTo(carInfoTextStack, 'horizontal');
        fuelStack.setPadding(0, 0, data.fuelLevel ? 3 : 2, 0);
        const fuelText = fuelStack.addText(data.socLevel + '%');
        this.setFontFamilyStyle(fuelText, data.fuelLevel ? 8 : 12, 'regular');
        this.setWidgetNodeColor(fuelText, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor();
        }
      }

      rowLeftStack.spacing = 5;
      // 总里程
      const mileageStack = this.addStackTo(rowLeftStack, 'horizontal');
      mileageStack.bottomAlignContent();
      const mileageImageStack = this.addStackTo(mileageStack, 'vertical');
      mileageImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const mileageText = mileageImageStack.addText('行程里程:');
        this.setFontFamilyStyle(mileageText, 12);
        this.setWidgetNodeColor(mileageText, 'textColor');
      } else {
        const mileageImage = mileageImageStack.addImage(await this.getSFSymbolImage('car'));
        mileageImage.imageSize = new Size(14, 14);
        this.setWidgetNodeColor(mileageImage, 'tintColor');
      }
      mileageStack.addSpacer(5);
      const mileageTextStack = this.addStackTo(mileageStack, 'horizontal');
      mileageTextStack.bottomAlignContent();
      const mileageText = mileageTextStack.addText(data.mileage + 'km');
      this.setFontFamilyStyle(mileageText, 12, 'regular');
      this.setWidgetNodeColor(mileageText, 'textColor');

      rowLeftStack.spacing = 5;
      // 更新日期
      const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal');
      dateTimeStack.bottomAlignContent();
      const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical');
      dateTimeImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const dateTimeText = dateTimeImageStack.addText('刷新时间:');
        this.setFontFamilyStyle(dateTimeText, 12);
        this.setWidgetNodeColor(dateTimeText, 'textColor');
      } else {
        const dateTimeImage = dateTimeImageStack.addImage(await this.getSFSymbolImage('arrow.clockwise.icloud'));
        dateTimeImage.imageSize = new Size(15, 15);
        this.setWidgetNodeColor(dateTimeImage, 'tintColor');
      }
      dateTimeStack.addSpacer(5);
      const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal');
      dateTimeTextStack.bottomAlignContent();
      const dateTimeText = dateTimeTextStack.addText(this.formatDate(data.updateTimeStamp, 'MM-dd HH:mm'));
      this.setFontFamilyStyle(dateTimeText, 12, 'regular');
      this.setWidgetNodeColor(dateTimeText, 'textColor');
      // endregion
      mainStack.addSpacer();
      // region 右侧车辆图片
      const rowRightStack = this.addStackTo(mainStack, 'vertical');
      const carPhoto = await this.getMyCarPhoto(this.myCarPhotoUrl);
      const carPhotoStack = rowRightStack.addImage(carPhoto);
      carPhotoStack.centerAlignImage();
      // endregion
      // endregion
      const footTextData = data.showLocation ? data.showLocationFormat ? data.customAddress : data.completeAddress : data.myOne;
      const footerStack = this.addStackTo(widget, 'horizontal');
      footerStack.setPadding(5, 0, 0, 0);
      footerStack.centerAlignContent();
      footerStack.addSpacer();
      const footerText = footerStack.addText(footTextData);
      this.setFontFamilyStyle(footerText, 10, 'regular');
      this.setWidgetNodeColor(footerText, 'textColor');
      footerText.centerAlignText();
      footerStack.addSpacer();

      return widget
    } catch (error) {
      await this.writeErrorLog(data, error);
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
      const widget = new ListWidget();
      await this.setWidgetDynamicBackground(widget, 'Large');

      widget.setPadding(15, 15, 15, 15);
      // region headerStack
      const rowHeader = this.addStackTo(widget, 'horizontal');
      rowHeader.setPadding(0, 0, 10, 0);
      rowHeader.topAlignContent();
      // 顶部左侧
      const headerLeftStack = this.addStackTo(rowHeader, 'vertical');
      // 车辆名称
      const nameStack = this.addStackTo(headerLeftStack, 'vertical');
      const carText = nameStack.addText(data.seriesName);
      this.setFontFamilyStyle(carText, 22, 'bold');
      this.setWidgetNodeColor(carText, 'textColor');
      // 功率显示
      const powerStack = this.addStackTo(headerLeftStack, 'vertical');
      const powerText = powerStack.addText(data.carModelName);
      this.setFontFamilyStyle(powerText, 14, 'regular');
      this.setWidgetNodeColor(powerText, 'textColor');
      // 俩侧分割
      rowHeader.addSpacer();
      // 顶部右侧
      const logoWidth = this.getLogoSize('width') * 1.5;
      const logoHeight = this.getLogoSize('height') * 1.5;
      const headerRightStackWidth = data.showPlate ? data.carPlateNo ? data.carPlateNo.length * 12 : logoWidth : logoWidth + 10;
      const headerRightStackHeight = data.showPlate ? logoHeight + 25 : logoHeight;
      const headerRightStack = this.addStackTo(rowHeader, 'vertical');
      headerRightStack.size = new Size(headerRightStackWidth, headerRightStackHeight);
      // Logo
      const carLogoStack = this.addStackTo(headerRightStack, 'horizontal');
      carLogoStack.addText('');
      carLogoStack.addSpacer();
      const carLogo = await this.getMyCarLogo(this.myCarLogoUrl);
      const carLogoImage = carLogoStack.addImage(carLogo);
      carLogoImage.imageSize = new Size(logoWidth, logoHeight);
      if (this.getLogoHasTint()) this.setWidgetNodeColor(carLogoImage, 'tintColor');
      headerRightStack.spacing = 5;
      // 车牌信息
      if (data.showPlate) {
        const plateNoStack = this.addStackTo(headerRightStack, 'horizontal');
        plateNoStack.addText('');
        plateNoStack.addSpacer();
        const plateNoText = plateNoStack.addText(data.carPlateNo);
        this.setFontFamilyStyle(plateNoText, 12, 'regular');
        this.setWidgetNodeColor(plateNoText, 'textColor');
      }
      // endregion
      // region mainStack
      const mainStack = this.addStackTo(widget, 'horizontal');
      mainStack.centerAlignContent();
      mainStack.setPadding(0, 0, 0, 0);
      // region 状态信息展示
      const rowLeftStack = this.addStackTo(mainStack, 'vertical');
      // region 续航里程
      const enduranceStack = this.addStackTo(rowLeftStack, 'horizontal');
      enduranceStack.bottomAlignContent();
      const enduranceImageStack = this.addStackTo(enduranceStack, 'vertical');
      enduranceImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const enduranceText = enduranceImageStack.addText('续航里程:');
        this.setFontFamilyStyle(enduranceText, 14);
        this.setWidgetNodeColor(enduranceText, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          enduranceText.textColor = this.dangerColor();
        }
      } else {
        const enduranceImage = enduranceImageStack.addImage(await this.getSFSymbolImage('flag.circle'));
        enduranceImage.imageSize = new Size(18, 18);
        this.setWidgetNodeColor(enduranceImage, 'tintColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          enduranceImage.tintColor = this.dangerColor();
        }
      }
      enduranceStack.addSpacer(5);
      const enduranceTextStack = this.addStackTo(enduranceStack, 'horizontal');
      enduranceTextStack.bottomAlignContent();
      const enduranceText = enduranceTextStack.addText(data.fuelRange + 'km');
      this.setFontFamilyStyle(enduranceText, 14, 'bold');
      this.setWidgetNodeColor(enduranceText, 'textColor');
      if (data.fuelLevel && data.fuelLevel <= 20 || data.socLevel && data.socLevel <= 20) {
        enduranceText.textColor = this.dangerColor();
      }
      rowLeftStack.addSpacer(5);
      // endregion
      // region 燃料信息
      const fuelStack = this.addStackTo(rowLeftStack, 'horizontal');
      fuelStack.bottomAlignContent();
      const fuelImageStack = this.addStackTo(fuelStack, 'vertical');
      fuelImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const fuelText = fuelImageStack.addText('燃料剩余:');
        this.setFontFamilyStyle(fuelText, 14);
        this.setWidgetNodeColor(fuelText, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText.textColor = this.dangerColor();
        }
      } else {
        let fuelIcon = 'fuelpump.circle';
        if (data.socLevel) fuelIcon = 'bolt.circle';
        const fuelImage = fuelImageStack.addImage(await this.getSFSymbolImage(fuelIcon));
        fuelImage.imageSize = new Size(18, 18);
        this.setWidgetNodeColor(fuelImage, 'tintColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelImage.tintColor = this.dangerColor();
        }
      }
      fuelStack.addSpacer(5);
      // 汽油
      const fuelTextStack1 = this.addStackTo(fuelStack, 'horizontal');
      fuelTextStack1.bottomAlignContent();
      if (data.fuelLevel) {
        const fuelText1 = fuelTextStack1.addText(data.fuelLevel + '%');
        this.setFontFamilyStyle(fuelText1, 14, 'regular');
        this.setWidgetNodeColor(fuelText1, 'textColor');
        fuelStack.addSpacer(5);
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText1.textColor = this.dangerColor();
        }
      }
      // 电池
      if (data.socLevel) {
        const fuelTextStack2 = this.addStackTo(fuelStack, 'horizontal');
        fuelTextStack2.bottomAlignContent();
        const fuelText2 = fuelTextStack2.addText(data.socLevel + '%');
        this.setFontFamilyStyle(fuelText2, data.fuelLevel ? 12 : 14, 'regular');
        this.setWidgetNodeColor(fuelText2, 'textColor');
        if (
          data.fuelLevel && data.fuelLevel <= 20 ||
          data.socLevel && data.socLevel <= 20
        ) {
          fuelText2.textColor = this.dangerColor();
        }
      }
      rowLeftStack.addSpacer(5);
      // endregion
      // region 总里程
      const mileageStack = this.addStackTo(rowLeftStack, 'horizontal');
      mileageStack.bottomAlignContent();
      const mileageImageStack = this.addStackTo(mileageStack, 'vertical');
      mileageImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const mileageText = mileageImageStack.addText('行程里程:');
        this.setFontFamilyStyle(mileageText, 14);
        this.setWidgetNodeColor(mileageText, 'textColor');
      } else {
        const mileageImage = mileageImageStack.addImage(await this.getSFSymbolImage('car.circle'));
        mileageImage.imageSize = new Size(18, 18);
        this.setWidgetNodeColor(mileageImage, 'tintColor');
      }
      mileageStack.addSpacer(5);
      const mileageTextStack = this.addStackTo(mileageStack, 'horizontal');
      mileageTextStack.bottomAlignContent();
      const mileageText = mileageTextStack.addText(data.mileage + 'km');
      this.setFontFamilyStyle(mileageText, 14, 'regular');
      this.setWidgetNodeColor(mileageText, 'textColor');
      rowLeftStack.addSpacer(5);
      // endregion
      // region 机油数据
      if (data.oilSupport && data.oilLevel !== '0.0') {
        const oilStack = this.addStackTo(rowLeftStack, 'horizontal');
        oilStack.bottomAlignContent();
        const oilImageStack = this.addStackTo(oilStack, 'vertical');
        oilImageStack.bottomAlignContent();
        if (this.settings['showType']) {
          const oilText = oilImageStack.addText('机油剩余:');
          this.setFontFamilyStyle(oilText, 14);
          this.setWidgetNodeColor(oilText, 'textColor');
        } else {
          const oilImage = oilImageStack.addImage(await this.getSFSymbolImage('drop.circle'));
          oilImage.imageSize = new Size(18, 18);
          if (Number(data.oilLevel) <= 12.5) {
            oilImage.tintColor = this.dangerColor();
          } else {
            this.setWidgetNodeColor(oilImage, 'tintColor');
          }
        }
        oilStack.addSpacer(5);
        const oilTextStack = this.addStackTo(oilStack, 'horizontal');
        oilTextStack.bottomAlignContent();
        const oilText = oilTextStack.addText(data.oilLevel + '%');
        this.setFontFamilyStyle(oilText, 14, 'regular');
        if (Number(data.oilLevel) <= 12.5) {
          oilText.textColor = this.dangerColor();
        } else {
          this.setWidgetNodeColor(oilText, 'textColor');
        }
        rowLeftStack.addSpacer(5);
      }
      // endregion
      // region 锁车状态
      if (this.isExist(data.isLocked)) {
        const lockedStack = this.addStackTo(rowLeftStack, 'horizontal');
        lockedStack.bottomAlignContent();
        const lockedImageStack = this.addStackTo(lockedStack, 'vertical');
        lockedImageStack.bottomAlignContent();
        if (this.settings['showType']) {
          const lockedText = lockedImageStack.addText('车辆状态:');
          this.setFontFamilyStyle(lockedText, 14);
          this.setWidgetNodeColor(lockedText, 'textColor');
        } else {
          const lockedImage = lockedImageStack.addImage(await this.getSFSymbolImage('lock.circle'));
          lockedImage.imageSize = new Size(18, 18);
          if (this.getLockSuccessStyle()) lockedImage.tintColor = this.successColor();
          else this.setWidgetNodeColor(lockedImage, 'tintColor');
          if (!data.isLocked) lockedImage.tintColor = this.dangerColor();
        }
        lockedStack.addSpacer(5);
        const lockedTextStack = this.addStackTo(lockedStack, 'horizontal');
        lockedTextStack.bottomAlignContent();
        const lockedText = lockedTextStack.addText(data.isLocked ? '已锁车' : '未锁车');
        this.setFontFamilyStyle(lockedText, 14, 'regular');
        if (this.getLockSuccessStyle()) lockedText.textColor = this.successColor();
        else this.setWidgetNodeColor(lockedText, 'textColor');
        if (!data.isLocked) lockedText.textColor = this.dangerColor();
        rowLeftStack.addSpacer(5);
      }
      // endregion
      // region 保养里程
      if (this.isExist(data.kmMaint)) {
        const kmMaintStack = this.addStackTo(rowLeftStack, 'horizontal');
        kmMaintStack.bottomAlignContent();
        const kmMaintImageStack = this.addStackTo(kmMaintStack, 'vertical');
        kmMaintImageStack.bottomAlignContent();
        if (this.settings['showType']) {
          const kmMaintText = kmMaintImageStack.addText('保养里程:');
          this.setFontFamilyStyle(kmMaintText, 14);
          this.setWidgetNodeColor(kmMaintText, 'textColor');
        } else {
          const kmMaintImage = kmMaintImageStack.addImage(await this.getSFSymbolImage('gearshape.circle'));
          kmMaintImage.imageSize = new Size(18, 18);
          this.setWidgetNodeColor(kmMaintImage, 'tintColor');
        }
        kmMaintStack.addSpacer(5);
        const kmMaintTextStack = this.addStackTo(kmMaintStack, 'horizontal');
        kmMaintTextStack.bottomAlignContent();
        const kmMaintText = kmMaintTextStack.addText(data.kmMaint + 'km');
        this.setFontFamilyStyle(kmMaintText, 14, 'regular');
        this.setWidgetNodeColor(kmMaintText, 'textColor');
        rowLeftStack.addSpacer(5);
      }
      // endregion
      // region 流量天数
      if (this.isExist(data.dataPackage)) {
        const dataPackageStack = this.addStackTo(rowLeftStack, 'horizontal');
        dataPackageStack.bottomAlignContent();
        const dataPackageImageStack = this.addStackTo(dataPackageStack, 'vertical');
        dataPackageImageStack.bottomAlignContent();
        if (this.settings['showType']) {
          const dataPackageText = dataPackageImageStack.addText('随车流量:');
          this.setFontFamilyStyle(dataPackageText, 14);
          this.setWidgetNodeColor(dataPackageText, 'textColor');
        } else {
          const dataPackageImage = dataPackageImageStack.addImage(await this.getSFSymbolImage('waveform.circle'));
          dataPackageImage.imageSize = new Size(18, 18);
          this.setWidgetNodeColor(dataPackageImage, 'tintColor');
        }
        dataPackageStack.addSpacer(5);
        const dataPackageTextStack = this.addStackTo(dataPackageStack, 'horizontal');
        dataPackageTextStack.bottomAlignContent();
        const dataPackageText = dataPackageTextStack.addText(data.dataPackage);
        this.setFontFamilyStyle(dataPackageText, 14, 'regular');
        this.setWidgetNodeColor(dataPackageText, 'textColor');
      }
      rowLeftStack.addSpacer(5);
      // endregion
      // region 数据更新日期
      const dateTimeStack = this.addStackTo(rowLeftStack, 'horizontal');
      dateTimeStack.bottomAlignContent();
      const dateTimeImageStack = this.addStackTo(dateTimeStack, 'vertical');
      dateTimeImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const dateTimeText = dateTimeImageStack.addText('云端刷新:');
        this.setFontFamilyStyle(dateTimeText, 14);
        this.setWidgetNodeColor(dateTimeText, 'textColor');
      } else {
        const dateTimeImage = dateTimeImageStack.addImage(await this.getSFSymbolImage('arrow.clockwise.icloud'));
        dateTimeImage.imageSize = new Size(18, 18);
        this.setWidgetNodeColor(dateTimeImage, 'tintColor');
      }
      dateTimeStack.addSpacer(5);
      const dateTimeTextStack = this.addStackTo(dateTimeStack, 'horizontal');
      dateTimeTextStack.bottomAlignContent();
      const dateTimeText = dateTimeTextStack.addText(this.formatDate(data.updateTimeStamp, 'MM-dd HH:mm'));
      this.setFontFamilyStyle(dateTimeText, 14, 'regular');
      this.setWidgetNodeColor(dateTimeText, 'textColor');
      rowLeftStack.addSpacer(5);
      // endregion
      // region 刷新日期
      const updateStack = this.addStackTo(rowLeftStack, 'horizontal');
      updateStack.bottomAlignContent();
      const updateImageStack = this.addStackTo(updateStack, 'vertical');
      updateImageStack.bottomAlignContent();
      if (this.settings['showType']) {
        const updateText = updateImageStack.addText('本地刷新:');
        this.setFontFamilyStyle(updateText, 14);
        this.setWidgetNodeColor(updateText, 'textColor');
      } else {
        const updateImage = updateImageStack.addImage(await this.getSFSymbolImage('clock.arrow.2.circlepath'));
        updateImage.imageSize = new Size(18, 18);
        this.setWidgetNodeColor(updateImage, 'tintColor');
      }
      updateStack.addSpacer(5);
      const updateTextStack = this.addStackTo(updateStack, 'horizontal');
      updateTextStack.bottomAlignContent();
      const updateText = updateTextStack.addText(this.formatDate(data.updateNowDate, 'MM-dd HH:mm'));
      this.setFontFamilyStyle(updateText, 14, 'regular');
      this.setWidgetNodeColor(updateText, 'textColor');
      // endregion
      // endregion
      mainStack.addSpacer();
      // region 右侧车辆图片
      const rowRightStack = this.addStackTo(mainStack, 'vertical');
      rowRightStack.addSpacer();
      const carPhotoStack = this.addStackTo(rowRightStack, 'horizontal');
      carPhotoStack.addSpacer();
      carPhotoStack.centerAlignContent();
      const carPhoto = await this.getMyCarPhoto(this.myCarPhotoUrl);
      const carPhotoImage = carPhotoStack.addImage(carPhoto);
      carPhotoImage.centerAlignImage();
      if (this.isExist(data.doorStatus) || this.isExist(data.windowStatus)) {
        const statusStack = this.addStackTo(rowRightStack, 'vertical');
        statusStack.setPadding(5, 0, 0, 0);
        statusStack.centerAlignContent();

        const doorStatus = data.doorStatus || [];
        const windowStatus = data.windowStatus || [];
        const carStatus = doorStatus.concat(windowStatus);
        // const carStatus = ['左前门', '后备箱', '右前窗', '右后窗', '天窗']
        if (carStatus.length !== 0) {
          const statusArray = format2Array(carStatus, 3);
          statusArray.forEach(arr => {
            const statusRowStack = this.addStackTo(statusStack, 'horizontal');
            statusRowStack.setPadding(2, 0, 2, 0);
            statusRowStack.centerAlignContent();
            arr.forEach(async (item) => {
              const statusItemStack = this.addStackTo(statusRowStack, 'horizontal');
              statusItemStack.addSpacer();
              statusItemStack.centerAlignContent();
              const image = await this.getSFSymbolImage('exclamationmark.shield.fill');
              const statusItemImage = statusItemStack.addImage(image);
              statusItemImage.imageSize = new Size(12, 12);
              statusItemImage.tintColor = this.warningColor();
              statusItemStack.addSpacer(2);
              const statusItemText = statusItemStack.addText(item);
              this.setFontFamilyStyle(statusItemText, 12);
              statusItemText.textColor = this.warningColor();
              statusItemText.centerAlignText();
              statusItemStack.addSpacer();
            });
          });
        } else {
          statusStack.addSpacer(5);
          const statusInfoStack = this.addStackTo(statusStack, 'horizontal');
          statusInfoStack.addSpacer();
          const statusItemStack = this.addStackTo(statusInfoStack, 'horizontal');
          // statusItemStack.setPadding(5, 0, 5, 0)
          statusItemStack.setPadding(5, 10, 5, 10);
          statusItemStack.cornerRadius = 10;
          statusItemStack.borderWidth = 2;
          if (this.getLockSuccessStyle()) statusItemStack.borderColor = this.successColor(0.5);
          else this.setWidgetNodeColor(statusItemStack, 'borderColor', 0.5);
          if (this.getLockSuccessStyle()) statusItemStack.backgroundColor = this.successColor(0.25);
          else this.setWidgetNodeColor(statusItemStack, 'backgroundColor', 0.25);

          statusItemStack.centerAlignContent();
          const statusItemImage = statusItemStack.addImage(await this.getSFSymbolImage('checkmark.shield.fill'));
          statusItemImage.imageSize = new Size(12, 12);
          if (this.getLockSuccessStyle()) statusItemImage.tintColor = this.successColor();
          else this.setWidgetNodeColor(statusItemImage, 'tintColor');
          statusItemStack.addSpacer(2);
          const statusItemText = statusItemStack.addText('当前车窗已全关闭');
          this.setFontFamilyStyle(statusItemText, 12);
          if (this.getLockSuccessStyle()) statusItemText.textColor = this.successColor();
          else this.setWidgetNodeColor(statusItemText, 'textColor');
          statusItemText.centerAlignText();
          statusInfoStack.addSpacer();
        }
      }
      rowRightStack.addSpacer();
      // endregion
      // region 地图
      if (data.showLocation) {
        const footerWrapperStack = this.addStackTo(widget, 'horizontal');
        footerWrapperStack.setPadding(0, 0, 0, 0);
        if (this.settings['largeMapType']) footerWrapperStack.addSpacer();
        const footerStack = this.addStackTo(footerWrapperStack, 'horizontal');
        footerStack.cornerRadius = this.getLocationBorderRadius();
        this.setWidgetNodeColor(footerStack, 'borderColor', 0.25);
        footerStack.borderWidth = 2;
        footerStack.setPadding(0, 0, 0, 0);
        footerStack.centerAlignContent();

        const hasLocation = data.completeAddress !== '暂无位置信息';
        if (this.settings['largeMapType']) {
          // 地图图片
          const locationPicture = hasLocation ? data.largeLocationPicture : `${this.getStaticUrl()}/build/assets/images/transparent.png`;
          footerStack.backgroundImage = await this.getImageByUrl(locationPicture, false);
          // 填充内容
          const footerFillStack = this.addStackTo(footerStack, 'horizontal');
          footerFillStack.setPadding(25, 0, 25, 0);
          footerFillStack.addSpacer();
          const fillText = footerFillStack.addText(hasLocation ? ' ' : data.completeAddress);
          this.setFontFamilyStyle(fillText, 12);
          this.setWidgetNodeColor(fillText, 'textColor');
          footerFillStack.addSpacer();
          footerWrapperStack.addSpacer();
        } else {
          if (hasLocation) {
            const footerLeftStack = this.addStackTo(footerStack, 'vertical');
            const locationImage = await this.getImageByUrl(data.largeLocationPicture, false);
            const locationImageStack = footerLeftStack.addImage(locationImage);
            locationImageStack.imageSize = new Size(100, 60);
            locationImageStack.centerAlignImage();
            footerStack.addSpacer();
            // 地理位置
            const footerRightStack = this.addStackTo(footerStack, 'horizontal');
            footerRightStack.addSpacer();
            const addressText = data.showLocationFormat ? data.customAddress : data.completeAddress;
            const locationText = footerRightStack.addText(addressText);
            this.setFontFamilyStyle(locationText, 12);
            locationText.centerAlignText();
            this.setWidgetNodeColor(locationText, 'textColor');
            footerRightStack.addSpacer();
          } else {
            // 填充内容
            const footerFillStack = this.addStackTo(footerStack, 'horizontal');
            const locationPicture = `${this.getStaticUrl()}/build/assets/images/transparent.png`;
            footerStack.backgroundImage = await this.getImageByUrl(locationPicture, false);
            footerFillStack.setPadding(25, 0, 25, 0);
            footerFillStack.addSpacer();
            const fillText = footerFillStack.addText(data.completeAddress);
            this.setFontFamilyStyle(fillText, 12);
            this.setWidgetNodeColor(fillText, 'textColor');
            footerFillStack.addSpacer();
            footerWrapperStack.addSpacer();
          }
        }
        footerStack.addSpacer();
      }
      // endregion
      // 一言
      const oneStack = this.addStackTo(widget, 'horizontal');
      oneStack.setPadding(10, 0, 0, 0);
      oneStack.addSpacer();
      oneStack.centerAlignContent();
      const oneText = oneStack.addText(data.myOne);
      this.setFontFamilyStyle(oneText, 12);
      this.setWidgetNodeColor(oneText, 'textColor');
      oneText.centerAlignText();
      oneStack.addSpacer();

      return widget
    } catch (error) {
      await this.writeErrorLog(data, error);
      throw error
    }
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget();

    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/images/fvw_audi_default.png`));

    const text = widget.addText('欢迎使用 Joiner 系列汽车组件');
    switch (this.widgetFamily) {
      case 'large':
        text.font = Font.blackSystemFont(18);
        break
      case 'medium':
        text.font = Font.blackSystemFont(18);
        break
      case 'small':
        text.font = Font.blackSystemFont(12);
        break
    }
    text.centerAlignText();
    text.textColor = Color.white();

    return widget
  }
}

const Running = async (Widget, defaultArgs = '') => {
  let M = null;
  // 判断hash是否和当前设备匹配
  if (config.runsInWidget) {
    M = new Widget(args.widgetParameter || '');
    const W = await M.render();
    Script.setWidget(W);
    Script.complete();
  } else if (config.runsWithSiri) {
    M = new Widget(args.shortcutParameter || '');
    const data = await M.siriShortcutData();
    Script.setShortcutOutput(data);
  } else {
    let { act, data, __arg, __size } = args.queryParameters;
    M = new Widget(__arg || defaultArgs || '');
    if (__size) M.init(__size);
    if (!act || !M['_actions']) {
      // 弹出选择菜单
      const actions = M['_actions'];
      const _actions = [];
      const alert = new Alert();
      alert.title = M.name;
      alert.message = M.desc;
      for (let _ in actions) {
        alert.addAction(_);
        _actions.push(actions[_]);
      }
      alert.addCancelAction('取消操作');
      const idx = await alert.presentSheet();
      if (_actions[idx]) {
        const func = _actions[idx];
        await func();
      }
      return
    }
    let _tmp = act.split('-').map(_ => _[0].toUpperCase() + _.substr(1)).join('');
    let _act = `action${_tmp}`;
    if (M[_act] && typeof M[_act] === 'function') {
      const func = M[_act].bind(M);
      await func(data);
    }
  }
};

class Widget extends UIRender {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg);
    this.name = '东风风神挂件';
    this.desc = '东风风神车辆桌面组件展示';

    this.myCarPhotoUrl = `${this.getStaticUrl()}/build/assets/images/dfpv_default.png`;
    this.myCarLogoUrl = `${this.getStaticUrl()}/build/assets/images/dfpv_logo.png`;
    this.logoWidth = 40;
    this.logoHeight = 20;

    this.defaultMyOne = '纵享驾趣 一路风神';

    if (config.runsInApp) {
      if (!this.settings['isLogin']) this.registerAction('账户登录', this.actionAccountLogin);
      if (this.settings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings);
      if (this.settings['isLogin']) this.registerAction('界面微调', this.actionUIRenderSettings);
      if (this.settings['isLogin']) this.registerAction('刷新数据', this.actionRefreshData);
      if (this.settings['isLogin']) this.registerAction('登出重置', this.actionLogOut);
      if (this.settings['isLogin']) this.registerAction('预览组件', this.actionTriggerPreview);
      if (this.settings['isLogin']) this.registerAction('调试日志', this.actionDebug);
      this.registerAction('主题下载', this.actionDownloadThemes);
      this.registerAction('淮城一只猫', this.actionAuthor);
      this.registerAction('当前版本: v' + this.version, this.actionAbout);
    }
  }

  /**
   * 登录账户
   * @param {boolean} debug 开启日志输出
   * @param {string} code 验证码id
   * @returns {Promise<void>}
   */
  async handleSmsCodeRequest(debug = false, code) {
    let codeParams = {};
    if (code) {
      codeParams = {
        captchaToken: code,
        captchaCode: this.settings['verificationCode']
      };
    }
    const options = {
      url: 'https://app-m.dfpv.com.cn/gateway/micro/app/api/login/fs/snedMoblieLoginSms',
      method: 'POST',
      headers: this.requestHeader(),
      body: JSON.stringify({
        ...{
          mobile: this.settings['username'].trim(),
          appCode: 9010,
          providerCode: 'LCBCAPTCHA',
        },
        ...codeParams
      })
    };
    try {
      const response = await this.http(options);
      if (debug) {
        console.log('登录接口返回数据：');
        console.log(response);
      }
      if (response.statusCode === '200') {
        await this.notify('请求成功', '已发送短信验证码，请耐心等待！');
        await this.handleSmsLogin();
      } else if (response.statusCode === '9135') {
        console.log('需要输入图文验证码');
        await this.handleVerificationCodeLogin(response.result, debug);
      } else {
        console.error('请求失败：' + response.msg);
        await this.notify('请求失败', '请求失败：' + response.msg);
      }
    } catch (error) {
      // Error: 似乎已断开与互联网到连接。
      console.error(error);
    }
  }

  /**
   * 获取图文验证码
   * @returns {Promise<void>}
   */
  async handleVerificationCodeLogin(code, debug) {
    const options = {
      url: 'https://app-m.dfpv.com.cn/gateway/micro/app/api/captcha/' + code,
      method: 'POST',
      headers: this.requestHeader(),
      body: JSON.stringify({
        appCode: 9010
      })
    };
    try {
      const response = await this.http(options);
      if (debug) {
        console.log('登录接口返回数据：');
        console.log(response);
      }
      if (response.statusCode === '200') {
        await this.notify('获取图文验证码', '查看输入图文验证码');
        const data = response.result;
        const imgStr = Data.fromBase64String(data.substring(23, data.length));
        await QuickLook.present(Image.fromData(imgStr));
        await this.handleVerificationCode(debug, code);
      } else {
        console.error('请求失败：' + response.msg);
        await this.notify('请求失败', '请求失败：' + response.msg);
      }
    } catch (error) {
      // Error: 似乎已断开与互联网到连接。
      console.error(error);
    }
  }

  /**
   * 验证图文验证码
   * @returns {Promise<void>}
   */
  async handleVerificationCode(debug, code) {
    const alert = new Alert();
    alert.title = 'Joiner 登录';
    alert.message = '输入图文验证码进行展示数据';
    alert.addTextField('图文验证码');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return
    this.settings['verificationCode'] = alert.textFieldValue(0);
    console.log('输入图文验证码，准备进行图文验证码登录');
    await this.saveSettings(false);
    await this.handleSmsCodeRequest(debug, code);
  }

  /**
   * 短信验证
   * @returns {Promise<void>}
   */
  async handleSmsLogin() {
    const alert = new Alert();
    alert.title = 'Joiner 登录';
    alert.message = '输入短信验证码进行展示数据';
    alert.addTextField('短信验证码');
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return
    this.settings['smsCode'] = alert.textFieldValue(0);
    console.log('输入短信验证码，准备进行短信验证码登录');
    await this.saveSettings(false);
    await this.handleLoginRequest();
  }

  /**
   * 登录账户
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<void>}
   */
  async handleLoginRequest(debug = false) {
    const options = {
      url: 'https://app-m.dfpv.com.cn/gateway/micro/app/api/login/fs/mobileLogin',
      method: 'POST',
      headers: this.requestHeader(),
      body: JSON.stringify({
        mobile: this.settings['username'].trim(),
        smsCode: this.settings['smsCode'].trim(),
        appCode: 9010
      })
    };
    try {
      const response = await this.http(options);
      if (debug) {
        console.log('登录接口返回数据：');
        console.log(response);
      }
      if (response.statusCode === '200') {
        await this.notify('登录成功', '正在从服务器获取车辆数据，请耐心等待！');
        // 解构数据
        const { token } = response.result;
        this.settings['userToken'] = token;
        this.settings['isLogin'] = true;
        await this.saveSettings(false);
        console.log('账户登录成功，存储用户 userToken 密钥信息，准备获取车辆基本信息');
        // 获取个人中心数据
        await this.getVehiclesStatus(debug);
      } else {
        console.error('账户登录失败：' + response.description);
        await this.notify('账户登录失败', '账户登录失败：' + response.description);
      }
    } catch (error) {
      // Error: 似乎已断开与互联网到连接。
      console.error(error);
    }
  }

  /**
   * 获取车辆状态
   * @param {boolean} debug 开启日志输出
   * @returns {Promise<Object>}
   */
  async getVehiclesStatus(debug = false) {
    const options = {
      url: 'https://app-m.dfpv.com.cn/gateway/micro/app/api/newcar/index/queryNewCarIndex',
      method: 'POST',
      headers: this.requestHeader(this.settings['userToken']),
      body: JSON.stringify({
        appCode: 9010
      })
    };
    try {
      const response = await this.http(options);
      if (debug) {
        console.log('当前车辆状态接口返回数据：');
        console.log(response);
      }
      // 判断接口状态
      if (response.statusCode === '200' && response.result.indexType === 4) {
        // 接口获取数据成功
        this.settings['vehicleData'] = response.result.windLink;
        await this.saveSettings(false);
        return response.result.windLink
      } else {
        // 接口异常
        await this.notify('获取车辆状态异常', '获取车辆状态异常，请重新登录！');
        console.log('获取车辆状态异常');
        if (Keychain.contains(this.SETTING_KEY)) Keychain.remove(this.SETTING_KEY);
      }
    } catch (error) {
      console.error(error);
      return this.settings['vehicleData']
    }
  }

  /**
   * 获取数据
   * @param {boolean} debug 开启日志输出
   * @return {Promise<Object>}
   */
  async getData(debug = false) {
    // 日志追踪
    if (this.settings['trackingLogEnabled']) {
      if (this.settings['debug_bootstrap_date_time']) {
        this.settings['debug_bootstrap_date_time'] += this.formatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss 更新\n');
      } else {
        this.settings['debug_bootstrap_date_time'] = '\n' + this.formatDate(new Date(), 'yyyy年MM月dd日 HH:mm:ss 更新\n');
      }
      await this.saveSettings(false);
    }

    const showLocation = this.settings['aMapKey'] !== '' && this.settings['aMapKey'] !== undefined;
    const showLocationFormat = this.settings['locationFormat'] !== '' && this.settings['locationFormat'] !== undefined;
    const showPlate = this.settings['showPlate'] || false;

    const getVehiclesStatusData = await this.getVehiclesStatus(debug);
    const { homeResp, carDetailInfoList } = getVehiclesStatusData;
    const carDetailInfo = carDetailInfoList[0];

    const vehiclesPosition = {
      longitude: homeResp.data.lon,
      latitude: homeResp.data.lat
    };

    const data = {
      carPlateNo: carDetailInfo.carNumber || '暂无车牌',
      seriesName: this.settings['myCarName'] || carDetailInfo.yearType + carDetailInfo.carTypeName,
      carModelName: this.settings['myCarModelName'] || carDetailInfo.carName || '暂无车辆信息',
      carVIN: homeResp.vin,
      myOne: this.settings['myOne'] || this.defaultMyOne,
      oilSupport: null,
      oilLevel: null,
      parkingLights: null,
      outdoorTemperature: null,
      parkingBrakeActive: null,
      fuelRange: homeResp.data.autonomie, // 燃油
      fuelLevel: homeResp.data.nivHuile, // 燃油百分比
      socLevel: null,
      mileage: homeResp.data.kmTotal,
      updateNowDate: new Date().valueOf(),
      updateTimeStamp: carDetailInfo.updatedTime,
      dataPackage: homeResp.data.dataPackage,
      kmMaint: homeResp.data.kmMaint,
      isLocked: null,
      doorStatus: null,
      windowStatus: null,
      showLocation,
      showLocationFormat,
      showPlate,
      // 获取车辆经纬度
      ...showLocation ? vehiclesPosition : {},
      // 获取车辆位置信息 / 手机位置信息
      ...showLocation ? await this.getCarAddressInfo(vehiclesPosition, debug) : {},
      // 获取静态位置图片
      ...showLocation ? { largeLocationPicture: this.getCarAddressImage(vehiclesPosition, debug) } : {}
    };
    // 保存数据
    this.settings['widgetData'] = data;
    this.settings['scriptName'] = Script.name();
    await this.saveSettings(false);
    if (debug) {
      console.log('获取组件所需数据：');
      console.log(data);
    }
    return data
  }

  /**
   * 账户登录
   */
  async actionAccountLogin() {
    const message = `
      Joiner 小组件需要使用到您的东风风神应用的账号，首次登录请配置账号、密码进行令牌获取\n\r
      Joiner 小组件不会收集您的个人账户信息，所有账号信息将存在 iCloud 或者 iPhone 上但也请您妥善保管自己的账号\n\r
      Joiner 小组件是开源、并且完全免费的，由大众粉丝车主开发，所有责任与东风风神公司无关\n\r
      开发者: 淮城一只猫\n\r
      温馨提示：由于东风风神应用支持单点登录，即不支持多终端应用登录，建议在东风风神应用「爱车 - 智慧车联 - 车辆授权」进行添加用户，这样 Joiner 组件和应用独立执行。
    `;
    const present = await this.actionStatementSettings(message);
    if (present !== -1) {
      const alert = new Alert();
      alert.title = 'Joiner 登录';
      alert.message = '使用手机号请求短信验证码登录进行展示数据';
      alert.addTextField('东风风神手机号', this.settings['username']);
      alert.addAction('确定');
      alert.addCancelAction('取消');

      const id = await alert.presentAlert();
      if (id === -1) return
      this.settings['username'] = alert.textFieldValue(0);
      console.log('您已经同意协议，并且请求短信验证码登录');
      await this.saveSettings(false);
      // await this.getDeviceId()
      await this.handleSmsCodeRequest();
    }
  }

  /**
   * 检查更新
   */
  async actionCheckUpdate() {
    await this.checkUpdate('joiner-version');
  }

  /**
   * 预览组件
   * @returns {Promise<void>}
   */
  async actionTriggerPreview() {
    await this.actionPreview(Widget);
  }

  /**
   * 请求头信息
   * @returns {Object}
   */
  requestHeader(token) {
    return {
      Accept: 'application/json',
      OS: 'iOS',
      'Content-Type': 'application/json',
      'User-Agent': 'taroDemo/1 CFNetwork/1329 Darwin/21.3.0',
      'x-request-info': `${token ? `token=${token};` : ''}appCode=9010;groupId=9503;groupType=8;version=1.4.0`
    }
  }
}

await Running(Widget);
