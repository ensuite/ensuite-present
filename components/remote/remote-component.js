(function () {

  'use strict'

  function objectForEach(object, iterator) {
    for (let key in object) {
      iterator(object[key], key)
    }
  }

  function deepEqual(objA, objB) {
    const objAStr = JSON.stringify(objA)
    const objBStr = JSON.stringify(objB)
    return objAStr === objBStr
  }

  const comboToCommand = {}

  window.remoteConfigs = window.remoteConfigs || {}
  objectForEach(window.remoteConfigs, (config, remoteName) => {
    objectForEach(config, ({ command, commandArgs }, combo) => {

      if (combo in comboToCommand) {

        if (!deepEqual(command, comboToCommand[combo].command)) {
          return console.debug(`remote config conflict with ${combo} : [${remoteName}] wants to send "${command}" but [${comboToCommand[combo].remotes}] are already registered to send "${comboToCommand[combo].command}"`)
        }

        if (!deepEqual(commandArgs, comboToCommand[combo].commandArgs)) {
          console.debug(`remote config conflict with ${combo}, the same "${command}" is configured but with different arguments :`)
          console.debug(`[${remoteName}] wants to send`, commandArgs)
          console.debug(`[${comboToCommand[combo].remotes}] want to send`, comboToCommand[combo].commandArgs)
          return
        }

        return comboToCommand[combo].remotes.push(remoteName)
      }

      comboToCommand[combo] = { remotes: [remoteName], command, commandArgs }
    })
  })

  // ADD a prefix in the name
  const componentsChannel = new BroadcastChannel(`COMPONENTS_CHANNEL(default)`)

  window.addEventListener('keydown', handleKey)
  window.addEventListener('keyup', handleKey)

  function handleKey(e) {

    const keyCombo = [
      e.ctrlKey ? 'Ctrl' : '',
      e.altKey ? 'Alt' : '',
      e.shiftKey ? 'Shift' : '',
      e.code,
    ]
      .filter((key) => key != '')
      .join('+')

    // simplify event names keydown, keyup, keypress
    const type = e.type.replace(/^key/, '')

    const combo = `${type}(${keyCombo})`

    if (comboToCommand[combo] != null) {
      e.preventDefault()
      const { command, commandArgs } = comboToCommand[combo]
      if (Array.isArray(command)) {
        command.forEach((com) => {
          componentsChannel.postMessage({ command: com, commandArgs })
        })
      }
      else {
        componentsChannel.postMessage({ command, commandArgs })
      }
    }
    else {
      console.debug(`combo ${combo} is not configured`)
    }
  }
})()
