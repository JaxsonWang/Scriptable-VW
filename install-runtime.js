const alert = new Alert()
alert.title = '大众集团 iOS 桌面挂件下载器'
alert.message = '根据您的对应车企进行下载对应的脚本'
const menuList = [
  {
    name: 'FVW-Audi-Joiner.js',
    text: '一汽奥迪'
  },
  {
    name: 'FVW-Joiner.js',
    text: '一汽大众'
  },
  {
    name: 'Comfort-Joiner.js',
    text: '体验版'
  }
]
menuList.forEach(item => {
  alert.addAction(item.text)
})
const menuId = await alert.presentSheet()
const obj = menuList[menuId]
const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
let REQ = new Request(`https://gitlab.com/JaxsonWang/Scriptable-VW/-/raw/master/build/${encodeURIComponent(obj.name)}`)
const RES = await REQ.load()
FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), obj.name), RES)
FILE_MGR.remove(module.filename)
Safari.open('scriptable:///run?scriptName='+encodeURIComponent(obj.name[0]))
