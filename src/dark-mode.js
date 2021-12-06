let mainWidget = await createWidget()

if (!config.runsInWidget) {
  await mainWidget.presentSmall()
}

Script.setWidget(mainWidget)
Script.complete()

async function createWidget() {

  let widget = new ListWidget()
  let isDarkMode = Device.isUsingDarkAppearance()

  if (isDarkMode) {
    widget.backgroundColor = new Color('#000000', 1)
  } else {
    widget.backgroundColor = new Color('#ffffff', 1)
  }

  return widget
}
