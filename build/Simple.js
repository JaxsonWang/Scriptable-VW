// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: star;
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

class Widget extends Core {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg);
    this.name = 'Joiner 简约主题';
    this.desc = '依赖 Joiner 组件，额外支持全新风格主题';

    this.appSettings = this.settings['parentSettings'] ? this.getSettings(true, md5(this.settings['parentSettings'])) : null;
    this.version = '1.0.9';

    if (config.runsInApp) {
      this.registerAction('引用组件', this.setParentSettings);
      if (this.settings['parentSettings'] && this.appSettings['isLogin']) this.registerAction('偏好配置', this.actionPreferenceSettings);
      this.registerAction('检查更新', this.actionCheckUpdate);
      this.registerAction('预览组件', this.actionTriggerPreview);
      this.registerAction('当前版本: v' + this.version, this.actionAbout);
    }
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render() {
    const data = await this.getData();
    if (this.appSettings['isLogin']) {
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
    const widget = new ListWidget();
    widget.addText('开发者正在快马加鞭制作中...').centerAlignText();
    return widget
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium(data) {
    const widget = new ListWidget();
    widget.backgroundImage = await this.getImageByUrl(this.simpleTemplatePath('scriptable_style_type1_background'));

    const isEn = data.lang === 'English';
    const container = this.addStackTo(widget, 'horizontal');
    // container.addSpacer()

    const leftStack = this.addStackTo(container, 'vertical');
    const leftTopStack = this.addStackTo(leftStack, 'vertical');
    const logoStack = this.addStackTo(leftTopStack, 'horizontal');
    const logoImage = logoStack.addImage(await this.getImageByUrl(await this.getAppCarLogo()));
    logoImage.imageSize = this.getLogoSize();
    logoImage.tintColor = new Color('#838383', 1);
    leftStack.addSpacer();
    const infoStack = this.addStackTo(leftTopStack, 'vertical');
    infoStack.addSpacer();
    // Car Name
    const nameStack = this.addStackTo(infoStack, 'horizontal');
    const nameText = nameStack.addText(data.seriesName);
    nameText.textColor = new Color('#ffffff', 1);
    nameText.font = isEn ? new Font('Futura-Medium', 22) : new Font('PingFangSC-Medium', 22);
    infoStack.spacing = 4;
    // Time
    const updateStack = this.addStackTo(infoStack, 'horizontal');
    const updateImage = updateStack.addImage(await this.getSFSymbolImage('clock.badge.checkmark'));
    updateImage.tintColor = new Color('#838383', 1);
    updateImage.imageSize = new Size(14, 14);
    updateStack.spacing = 2;
    const updateText = updateStack.addText(this.formatDate(data.updateTimeStamp, 'yyyy-MM-dd HH:mm'));
    updateText.textColor = new Color('#838383', 1);
    updateText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 12) : new Font('PingFangSC-Medium', 12);

    leftStack.addSpacer();
    // bottom left
    const leftBottomStack = this.addStackTo(leftStack, 'vertical');
    // region 续航里程
    const enduranceStack = this.addStackTo(leftBottomStack, 'horizontal');
    enduranceStack.centerAlignContent();
    const enduranceImageStack = this.addStackTo(enduranceStack, 'vertical');
    enduranceImageStack.centerAlignContent();
    const enduranceImage = enduranceImageStack.addImage(await this.getSFSymbolImage('signpost.right'));
    enduranceImage.imageSize = new Size(14, 16);
    enduranceImage.tintColor = new Color('#838383', 1);
    enduranceStack.addSpacer(5);
    const enduranceTextStack = this.addStackTo(enduranceStack, 'horizontal');
    enduranceTextStack.bottomAlignContent();
    const enduranceText = enduranceTextStack.addText(`${isEn ? 'Range' : '续航'}: ${data.fuelRange} km`);
    enduranceText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14);
    enduranceText.textColor = new Color('#838383', 1);
    // endregion
    leftBottomStack.spacing = 5;
    // region 燃料信息
    const fuelStack = this.addStackTo(leftBottomStack, 'horizontal');
    fuelStack.centerAlignContent();
    const fuelImageStack = this.addStackTo(fuelStack, 'vertical');
    fuelImageStack.centerAlignContent();
    const fuelImage = fuelImageStack.addImage(await this.getSFSymbolImage('speedometer'));
    fuelImage.imageSize = new Size(14, 14);
    fuelImage.tintColor = new Color('#838383', 1);
    fuelStack.addSpacer(5);

    const fuelTitleStack = this.addStackTo(fuelStack, 'horizontal');
    fuelTitleStack.bottomAlignContent();
    const fuelTitle = fuelTitleStack.addText(`${isEn ? 'Fuel Level' : '燃料'}: `);
    fuelTitle.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14);
    fuelTitle.textColor = new Color('#838383', 1);
    if (data.fuelLevel) {
      // 汽油
      const fuelTextStack = this.addStackTo(fuelStack, 'horizontal');
      fuelTextStack.bottomAlignContent();
      const fuelText = fuelTextStack.addText(`${data.fuelLevel}%`);
      fuelText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14);
      fuelText.textColor = new Color('#838383', 1);
      fuelStack.addSpacer(5);
    }
    // 电池
    if (data.socLevel) {
      const socTextStack = this.addStackTo(fuelStack, 'horizontal');
      socTextStack.bottomAlignContent();
      const socText = socTextStack.addText(`${data.socLevel}%`);
      socText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14);
      socText.textColor = new Color('#838383', 1);
    }
    // endregion

    container.addSpacer();
    const rightStack = this.addStackTo(container, 'vertical');
    rightStack.addSpacer();
    const rightTopStack = this.addStackTo(rightStack, 'vertical');
    const carPhoto = await this.getAppCarPhoto();
    const carPhotoStack = rightTopStack.addImage(carPhoto);
    carPhotoStack.centerAlignImage();
    rightStack.spacing = 5;
    const rightBottomStack = this.addStackTo(rightStack, 'horizontal');
    rightBottomStack.addSpacer();
    const statusStack = this.addStackTo(rightBottomStack, 'horizontal');
    if (this.isExist(data.isLocked)) {
      statusStack.centerAlignContent();
      statusStack.backgroundColor = new Color('#ffffff', 0.25);
      statusStack.borderColor = data.isLocked ? new Color('#ffffff', 0.5) : this.dangerColor(0.5);
      statusStack.borderWidth = 2;
      statusStack.cornerRadius = 5;
      statusStack.setPadding(5, 15, 5, 15);
      statusStack.centerAlignContent();
      // 锁车解锁图标
      const statusIcon = statusStack.addImage(data.isLocked ? await this.getSFSymbolImage('lock.fill') : await this.getSFSymbolImage('lock.open.fill'));
      statusIcon.imageSize = new Size(18, 18);
      statusIcon.tintColor = data.isLocked ? new Color('#ffffff', 0.5) : this.dangerColor(1);
      statusStack.spacing = 5;
      const statusText = statusStack.addText(data.isLocked ? isEn ? 'Car locked' : '已锁车' : isEn ? 'Car unlocked' : '未锁车');
      statusText.font = isEn ? new Font('AppleSDGothicNeo-Regular', 14) : new Font('PingFangSC-Medium', 14);
      statusText.textColor = data.isLocked ? new Color('#ffffff', 0.5) : this.dangerColor(1);
      rightBottomStack.addSpacer();
    }
    container.addSpacer();
    return widget
  }

  /**
   * 渲染大尺寸组件
   */
  async renderLarge(data) {
    const widget = new ListWidget();
    widget.addText('开发者正在快马加鞭制作中...').centerAlignText();
    return widget
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget();
    widget.addText('请使用 Joiner 核心组件才能使用本主题组件').centerAlignText();
    return widget
  }

  /**
   * 获取数据
   */
  async getData() {
    const data = this.appSettings['widgetData'] || {};
    if (this.settings['myCarName']) data.seriesName = this.settings['myCarName'];
    data.lang = this.settings['widgetLang'] ? this.settings['widgetLang'] : 'Chinese';
    return data
  }

  /**
   * 获取用户车辆照片
   * @returns {Promise<Image|*>}
   */
  async getAppCarPhoto() {
    let myCarPhoto = '';
    const scriptName = this.appSettings['scriptName'];
    switch (scriptName) {
      case 'FVW-Audi-Joiner':
        myCarPhoto = await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/images/fvw_audi_default.png`);
        break
      case 'SVW-Audi-Joiner':
        myCarPhoto = await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/images/svw_audi_default.png`);
        break
      case 'FVW-Joiner':
        myCarPhoto = await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/images/fvw_default.png`);
        break
      case 'SVW-Joiner':
        myCarPhoto = await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/images/svw_default.png`);
        break
      case 'DFPV-Joiner':
        myCarPhoto = await this.getImageByUrl(`${this.getStaticUrl()}/build/assets/images/dfpv_default.png`);
        break
    }
    if (this.appSettings['myCarPhoto']) myCarPhoto = await FileManager.local().readImage(this.appSettings['myCarPhoto']);
    if (this.settings['myCarPhoto']) myCarPhoto = await FileManager.local().readImage(this.settings['myCarPhoto']);
    return myCarPhoto
  }

  /**
   * 获取 Logo
   * @returns {Promise<Image|*>}
   */
  async getAppCarLogo() {
    let myCarLogo = '';
    const scriptName = this.appSettings['scriptName'];
    switch (scriptName) {
      case 'FVW-Audi-Joiner':
        myCarLogo = `${this.getStaticUrl()}/build/assets/images/logo_20211127.png`;
        break
      case 'SVW-Audi-Joiner':
        myCarLogo = `${this.getStaticUrl()}/build/assets/images/logo_20211127.png`;
        break
      case 'FVW-Joiner':
        myCarLogo = `${this.getStaticUrl()}/build/assets/images/vw_logo.png`;
        break
      case 'SVW-Joiner':
        myCarLogo = `${this.getStaticUrl()}/build/assets/images/vw_logo.png`;
        break
      case 'DFPV-Joiner':
        myCarLogo = `${this.getStaticUrl()}/build/assets/images/dfpv_logo.png`;
        break
    }
    return myCarLogo
  }

  /**
   * 设置 logo 高宽
   * @returns {Size}
   */
  getLogoSize() {
    let size = new Size(0, 0);
    const scriptName = this.appSettings['scriptName'];
    switch (scriptName) {
      case 'FVW-Audi-Joiner':
        size = new Size(60, 20);
        break
      case 'SVW-Audi-Joiner':
        size = new Size(60, 20);
        break
      case 'FVW-Joiner':
        size = new Size(20, 20);
        break
      case 'SVW-Joiner':
        size = new Size(20, 20);
        break
      case 'DFPV-Joiner':
        size = new Size(60, 20);
        break
    }
    return size
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
   * 设置引用组件
   * @return {Promise<void>}
   */
  async setParentSettings() {
    const alert = new Alert();
    alert.title = '设置引用组件';
    alert.message = '请选择您要引用的组件';

    const menuList = [
      {
        name: 'FVW-Audi-Joiner',
        text: '一汽奥迪'
      },
      {
        name: 'SVW-Audi-Joiner',
        text: '上汽奥迪'
      },
      {
        name: 'FVW-Joiner',
        text: '一汽大众'
      },
      {
        name: 'SVW-Joiner',
        text: '上汽大众'
      },
      {
        name: 'DFPV-Joiner',
        text: '东风风神'
      },
      {
        name: 'Comfort-Joiner',
        text: '体验版'
      }
    ];
    menuList.forEach(item => {
      alert.addAction(item.text);
    });
    const menuId = await alert.presentSheet();

    this.settings['parentSettings'] = menuList[menuId].name;
    await this.saveSettings();
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
    ];

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text);
    });

    alert.addCancelAction('取消设置');
    const id = await alert.presentSheet();
    if (id === -1) return
    await this[menuList[id].name]();
  }

  /**
   * 自定义车辆名称
   * @returns {Promise<void>}
   */
  async setMyCarName() {
    const alert = new Alert();
    alert.title = '车辆名称';
    alert.message = '如果您不喜欢系统返回的名称可以自己定义名称';
    alert.addTextField('请输入自定义名称', this.settings['myCarName'] || this.appSettings['myCarName']);
    alert.addAction('确定');
    alert.addCancelAction('取消');

    const id = await alert.presentAlert();
    if (id === -1) return await this.actionPreferenceSettings()
    this.settings['myCarName'] = alert.textFieldValue(0) || this.appSettings['myCarName'];
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
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 设置组件语言
   * @returns {Promise<void>}
   */
  async setWidgetLang() {
    const alert = new Alert();
    alert.title = '组件展示语言';
    alert.message = '根据语言习惯设置组件语言';
    alert.addAction('英文');
    alert.addCancelAction('中文');

    const id = await alert.presentAlert();
    if (id === -1) {
      this.settings['widgetLang'] = 'Chinese';
      await this.saveSettings();
      return await this.actionPreferenceSettings()
    }
    this.settings['widgetLang'] = 'English';
    await this.saveSettings();
    return await this.actionPreferenceSettings()
  }

  /**
   * 检查更新
   */
  async actionCheckUpdate() {
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
    const request = new Request(`${this.getStaticUrl()}/build/simple-theme.json`);
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
    FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), '简约风格.js'), REMOTE_RES);

    await this.notify('Audi 桌面组件主题更新完毕！');
  }

  /**
   * 预览组件
   * @returns {Promise<void>}
   */
  async actionTriggerPreview() {
    await this.actionPreview(Widget);
  }

  /**
   * 固定模板 - 简约风格图片路径
   * @param name
   * @return {string}
   */
  simpleTemplatePath(name) {
    return `${this.getStaticUrl()}/build/assets/simple/${name}.png`
  }

  /**
   * 危险色调
   * @param alpha
   * @returns {Color}
   */
  dangerColor = (alpha = 1) => new Color('#F56C6C', alpha)
}

// @组件代码结束
await Running(Widget);
