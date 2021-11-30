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
const AUDI_VERSION = 1.3
const DEFAULT_LIGHT_BACKGROUND_COLOR_1 = '#FFFFFF'
const DEFAULT_LIGHT_BACKGROUND_COLOR_2 = '#B2D4EC'
const DEFAULT_DARK_BACKGROUND_COLOR_1 = '#404040'
const DEFAULT_DARK_BACKGROUND_COLOR_2 = '#1E1E1E'

const AUDI_SERVER_API = {
  login: 'https://audi2c.faw-vw.com/capi/v1/user/login',
  token: 'https://mbboauth-1d.prd.cn.vwg-connect.cn/mbbcoauth/mobile/oauth2/v1/token',
  mine: 'https://audi2c.faw-vw.com/capi/v1/user/mine',
  mal1aVehiclesStatus: vin => `https://mal-1a.prd.cn.vwg-connect.cn/api/bs/vsr/v1/vehicles/${vin}/status`,
  mal1aVehiclesPosition: vin => `https://mal-1a.prd.cn.vwg-connect.cn/api/bs/cf/v1/vehicles/${vin}/position`,
  mal3aVehiclesStatus: vin => `https://mal-3a.prd.cn.dp.vwg-connect.cn/api/bs/vsr/v1/vehicles/${vin}/status`,
  mal3aVehiclesPosition: vin => `https://mal-3a.prd.cn.dp.vwg-connect.cn/api/bs/cf/v1/vehicles/${vin}/position`,
  vehicleServer: (appKey,nonce,sign, signt) => `https://audioneapp.faw-vw.com:443/v2/audi-vehicle-server/public/vehicleServer/queryDefaultVehicleDetails?appkey=${appKey}&nonce=${nonce}&sign=${sign}&signt=${signt}`
  
}
const SIGN_SERVER_API = {
  sign: 'https://api.zhous.cloud/audiServer/signature/getSignature'
}
const REQUEST_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'MyAuDi/3.0.2 CFNetwork/1325.0.1 Darwin/21.1.0',
  'X-Client-ID': 'de6d8b23-792f-47b8-82f4-e4cc59c2916e'
}
const DEFAULT_MY_CAR_PHOTO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/cars/2020A4LB9_20211127.png'
const DEFAULT_AUDI_LOGO = 'https://gitee.com/JaxsonWang/scriptable-audi/raw/master/assets/images/logo_20211127.png'
const GLOBAL_USER_DATA = {
  seriesName: '奥迪A4L B9',
  modelShortName: '2.0 140KW',
  vin: '',
  engineNo: '',
  plateNo: '', // 车牌号
  endurance: 0, // NEDC 续航
  fuelLevel: 0, // 汽油 单位百分比
  mileage: 0, // 总里程
  carLocation: '',
  longitude: '',
  latitude: '',
  status: true, // 0 = 已锁车
  doorAndWindow: '', // 门窗状态
  myOne: '世间美好，与你环环相扣'
}
const AUDI_AMAP_KEY = 'c078fb16379c25bc0aad8633d82cf1dd'

