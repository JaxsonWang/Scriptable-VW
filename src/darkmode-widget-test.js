// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;

// for https://talk.automators.fm/t/bug-device-isusingdarkappearance-in-widget-always-returns-true/8721/5

async function isUsingDarkAppearance() {
  const wv = new WebView()
  let js ="(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)"
  return await wv.evaluateJavaScript(js)
}

var widget = new ListWidget()
widget.setPadding(0,0,0,0)

widget.addSpacer()
var t1 = widget.addText('Device.isUsingDarkAppearance')
t1.centerAlignText()
t1.font = Font.regularSystemFont(10)
var t2  = widget.addText(`${Device.isUsingDarkAppearance()}`)
t2.centerAlignText()
t2.font = Font.regularSystemFont(10)

widget.addSpacer(10)

var t3 = widget.addText('await isUsingDarkAppearance')
t3.centerAlignText()
t3.font = Font.regularSystemFont(10)
var t4 = widget.addText(`${await isUsingDarkAppearance()}`)
t4.centerAlignText()
t4.font = Font.regularSystemFont(10)

widget.addSpacer()

Script.setWidget(widget)
widget.presentSmall()
Script.complete()
