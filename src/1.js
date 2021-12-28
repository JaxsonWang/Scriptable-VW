// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
const dailyDataLimit = 3072 //In MB (1GB = 1024 MB) - Manually edit your daily limit.
const widgetBackgroundColor = new Color('#141414') //Grey
const widgetTextColor = new Color('#e6e6e6')
const number = args.widgetParameter


if (config.runsInWidget) {
  let widget = await createWidget()
  Script.setWidget(widget)
  Script.complete()
} else {
  let widget = await createWidget()
  await widget.presentSmall()
}

async function createWidget(){
  const airtelData = await getAirtelData()
  let dailyDataLeft = airtelData.analyticsMetaData.benefitAmount
  let percentageLeft = airtelData.progressValue*100
  let renewsIn = (((new Date().setHours(24,0,0,0) - Date.now()) / 60 / 1000) / 60).toFixed()
  let expiresIn = airtelData.analyticsMetaData.slotDate
  let lastRefresh = getLastRefreshTime()
  let padding = 16

  //Airtel Logo and Header
  const widget = new ListWidget()
  widget.backgroundColor = widgetBackgroundColor
  widget.setPadding(padding, padding, padding, padding)

  let rowLogo = addStackTo(widget, 'h')
  rowLogo.centerAlignContent()
  let airtelLogo = await getAirtelIcon('AirtelLogo.png')
  const airtelLogoImg = rowLogo.addImage(airtelLogo)
  airtelLogoImg.imageSize = new Size(24, 24)
  rowLogo.addSpacer(6)
  let headlineSurroundingStack = addStackTo(rowLogo, 'v')
  const headlineLabel = headlineSurroundingStack.addText("AIRTEL")
  headlineLabel.leftAlignText()
  headlineLabel.font = Font.mediumSystemFont(13)
  headlineLabel.textColor = widgetTextColor
  rowLogo.addSpacer()

  let sfSymbolStack = addStackTo(rowLogo, 'v')
  let sfSymbolName = airtelData.latest ? "wifi" : "wifi.exclamationmark"
  let sfSymbol = SFSymbol.named(sfSymbolName)
  let sfSymbolElement = sfSymbolStack.addImage(sfSymbol.image)
  sfSymbolElement.imageSize = new Size(18, 18)
  sfSymbolElement.tintColor = widgetTextColor
  sfSymbolElement.imageOpacity = 0.8


  widget.addSpacer(4)


  //==================== Percent =========================
  let rowPercentage = addStackTo(widget, 'h')
  rowPercentage.addSpacer()
  const percentText = rowPercentage.addText(percentageLeft.toFixed() + "%")
  percentText.centerAlignText()
  percentText.font = Font.boldSystemFont(26)
  if(percentageLeft.toFixed() <= 20){
    percentText.textColor = new Color('#db0202')
  }else{
    percentText.textColor = widgetTextColor
  }
  rowPercentage.addSpacer()

  widget.addSpacer(4)

  const progressBarStack = widget.addStack()
  progressBarStack.layoutHorizontally()
  progressBarStack.addSpacer()
  const progressBar = progressBarStack.addImage(creatProgress(dailyDataLeft, dailyDataLimit))
  progressBar.imageSize = new Size(120, 4)
  progressBarStack.addSpacer()
  widget.addSpacer()



  // ========================= Data Left ============================
  let rowDataLeft = addStackTo(widget, 'h')

  let rowDataLeftLeft = addStackTo(rowDataLeft, 'v')
  const dataLeftLabel = rowDataLeftLeft.addText("Data")
  dataLeftLabel.leftAlignText()
  dataLeftLabel.font = Font.regularRoundedSystemFont(12)
  dataLeftLabel.textColor = widgetTextColor

  rowDataLeft.addSpacer()

  let rowDataLeftRight = addStackTo(rowDataLeft, 'v')
  const dataLeftText = rowDataLeftRight.addText(formatDataBalance(dailyDataLeft*1024*1024))
  dataLeftText.rightAlignText()
  dataLeftText.font = Font.boldSystemFont(12)
  dataLeftText.textColor = widgetTextColor

  widget.addSpacer(1)

  // ===================== Renews ===========================
  let rowRenews = addStackTo(widget, 'h')

  let rowRenewsLeft = addStackTo(rowRenews, 'v')
  const RenewsLabel = rowRenewsLeft.addText('Renews')
  RenewsLabel.leftAlignText()
  RenewsLabel.font = Font.regularRoundedSystemFont(12)
  RenewsLabel.textColor = widgetTextColor

  rowRenews.addSpacer()

  let rowRenewsRight = addStackTo(rowRenews, 'v')
  const RenewsText = rowRenewsRight.addText(renewsIn + ' Hours')
  RenewsText.rightAlignText()
  RenewsText.font = Font.boldSystemFont(12)
  RenewsText.textColor = widgetTextColor

  widget.addSpacer(1)

  // ===================== Expires ========================
  let rowExpires = addStackTo(widget, 'h')

  let rowExpiresLeft = addStackTo(rowExpires, 'v')
  const ExpiresLabel = rowExpiresLeft.addText("Expires")
  ExpiresLabel.leftAlignText()
  ExpiresLabel.font = Font.regularRoundedSystemFont(12)
  ExpiresLabel.textColor = widgetTextColor

  rowExpires.addSpacer()

  let rowExpiresRight = addStackTo(rowExpires, 'v')
  const ExpiresText = rowExpiresRight.addText(getDaysUntilExpire(expiresIn))
  ExpiresText.rightAlignText()
  ExpiresText.font = Font.boldSystemFont(12)
  ExpiresText.textColor = widgetTextColor
  //
  widget.addSpacer(1)

  //============== Updated ===================
  let rowUpdated = addStackTo(widget, 'h')

  let rowUpdatedLeft = addStackTo(rowUpdated, 'v')
  const updatedLabel = rowUpdatedLeft.addText("Updated")
  updatedLabel.leftAlignText()
  updatedLabel.font = Font.regularRoundedSystemFont(12)
  updatedLabel.textColor = widgetTextColor

  rowUpdated.addSpacer()

  let rowUpdatedRight = addStackTo(rowUpdated, 'v')
  let updatedText = rowUpdatedRight.addDate(new Date())
  updatedText.applyTimerStyle()
  updatedText.rightAlignText()
  updatedText.font = Font.boldSystemFont(12)
  updatedText.textColor = widgetTextColor


  return widget
}

