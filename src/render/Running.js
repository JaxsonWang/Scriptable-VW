const Running = async (Widget, defaultArgs = '') => {
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
    M = new Widget(__arg || defaultArgs || '')
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

export default Running