class Widget extends Base {
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor(arg) {
    super(arg)
    this.name = 'Audi 挂件'
    this.desc = 'Audi 车辆桌面组件展示'

    if (config.runsInApp) {
      this.registerAction('账户登录', this.actionStatementSettings)
      this.registerAction('个性化配置', this.actionPreferenceSettings)
      this.registerAction('兼容设置', this.actionCompatible)
      this.registerAction('退出登录', this.actionLogOut)
      this.registerAction('重载数据', this.actionLogAction)
      this.registerAction('检查更新', this.actionCheckUpdate)
      this.registerAction('打赏作者', this.actionDonation)
      this.registerAction('当前版本: v' + AUDI_VERSION, this.actionAbout)
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
    widget.backgroundGradient = this.getBackgroundColor()

    widget.addSpacer(20)

    const header = widget.addStack()
    header.centerAlignContent()

    const _title = header.addText(data.seriesName)
    _title.textOpacity = 1
    _title.font = Font.systemFont(18)
    _title.textColor = this.dynamicFontColor()
    // const _icon = header.addImage(await this.getImageByUrl(data.logo))
    // _icon.imageSize = new Size(30, 30)
    // _icon.rightAlignImage()

    widget.addSpacer(0)

    const content = widget.addStack()
    content.bottomAlignContent()
    const _fuelStroke = content.addText(data.endurance + 'km')
    _fuelStroke.font = Font.heavySystemFont(20)
    _fuelStroke.textColor = this.dynamicFontColor()
    content.addSpacer(2)
    const _cut = content.addText('/')
    _cut.font = Font.systemFont(16)
    _cut.textOpacity = 0.75
    _cut.textColor = this.dynamicFontColor()
    content.addSpacer(2)
    const _fuelLevel = content.addText(data.fuelLevel + '%')
    _fuelLevel.font = Font.systemFont(16)
    _fuelLevel.textOpacity = 0.75
    _fuelLevel.textColor = this.dynamicFontColor()

    widget.addSpacer(10)

    const _audiImage = widget.addImage(await this.getMyCarPhoto())
    _audiImage.imageSize = new Size(100, 80)
    _audiImage.rightAlignImage()
    return widget
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium(data) {
    const widget = new ListWidget()
    widget.backgroundGradient = this.getBackgroundColor()

    // 宽度
    const widgetWidth = Device.screenResolution().width / Device.screenScale()
    const screenSize = Device.screenSize().width
    // 解决 1080 分辨率显示的问题
    const widthInterval = widgetWidth - screenSize <= 0 ? 40 : widgetWidth - screenSize + 10
    const width = widgetWidth / 2 - widthInterval

    // 添加 Audi Stack
    const logoStack = widget.addStack()
    logoStack.size = new Size(widgetWidth, logoStack.size.height)
    logoStack.addSpacer(width * 2 - 50) // 使图片顶到右边显示
    // 添加 Audi Logo
    const _audiLogo = logoStack.addImage(await this.getImageByUrl(DEFAULT_AUDI_LOGO))
    _audiLogo.imageSize = new Size(50, 15)


    const stack = widget.addStack()
    stack.size = new Size(widgetWidth, stack.size.height)

    // region leftStack start
    const leftStack = stack.addStack()
    leftStack.size = new Size(width, leftStack.size.height)
    leftStack.layoutVertically()

    const _title = leftStack.addText(data.seriesName)
    _title.textOpacity = 1
    _title.textColor = this.dynamicFontColor()
    _title.font = Font.systemFont(18)
    leftStack.addSpacer(2)
    const _desc = leftStack.addText(data.modelShortName)
    _desc.textOpacity = 0.75
    _desc.textColor = this.dynamicFontColor()
    _desc.font = Font.systemFont(14)
    leftStack.addSpacer(10)
    const content = leftStack.addStack()
    content.bottomAlignContent()
    const _fuelStroke = content.addText(data.endurance + 'km')
    _fuelStroke.font = Font.heavySystemFont(20)
    _fuelStroke.textColor = this.dynamicFontColor()
    content.addSpacer(2)
    const _cut = content.addText('/')
    _cut.font = Font.systemFont(16)
    _cut.textOpacity = 0.75
    _cut.textColor = this.dynamicFontColor()
    content.addSpacer(2)
    const _fuelLevel = content.addText(data.fuelLevel + '%')
    _fuelLevel.font = Font.systemFont(16)
    _fuelLevel.textOpacity = 0.75
    _fuelLevel.textColor = this.dynamicFontColor()
    // 总行程
    const _trips = leftStack.addText('总里程: ' + data.mileage + ' km')
    _trips.textOpacity = 0.75
    _trips.font = Font.systemFont(14)
    _trips.textColor = this.dynamicFontColor()

    // 根据选项是否开启位置显示
    if (this.showLocation()) {
      const carLocation = data.carLocation
      this.splitStr2Arr(carLocation, 14).forEach(item => {
        const _location = leftStack.addText(item)
        _location.textOpacity = 0.75
        _location.textColor = this.dynamicFontColor()
        _location.font = Font.systemFont(12)
      })
    }
    // endregion leftStack end

    // region rightStack start
    const rightStack = stack.addStack()
    rightStack.size = new Size(width, rightStack.size.height)
    rightStack.layoutVertically()

    const audiStack = rightStack.addStack()
    audiStack.setPadding(20, 0, 10, 0)

    const _audiImage = audiStack.addImage(await this.getMyCarPhoto())
    _audiImage.imageSize = new Size(rightStack.size.width, 60)
    _audiImage.applyFillingContentMode()

    const rightBottomStack = rightStack.addStack()
    rightBottomStack.size = new Size(rightStack.size.width, 15)
    // 车辆状态
    let getCarStatus = data.status ? '已锁车' : '未锁车'
    data.doorAndWindow ? getCarStatus += '并且门窗已关闭' : getCarStatus = '请检查车窗是否已关闭'
    const _audiStatus = rightBottomStack.addText(getCarStatus)
    _audiStatus.font = Font.systemFont(12)
    if (!data.status || !data.doorAndWindow) {
      _audiStatus.textColor = new Color('#FF9900', 1)
    } else {
      _audiStatus.textColor = this.dynamicFontColor()
    }

    // endregion

    // 祝语
    widget.addSpacer(5)
    const tipStack = widget.addStack()
    tipStack.size = new Size(widgetWidth, tipStack.size.height)

    const _tips = tipStack.addText(data.myOne)
    _tips.textOpacity = 1
    _tips.font = Font.systemFont(12)
    _tips.textColor = this.dynamicFontColor()
    _tips.centerAlignText()

    // debug
    // stack.backgroundColor = Color.green()
    // logoStack.backgroundColor = Color.blue()
    // leftStack.backgroundColor = Color.gray()
    // rightStack.backgroundColor = Color.gray()
    // audiStack.backgroundColor = Color.brown()
    // rightBottomStack.backgroundColor = Color.lightGray()
    // tipStack.backgroundColor = Color.brown()

    return widget
  }

  /**
   * 渲染大尺寸组件
   */
  async renderLarge(data) {
    const widget = new ListWidget()

    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO))

    const text = widget.addText('靓仔，还不支持大组件，等耐心等待作者开发！')
    text.font = Font.blackSystemFont(15)
    text.textColor = this.dynamicFontColor()
    text.centerAlignText()

    return widget
  }

  /**
   * 渲染空数据组件
   * @returns {Promise<ListWidget>}
   */
  async renderEmpty() {
    const widget = new ListWidget()

    widget.backgroundImage = await this.shadowImage(await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO))
    // widget.backgroundImage = await this.shadowImage(Image.fromFile(this.settings['myCarPhoto']))

    const text = widget.addText('欢迎使用 Audi-Joiner iOS 桌面组件')
    text.font = Font.blackSystemFont(18)
    text.textColor = this.dynamicFontColor()
    text.centerAlignText()