function addStackTo(stack, layout) {
  const newStack = stack.addStack()
  if (layout == 'h') {
    newStack.layoutHorizontally()
  } else {
    newStack.layoutVertically()
  }
  return newStack
}

function formatDataBalance(amount) {
  var formatterGiga = new Intl.NumberFormat('en', {
    style: 'decimal',

    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  let amount_str
  if (amount >= 999*1024*1024) {
    amount_str = formatterGiga.format(amount / (1024*1024*1024)) + " GB"
  } else if (amount >= 100*1024) {
    amount_str = formatterGiga.format((amount / (1024*1024)).toFixed()) + " MB"
  } else if (amount >= 100) {
    amount_str = formatterGiga.format(amount / 1024) + " kB"
  } else {
    amount_str = formatterGiga.format(amount) + " B"
  }
  return amount_str
}

function getDaysUntilExpire(date){
  let dateParts = date.split('-')
  let expireDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  let todayDate = new Date()
  let daysUntilExpire = (expireDate.getTime() - todayDate.getTime()) / (1000 * 3600 * 24)
  return Math.ceil(daysUntilExpire) + " Days"
}

function creatProgress(used, total) {
  const width = 120
  const height = 3
  const fillColorProgressbar = new Color('#757575')
  const strokeColorProgressbar = widgetTextColor
  const context = new DrawContext()
  context.size = new Size(width, height)
  context.opaque = false
  context.respectScreenScale = true

  // Background Path
  context.setFillColor(fillColorProgressbar)
  const path = new Path()
  path.addRoundedRect(new Rect(0, 0, width, height), 3, 2)
  context.addPath(path)
  context.fillPath()

  // Progress Path
  context.setFillColor(strokeColorProgressbar)
  const pathOne = new Path()
  const pathOnewidth = (width * (used / total) > width) ? width : width * (used / total)
  pathOne.addRoundedRect(new Rect(0, 0, pathOnewidth, height), 3, 2)
  context.addPath(pathOne)
  context.fillPath()
  return context.getImage()
}

function getLastRefreshTime() {
  let date = new Date()
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function openFile(filename, mode, data={}){
  const fm = FileManager.iCloud()
  const filePath = fm.joinPath(fm.documentsDirectory(), filename)
  if (mode === 'r'){
    let fileData = JSON.parse(fm.readString(filePath))
    return fileData
  }else if(mode === 'w'){
    fm.writeString(filePath, JSON.stringify(data))
  }
}

function getAuthData(){
  let authData = openFile('AirtelAuth.json', 'r')
  return authData
}

async function getAirtelData(){
  let airtelData, airtelJson
  let url = "https://myairtelapp.bsbportal.com/app/guardian/api/services/v1/prepaid?&siNumber=" + number;
  let auth = getAuthData()
  try{
    let req = new Request(url)
    req.headers = {
      "user-agent": auth.us,
      "X-Bsy-Utkn": auth.tk,
      "X-Bsy-Did": auth.id,
      "X-Bsy-Dt": auth.dt
    }
    airtelJson = await req.loadJSON()
    log(airtelJson)
    if(airtelJson.status !== 'success'){
      throw new Exception('API request failed');
    }
    airtelData = airtelJson.data.data.components[0]
    openFile('AirtelJson.json', 'w', airtelData)
    airtelData['latest'] = true
  }catch{
    airtelData = openFile('AirtelJson.json', 'r')
    airtelData['latest'] = false
  }finally{
    return airtelData
  }
}

async function getAirtelIcon(){
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