    return widget
  }

  /**
   * 渲染标题内容
   * @param {object} widget 组件对象
   * @param {string} icon 图标地址
   * @param {string} title 标题内容
   * @param {boolean|string} color 字体的颜色（自定义背景时使用，默认系统）
   */
  async renderHeaderOverload(widget, icon, title, color = false) {
    widget.addSpacer(10)
    let header = widget.addStack()
    header.centerAlignContent()
    let _icon = header.addImage(await this.getImageByUrl(icon))
    _icon.imageSize = new Size(80, 40)
    _icon.cornerRadius = 4
    header.addSpacer(10)
    let _title = header.addText(title)
    if (color) _title.textColor = color
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(12)
    widget.addSpacer(10)
    return widget
  }

  /**
   * 渐变色
   * @returns {LinearGradient}
   */
  getBackgroundColor() {
    const bgColor = new LinearGradient()

    const lightBgColor1 = this.settings['lightBgColor1'] ? this.settings['lightBgColor1'] : DEFAULT_LIGHT_BACKGROUND_COLOR_1
    const lightBgColor2 = this.settings['lightBgColor2'] ? this.settings['lightBgColor2'] : DEFAULT_LIGHT_BACKGROUND_COLOR_2
    const darkBgColor1 = this.settings['darkBgColor1'] ? this.settings['darkBgColor1'] : DEFAULT_DARK_BACKGROUND_COLOR_1
    const darkBgColor2 = this.settings['darkBgColor2'] ? this.settings['darkBgColor2'] : DEFAULT_DARK_BACKGROUND_COLOR_2

    const startColor = Color.dynamic(new Color(lightBgColor1, 1), new Color(darkBgColor1, 1))
    const endColor = Color.dynamic(new Color(lightBgColor2, 1), new Color(darkBgColor2, 1))

    bgColor.colors = [startColor, endColor]

    bgColor.locations = [0.0, 1.0]

    return bgColor
  }

  /**
   * 处理数据业务
   * @returns {Promise<{Object}>}
   */
  async bootstrap() {
    const getUserMineData = JSON.parse(Keychain.get('userMineData'))
    const getVehicleData = getUserMineData.vehicleDto

    GLOBAL_USER_DATA.seriesName = this.settings['myCarName'] ? this.settings['myCarName'] : getVehicleData?.seriesName
    if (getVehicleData.carModelName) GLOBAL_USER_DATA.modelShortName = getVehicleData?.carModelName // 车辆功率类型
    if (getVehicleData.vin) GLOBAL_USER_DATA.vin = getVehicleData?.vin // 车架号
    if (getVehicleData.engineNo) GLOBAL_USER_DATA.engineNo = getVehicleData?.engineNo // 发动机型号
    if (getVehicleData.plateNo) GLOBAL_USER_DATA.plateNo = getVehicleData?.plateNo // 车牌号

    const getVehiclesStatus = await this.handleVehiclesStatus()
    const getVehicleResponseData = getVehiclesStatus?.StoredVehicleDataResponse?.vehicleData?.data
    const getVehiclesStatusArr = getVehicleResponseData ? getVehicleResponseData : []

    // 是否开启位置
    if (this.showLocation()) {
      try {
        const getVehiclesPosition = JSON.parse(await this.handleVehiclesPosition())
        const getVehiclesAddress = await this.handleGetCarAddress()
        if (getVehiclesPosition.longitude) GLOBAL_USER_DATA.longitude = getVehiclesPosition.longitude // 车辆经度
        if (getVehiclesPosition.latitude) GLOBAL_USER_DATA.latitude = getVehiclesPosition.latitude // 车辆纬度
        if (getVehiclesAddress) GLOBAL_USER_DATA.carLocation = getVehiclesAddress // 详细地理位置
      } catch (error) {
        const alert = new Alert()
        alert.title = 'Audi Joiner 提示'
        alert.message = '获取车辆位置失败，请确保您的车辆支持定位功能！' + error
        alert.addCancelAction('关闭')
      }
    }

    const getCarStatusArr = getVehiclesStatusArr.find(i => i.id === '0x0301FFFFFF')?.field
    const enduranceVal = getCarStatusArr.find(i => i.id === '0x0301030005')?.value // 燃料总行程
    // todo 电车燃料改成电量 字段 0301030002
    const fuelLevelVal = getCarStatusArr.find(i => i.id === '0301030002')?.value ? getCarStatusArr.find(i => i.id === '0301030002')?.value : getCarStatusArr.find(i => i.id === '0x030103000A')?.value // 燃料百分比
    const mileageVal = getVehiclesStatusArr.find(i => i.id === '0x0101010002')?.field[0]?.value // 总里程

    // 检查门锁 车门 车窗等状态
    const isLocked = await this.getCarIsLocked(getCarStatusArr)
    const doorStatusArr = await this.getCarDoorStatus(getCarStatusArr)
    const windowStatusArr = await this.getCarWindowStatus(getCarStatusArr)
    const equipmentStatusArr = [...doorStatusArr, ...windowStatusArr].map(i => i.name)
    // 写入信息
    if (enduranceVal) GLOBAL_USER_DATA.endurance = enduranceVal // NEDC 续航 单位 km
    if (fuelLevelVal) GLOBAL_USER_DATA.fuelLevel = fuelLevelVal // 燃料 单位百分比
    if (mileageVal) GLOBAL_USER_DATA.mileage = mileageVal // 总里程
    if (isLocked) GLOBAL_USER_DATA.status = isLocked // 车辆状态 true = 已锁车
    if (equipmentStatusArr) GLOBAL_USER_DATA.doorAndWindow = equipmentStatusArr.length === 0 // true 车窗已关闭 | false 请检查车窗是否关闭
    if (this.settings['myOne']) GLOBAL_USER_DATA.myOne = this.settings['myOne'] // 一言

    return GLOBAL_USER_DATA
  }

  /**
   * 获取数据
   */
  async getData() {
    // 判断用户是否已经登录
    return Keychain.contains('userBaseInfoData') ? await this.bootstrap() : false
  }

  /**
   * 获取车辆锁车状态
   * @param {Array} arr
   * @return Promise<{boolean}> true = 锁车 false = 没有完全锁车
   */
  async getCarIsLocked (arr) {
    // 先判断车辆是否锁定
    const lockArr = ['0x0301040001', '0x0301040004', '0x0301040007', '0x030104000A', '0x030104000D']
    // 筛选出对应的数组
    const filterArr = arr.filter(item => lockArr.some(i => i === item.id))
    // 判断是否都锁门
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
  async getCarDoorStatus (arr) {
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
    const result = filterArr.filter(item => item.value === '2')
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
  async getCarWindowStatus (arr) {
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
    const result = filterArr.filter(item => item.value === '2')
    // 返回开门的数组
    return windowArr.filter(i => result.some(x => x.id === i.id))
  }

  /**
   * 获取用户车辆照片
   * @returns {Promise<Image|*>}
   */
  async getMyCarPhoto() {
    let myCarPhoto = await this.getImageByUrl(DEFAULT_MY_CAR_PHOTO)
    // if (this.settings['myCarPhoto']) myCarPhoto = await Image.fromFile(this.settings['myCarPhoto'])
    if (this.settings['myCarPhoto']) myCarPhoto = await Image.fromData(Data.fromBase64String(this.settings['myCarPhoto']))
    return myCarPhoto
  }

  /**
   * 登录奥迪服务器
   * @param {boolean} isDebug
   * @returns {Promise<void>}
   */
  async handleAudiLogin(isDebug = false) {
    if (!Keychain.contains('userBaseInfoData')) {
      const options = {
        url: AUDI_SERVER_API.login,
        method: 'POST',
        headers: REQUEST_HEADER,
        body: JSON.stringify({
          loginChannelEnum: 'APP',
          loginTypeEnum: 'ACCOUNT_PASSWORD',
          account: this.settings['username'],
          password: this.settings['password']
        })
      }
      const response = await this.http(options)
      if (isDebug) console.log('获取登陆信息:')
      if (isDebug) console.log(response)
      // 判断接口状态
      if (response.code === 0) {
        // 登录成功 存储登录信息
        console.log('登陆成功')
        Keychain.set('userBaseInfoData', JSON.stringify(response.data))
        await this.notify('登录成功', '正在从 Audi 服务器获取车辆数据，请耐心等待！')
        // 准备交换验证密钥数据
        await this.handleAudiGetToken('userIDToken')
        await this.handleUserMineData()
      } else {
        // 登录异常
        await this.notify('登录失败', response.message)
        console.error('用户登录失败：' + response.message)
      }
    } else {
      // 已存在用户信息
      if (isDebug) console.log('检测本地缓存已有登陆数据:')
      if (isDebug) console.log(Keychain.get('userBaseInfoData'))
      await this.handleAudiGetToken('userIDToken')
      await this.handleUserMineData()
    }
  }

  /**
   * 获取车辆基本信息
   * 该接口因为加密问题暂时放弃
   * @returns {Promise<void>}
   */
   async handleQueryDefaultVehicleData() {
    if (!Keychain.contains('defaultVehicleData')) {
      if (!Keychain.contains('userBaseInfoData')) {
        return console.error('获取密钥数据失败，没有拿到用户登录信息，请重新登录再重试！')
      }
      const getUserBaseInfoData =JSON.parse(Keychain.get('userBaseInfoData'))
      //服务器获取签名
      const signOptions = {
        url: SIGN_SERVER_API.sign,
        method: 'POST',
        headers: {
          ...{
            Platform : "1"
          },
          ...REQUEST_HEADER
        }
      }
      const signatureREesponse = await this.http(signOptions)
      if (signatureREesponse.code !== 0){
        return console.error(signatureREesponse.data)
      } else{
        const data = signatureREesponse.data
        const options = {
          url: AUDI_SERVER_API.vehicleServer(data.appkey, data.nonce, data.sign, data.signt),
          method: 'GET',
          headers: {
            ...{
              token: 'Bearer ' + getUserBaseInfoData.accessToken
            },
            ...REQUEST_HEADER
          }
        }
        const response = await this.http(options)
        // 判断接口状态
        if (response.status === 'SUCCEED') {
          // 存储车辆信息
          console.log(response)
          // Keychain.set('defaultVehicleData', JSON.stringify(response.data))
          // Keychain.set('myCarVIN', response.data?.vin)
          console.log('车辆基本信息获取成功')
          // 准备交换验证密钥数据
          await this.handleAudiGetToken('userRefreshToken')
        } else {
          // 获取异常
          await console.error('车辆信息获取失败，请稍后重新登录再重试！')
        }
      }
    }
  }

  /**
   * 获取用户信息
   * @param {boolean} isDebug
   * @returns {Promise<void>}
   */
  async handleUserMineData(isDebug = false) {
    if (!Keychain.contains('userMineData')) {
      if (!Keychain.contains('userBaseInfoData')) {
        return console.error('获取密钥数据失败，没有拿到用户登录信息，请重新登录再重试！')
      }
      const getUserBaseInfoData =JSON.parse(Keychain.get('userBaseInfoData'))
      const options = {
        url: AUDI_SERVER_API.mine,
        method: 'GET',
        headers: {
          ...{
            'X-ACCESS-TOKEN': getUserBaseInfoData.accessToken
          },
          ...REQUEST_HEADER
        }
      }
      const response = await this.http(options)
      if (isDebug) console.log('获取用户信息：')
      if (isDebug) console.log(response)
      // 判断接口状态
      if (response.code === 0) {
        // 存储车辆信息
        console.log('用户基本信息获取成功')
        Keychain.set('userMineData', JSON.stringify(response.data))
        Keychain.set('myCarVIN', response.data?.vehicleDto?.vin)
        // 准备交换验证密钥数据
        await this.handleAudiGetToken('userRefreshToken')
      } else {
        // 获取异常
        console.error('个人信息获取失败，请稍后重新登录再重试！')
      }
    } else {
      console.log('userMineData 信息已存在，开始获取 userRefreshToken')
      if (isDebug) console.log(Keychain.get('userMineData'))
      await this.handleAudiGetToken('userRefreshToken')
    }
  }

  /**
   * 获取密钥数据
   * @param {'userIDToken' | 'userRefreshToken'} type
   * @param {boolean} forceRefresh
   * @returns {Promise<void>}
   */
  async handleAudiGetToken(type, forceRefresh = false) {
    if (forceRefresh || !Keychain.contains(type)) {
      if (type === 'userIDToken' && !Keychain.contains('userBaseInfoData')) {
        return console.error('获取密钥数据失败，没有拿到用户登录信息，请重新登录再重试！')
      }
      if (type === 'userRefreshToken' && !Keychain.contains('userIDToken')) {
        return console.error('获取密钥数据失败，没有拿到用户 ID Token，请重新登录再重试！')
      }

      // 根据交换token请求参数不同
      let requestParams = ''
      const getUserBaseInfoData =JSON.parse(Keychain.get('userBaseInfoData'))
      if (type === 'userIDToken') {
        requestParams = `grant_type=${encodeURIComponent('id_token')}&token=${encodeURIComponent(getUserBaseInfoData.idToken)}&scope=${encodeURIComponent('sc2:fal')}`
      } else if (type === 'userRefreshToken') {
        const getUserIDToken =JSON.parse(Keychain.get('userIDToken'))
        requestParams = `grant_type=${encodeURIComponent('refresh_token')}&token=${encodeURIComponent(getUserIDToken.refresh_token)}&scope=${encodeURIComponent('sc2:fal')}&vin=${Keychain.get('myCarVIN')}`
      }

      const options = {
        url: AUDI_SERVER_API.token,
        method: 'POST',
        headers: {
          'X-Client-ID': 'de6d8b23-792f-47b8-82f4-e4cc59c2916e',
          'User-Agent': 'MyAuDi/3.0.2 CFNetwork/1325.0.1 Darwin/21.1.0',
        },
        body: requestParams
      }
      const response = await this.http(options)
      // 判断接口状态
      if (response.error) {
        switch (response.error) {
          case 'invalid_grant':
            console.error('IDToken 数据过期，正在重新获取数据中，请耐心等待...')
            await this.handleAudiGetToken('userIDToken', true)
            break
        }
      } else {
        // 获取密钥数据成功，存储数据
        Keychain.set(type, JSON.stringify(response))
        console.log('当前密钥数据获取成功：' + type)
        if (type === 'userRefreshToken') {
          Keychain.set('authToken', response.access_token)
          console.log('authToken 密钥设置成功')
          // 正式获取车辆信息
          await this.bootstrap()
        }
      }
    } else {
      // 已存在的时候
      console.log(type + ' 信息已存在，开始 bootstrap() 函数')
      if (type === 'userRefreshToken') await this.bootstrap()
    }
  }

  /**
   * 获取车辆当前状态
   * 需要实时获取
   * @param {boolean} isDebug
   * @returns {Promise<string | void>}
   */
  async handleVehiclesStatus(isDebug = false) {
    if (!Keychain.contains('authToken')) {
      return console.error('获取 authToken 密钥失败，请退出登录再登录重试！')
    }
    if (!Keychain.contains('myCarVIN')) {
      return console.error('获取 myCarVIN 数据失败，请退出登录再登录重试！')
    }

    let url = AUDI_SERVER_API.mal1aVehiclesStatus
    switch (this.settings['compatibilityMode']) {
      case 'standard':
        url = AUDI_SERVER_API.mal1aVehiclesStatus
        break
      case 'compatible':
        url = AUDI_SERVER_API.mal3aVehiclesStatus
        break
    }

    const options = {
      url: url(Keychain.get('myCarVIN')),
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + Keychain.get('authToken'),
          'X-App-Name': 'MyAuDi',
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...REQUEST_HEADER
      }
    }
    const response = await this.http(options)
    if (isDebug) console.log('获取车辆状态信息：')
    if (isDebug) console.log(response)
    // 判断接口状态
    if (response.error) {
      // 接口异常
      console.error('vehiclesStatus 接口异常' + response.error.errorCode + ' - ' + response.error.description)
      switch (response.error.errorCode) {
        case 'gw.error.authentication':
          console.error('获取车辆状态失败 error: ' + response.error.errorCode)
          await this.handleAudiGetToken('userRefreshToken', true)
          await this.handleVehiclesStatus()
          break
        case 'mbbc.rolesandrights.unauthorized':
          const alert = new Alert()
          alert.title = 'Audi Joiner 提示'
          alert.message = '请检查您的车辆是否已经开启车联网服务，请到一汽奥迪应用查看！'
          alert.addCancelAction('关闭')
          break
        case 'mbbc.rolesandrights.unknownService':
          break
        default:
          await this.notify('未知错误', '未知错误:' + response.error.description)
      }
      if (Keychain.contains('vehiclesStatusResponse')) {
        return JSON.parse(Keychain.get('vehiclesStatusResponse'))
      }
    } else {
      // 接口获取数据成功
      Keychain.set('vehiclesStatusResponse', JSON.stringify(response))
      return response
    }
  }

  /**
   * 获取车辆当前经纬度
   * 需要实时获取
   * @param {boolean} isDebug
   * @returns {Promise<string>}
   */
  async handleVehiclesPosition(isDebug = false) {
    if (!Keychain.contains('authToken')) {
      console.error('获取 authToken 密钥失败，请退出登录再登录重试！')
      return Keychain.get('carPosition')
    }
    if (!Keychain.contains('myCarVIN')) {
      await console.error('获取 myCarVIN 数据失败，请退出登录再登录重试！')
      return Keychain.get('carPosition')
    }

    let url = AUDI_SERVER_API.mal1aVehiclesPosition
    switch (this.settings['compatibilityMode']) {
      case 'standard':
        url = AUDI_SERVER_API.mal1aVehiclesPosition
        break
      case 'compatible':
        url = AUDI_SERVER_API.mal3aVehiclesPosition
        break
    }

    const options = {
      url: url(Keychain.get('myCarVIN')),
      method: 'GET',
      headers: {
        ...{
          'Authorization': 'Bearer ' + Keychain.get('authToken'),
          'X-App-Name': 'MyAuDi',
          'X-App-Version': '113',
          'Accept-Language': 'de-DE'
        },
        ...REQUEST_HEADER
      }
    }
    try {
      const response = await this.http(options)
      if (isDebug) console.log('获取车辆位置信息：')
      if (isDebug) console.log(response)
      // 判断接口状态
      if (response.error) {
        // 接口异常
        console.error('vehiclesPosition 接口异常' + response.error.errorCode + ' - ' + response.error.description)
        switch (response.error.errorCode) {
          case 'gw.error.authentication':
            console.error('获取车辆位置失败 error: ' + response.error.errorCode)
            await this.handleAudiGetToken('userRefreshToken', true)
            await this.handleVehiclesPosition()
            break
        }
      } else {
        // 接口获取数据成功储存接口数据
        if (response.storedPositionResponse) {
          Keychain.set('storedPositionResponse', JSON.stringify(response))
          Keychain.set('carPosition', JSON.stringify({
            longitude: response.storedPositionResponse.position.carCoordinate.longitude,
            latitude: response.storedPositionResponse.position.carCoordinate.latitude
          }))
        } else if (response.findCarResponse) {
          Keychain.set('findCarResponse', JSON.stringify(response))
          Keychain.set('carPosition', JSON.stringify({
            longitude: response.findCarResponse.Position.carCoordinate.longitude,
            latitude: response.findCarResponse.Position.carCoordinate.latitude
          }))
        }
        return Keychain.get('carPosition')
      }
    } catch (error) {
      console.error('vehiclesPosition 接口捕获异常：' + error)
      // 如果出现异常说明 当前车辆处于运行状态或者车辆没有上传位置信息
      if (Keychain.contains('carPosition')) {
        return Keychain.get('carPosition')
      } else {
        return JSON.stringify({
          longitude: -1,
          latitude: -1
        })
      }
    }
  }

  /**
   * 获取车辆地址
   * @returns {Promise<string>}
   */
  async handleGetCarAddress() {
    if (!Keychain.contains('storedPositionResponse') && !Keychain.contains('carPosition')) {
      await console.error('获取车辆经纬度失败，请退出登录再登录重试！')
      return '暂无位置信息'
    }
    const carPosition = JSON.parse(Keychain.get('carPosition'))
    const longitude = parseInt(carPosition.longitude, 10) / 1000000
    const latitude = parseInt(carPosition.latitude, 10) / 1000000

    // longitude latitude 可能会返回负数的问题
    // 直接返回缓存数据
    if (longitude < 0 || latitude < 0) return '暂无位置信息'

    const aMapKey = this.settings['aMapKey'] ? this.settings['aMapKey'] : AUDI_AMAP_KEY
    const options = {
      url: `https://restapi.amap.com/v3/geocode/regeo?key=${aMapKey}&location=${longitude},${latitude}&radius=1000&extensions=base&batch=false&roadlevel=0`,
      method: 'GET'
    }
    const response = await this.http(options)
    if (response.status === '1') {
      // const address = response.regeocode.formatted_address
      const addressComponent = response.regeocode.addressComponent
      const address = addressComponent.city + addressComponent.district + addressComponent.township
      Keychain.set('carAddress', address)
      return address
    } else {
      console.error('获取车辆位置失败，请检查高德地图 key 是否填写正常')
      if (Keychain.contains('carAddress')) {
        return Keychain.get('carAddress')
      } else {
        return '暂无位置信息'
      }
    }
  }

  /**
   * 组件声明
   * @returns {Promise<void>}
   */
  async actionStatementSettings () {
    const alert = new Alert()
    alert.title = '组件声明'
    alert.message = `
    小组件需要使用到您的一汽大众应用的账号，首次登录请配置账号、密码进行令牌获取\n\r
    小组件不会收集您的个人账户信息，所有账号信息将存在 iCloud 或者 iPhone 上但也请您妥善保管自己的账号\n\r
    小组件是开源、并且完全免费的，由奥迪车主开发，所有责任与一汽奥迪公司无关\n\r
    开发者: 淮城一只猫\n\r
    温馨提示：由于一汽奥迪应用支持单点登录，即不支持多终端应用登录，建议在一汽奥迪应用「用车 - 更多功能 - 用户管理」进行添加用户，这样组件和应用独立执行。
    `
    alert.addAction('同意')
    alert.addCancelAction('不同意')
    const id = await alert.presentAlert()
    if (id === -1) return
    await this.actionAccountSettings()
  }

  /**
   * 设置账号数据
   * @returns {Promise<void>}
   */
  async actionAccountSettings() {
    const alert = new Alert()
    alert.title = '一汽奥迪账户登录'
    alert.message = '登录一汽奥迪账号展示车辆数据'
    alert.addTextField('一汽奥迪账号', this.settings['username'])
    alert.addSecureTextField('一汽奥迪密码', this.settings['password'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return
    this.settings['username'] = alert.textFieldValue(0)
    this.settings['password'] = alert.textFieldValue(1)
    this.saveSettings()
    console.log('开始进行用户登录')
    await this.handleAudiLogin()
  }

  /**
   * 个性化配置
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings () {
    const alert = new Alert()
    alert.title = '组件个性化配置'
    alert.message = '根据您的喜好设置，更好展示组件数据'

    const menuList = [
      {
        name: 'myCarName',
        text: '自定义车辆名称',
        icon: '💡'
      }, {
        name: 'myCarPhoto',
        text: '自定义车辆照片',
        icon: '🚙'
      }, {
        name: 'myOne',
        text: '一言',
        icon: '📝'
      }, {
        name: 'lightBgColor',
        text: '系统浅色模式',
        icon: '🌕'
      }, {
        name: 'darkBgColor',
        text: '系统深色模式',
        icon: '🌑'
      }, {
        name: 'aMapKey',
        text: '高德地图密钥',
        icon: '🎯'
      }, {
        name: 'showLocation',
        text: '显示位置',
        icon: '✈️'
      }
    ]

    menuList.forEach(item => {
      alert.addAction(item.icon + ' ' +item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    await this['actionPreferenceSettings' + id]()
  }

  /**
   * 自定义车辆名称
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings0() {
    const alert = new Alert()
    alert.title = '车辆名称'
    alert.message = '如果你不喜欢系统返回的名称可以自己定义名称'
    alert.addTextField('请输入自定义名称', this.settings['myCarName'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    const value = alert.textFieldValue(0)
    if (!value) return await this.actionPreferenceSettings0()

    this.settings['myCarName'] = value
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 使用在线图片服务地址
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings1() {
    const alert = new Alert()
    alert.title = '车辆图片'
    alert.message = '请在相册选择你最喜欢的车辆图片以便展示到小组件上，最好是全透明背景图。'
    // alert.addTextField('请输入地址', this.settings['myCarPhoto'])
    alert.addAction('选择照片')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    // const value = alert.textFieldValue(0)
    // if (!value) {
    //   this.settings['myCarPhoto'] = DEFAULT_MY_CAR_PHOTO
    //   this.saveSettings()
    //   return await this.actionPreferenceSettings()
    // }
    //
    // this.settings['myCarPhoto'] = value
    // this.saveSettings()
    //
    // return await this.actionPreferenceSettings()
    try {
      const image = await Photos.fromLibrary()
      // 缓存选择图片
      // const cacheKey = 'myCarPhoto'
      // const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey)
      // // 存储到缓存
      // FileManager.local().writeImage(cacheFile, image)
      // this.settings['myCarPhoto'] = cacheFile
      // this.saveSettings()
      // 将图片转 raw 数据
      this.settings['myCarPhoto'] = Data.fromPNG(image).toBase64String()

      this.saveSettings()
    } catch (error) {
      // 取消图片会异常 暂时不用管
    }
  }

  /**
   * 输入一言
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings2() {
    const alert = new Alert()
    alert.title = '输入一言'
    alert.message = '请输入一言，将会在桌面展示语句，不填则显示 "世间美好，与你环环相扣"'
    alert.addTextField('请输入一言', this.settings['myOne'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    const value = alert.textFieldValue(0)
    if (!value) {
      this.settings['myOne'] = GLOBAL_USER_DATA.myOne
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }

    this.settings['myOne'] = value
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 浅色模式
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings3() {
    const alert = new Alert()
    alert.title = '浅色模式颜色代码'
    alert.message = '如果都输入相同的颜色代码小组件则是纯色背景色，如果是不同的代码则是渐变背景色，不填写采取默认背景色\n\r' +
      '默认背景颜色代码：' + DEFAULT_LIGHT_BACKGROUND_COLOR_1 + ' 和 ' + DEFAULT_LIGHT_BACKGROUND_COLOR_2 + '\n\r' +
      '默认字体颜色代码：#000000'
    alert.addTextField('背景颜色代码一', this.settings['lightBgColor1'])
    alert.addTextField('背景颜色代码二', this.settings['lightBgColor2'])
    alert.addTextField('字体颜色', this.settings['lightFontColor'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    const lightBgColor1 = alert.textFieldValue(0)
    const lightBgColor2 = alert.textFieldValue(1)
    const lightFontColor = alert.textFieldValue(2)

    this.settings['lightBgColor1'] = lightBgColor1
    this.settings['lightBgColor2'] = lightBgColor2
    this.settings['lightFontColor'] = lightFontColor
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 深色模式
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings4() {
    const alert = new Alert()
    alert.title = '深色模式颜色代码'
    alert.message = '如果都输入相同的颜色代码小组件则是纯色背景色，如果是不同的代码则是渐变背景色，不填写采取默认背景色\n\r' +
      '默认背景颜色代码：' + DEFAULT_DARK_BACKGROUND_COLOR_1 + ' 和 ' + DEFAULT_DARK_BACKGROUND_COLOR_2 + '\n\r' +
      '默认字体颜色代码：#ffffff'
    alert.addTextField('颜色代码一', this.settings['darkBgColor1'])
    alert.addTextField('颜色代码二', this.settings['darkBgColor2'])
    alert.addTextField('字体颜色', this.settings['darkFontColor'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) return await this.actionPreferenceSettings()
    const darkBgColor1 = alert.textFieldValue(0)
    const darkBgColor2 = alert.textFieldValue(1)
    const darkFontColor = alert.textFieldValue(2)

    this.settings['darkBgColor1'] = darkBgColor1
    this.settings['darkBgColor2'] = darkBgColor2
    this.settings['darkFontColor'] = darkFontColor
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 高德地图Key
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings5() {
    const alert = new Alert()
    alert.title = '高德地图密钥'
    alert.message = '请输入组件所需要的高德地图 key 用于车辆逆地理编码以及地图资源\n\r获取途径可以在「关于小组件」菜单里加微信群进行咨询了解'
    alert.addTextField('key 密钥', this.settings['aMapKey'])
    alert.addAction('确定')
    alert.addCancelAction('取消')

    const id = await alert.presentAlert()
    if (id === -1) {
      this.settings['aMapKey'] = AUDI_AMAP_KEY
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    this.settings['aMapKey'] = alert.textFieldValue(0)
    this.saveSettings()

    return await this.actionPreferenceSettings()
  }

  /**
   * 车辆位置显示
   * @returns {Promise<void>}
   */
  async actionPreferenceSettings6() {
    const alert = new Alert()
    alert.title = '是否显示地理位置'
    alert.message = this.showLocation() ? '当前状态已开启' : '当前状态已关闭'
    alert.addAction('开启')
    alert.addCancelAction('关闭')

    const id = await alert.presentAlert()
    if (id === -1) {
      // 关闭显示位置
      this.settings['showLocation'] = false
      this.saveSettings()
      return await this.actionPreferenceSettings()
    }
    // 开启显示位置
    this.settings['showLocation'] = true
    this.saveSettings()
    return await this.actionPreferenceSettings()
  }

  /**
   * 兼容配置
   * @returns {Promise<void>}
   */
  async actionCompatible() {
    const alert = new Alert()
    alert.title = '兼容配置'
    alert.message = '标准模式：支持绝大部分车型\n' +
      '兼容模式：A3、部分A6车型、Q7车主'

    const menuList = [{
      name: 'standard',
      text: '标准模式'
    }, {
      name: 'compatible',
      text: '兼容模式'
    }]

    const mode = this.settings['compatibilityMode'] ? this.settings['compatibilityMode'] : 'standard'
    menuList.forEach(item => {
      alert.addAction(mode === item.name ? '✅' + ' ' + item.text : '❌' + ' ' + item.text)
    })

    alert.addCancelAction('取消设置')
    const id = await alert.presentSheet()
    if (id === -1) return
    this.settings['compatibilityMode'] = menuList[id].name
    this.saveSettings()
  }

  /**
   * 登出系统
   * @returns {Promise<void>}
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
      'userBaseInfoData',
      'defaultVehicleData',
      'userMineData',
      'myCarVIN',
      'authToken',
      'userIDToken',
      'userRefreshToken',
      'storedPositionResponse',
      'findCarResponse',
      'carPosition',
      'carAddress',
      'vehiclesStatusResponse',
      this.SETTING_KEY
    ]
    keys.forEach(key => {
      if (Keychain.contains(key)) {
        Keychain.remove(key)
        console.log(key + ' 缓存信息已删除')
      }
    })
    await this.notify('登出成功', '敏感信息已全部删除')
  }

  /**
   * 点击检查更新操作
   * @returns {Promise<void>}
   */
  async actionCheckUpdate() {
    const UPDATE_FILE = 'Audi-Joiner.js'
    const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    const request = new Request('https://gitee.com/JaxsonWang/scriptable-audi/raw/master/version.json')
    const response = await request.loadJSON()
    console.log(`远程版本：${response?.version}`)
    if (response?.version === AUDI_VERSION) return this.notify('无需更新', '远程版本一致，暂无更新')
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

  async actionDonation() {
    Safari.open( 'https://audi.i95.me/donation.html')
  }

  /**
   * 关于组件
   * @returns {Promise<void>}
   */
  async actionAbout() {
    Safari.open( 'https://audi.i95.me/about.html')
  }

  /**
   * 重载数据
   * @return {Promise<void>}
   */
  async actionLogAction() {
    const alert = new Alert()
    alert.title = '重载数据'
    alert.message = '如果发现数据延迟，选择对应函数获取最新数据，同样也是获取日志分享给开发者使用。'

    const menuList = [{
      name: 'bootstrap',
      text: '静态数据'
    }, {
      name: 'handleAudiLogin',
      text: '登陆数据'
    }, {
      name: 'handleUserMineData',
      text: '用户信息数据'
    }, {
      name: 'handleVehiclesStatus',
      text: '当前车辆状态数据'
    }, {
      name: 'handleVehiclesPosition',
      text: '车辆经纬度数据'
    }, {
      name: 'getDeviceInfo',
      text: '获取设备信息'
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
   * 获取设备信息
   * @return {Promise<void>}
   */
  async getDeviceInfo() {
    const data = {
      systemVersion: Device.model() + ' ' + Device.systemName() + ' ' + Device.systemVersion(), // 系统版本号
      screenSize: Device.screenSize(), // 屏幕尺寸
      screenResolution: Device.screenResolution(), // 屏幕分辨率
      screenScale: Device.screenScale(), // 屏幕比例
      version: AUDI_VERSION // 版本号
    }
    console.log(JSON.stringify(data))
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl(url) {
    await Safari.openInApp(url, false)
  }

  /**
   * 分割字符串
   * @param str
   * @param num
   * @returns {*[]}
   */
  splitStr2Arr(str, num) {
    const strArr = []
    for (let i = 0, l = str.length; i < l / num; i++) {
      const string = str.slice(num * i, num * (i + 1))
      strArr.push(string)
    }

    return strArr
  }

  /**
   * 获取动态字体颜色
   * @return {Color}
   */
  dynamicFontColor() {
    const lightFontColor = this.settings['lightFontColor'] ? this.settings['lightFontColor'] : '#000000'
    const darkFontColor = this.settings['darkFontColor'] ? this.settings['darkFontColor'] : '#ffffff'
    return Color.dynamic(new Color(lightFontColor, 1), new Color(darkFontColor, 1))
  }

  /**
   * 是否开启位置显示
   */
  showLocation() {
    return this.settings['showLocation']
  }
}

// @组件代码结束1
await Testing(Widget)
