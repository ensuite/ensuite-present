(function () {

  'use strict'

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector))
  }

  function pad(value) {
    const absValue = Math.abs(value)
    if (absValue < 10) {
      return '0' + String(absValue)
    }
    return absValue
  }

  function now() {
    return Math.floor(new Date().getTime() / 1000)
  }

  qsa('.stopwatch-wrapper').forEach((wrapper) => {

    // connect to a named event bus
    // this allows to have several groups of slide decks that are not synced together
    // default : bus=default
    const bus = wrapper.dataset.bus || 'default'

    // ADD a prefix in the name
    const componentsChannel = new BroadcastChannel(`COMPONENTS_CHANNEL(${bus})`)

    const hoursDom = wrapper.querySelector('.hours')
    const minutesDom = wrapper.querySelector('.minutes')
    const secondsDom = wrapper.querySelector('.seconds')

    function updateDisplay(t) {

      const hours = Math.floor(t / (60 * 60))
      hoursDom.textContent = pad(hours)

      const minutes = Math.floor((t / 60) % 60)
      minutesDom.textContent = pad(minutes)

      const seconds = Math.floor(t % 60)
      secondsDom.textContent = pad(seconds)
    }

    let sessionIsRunning = false
    // time elapsed before the current session
    let elapsedBeforeSession
    // timestamp where the current session started
    let sessionStartTimestamp

    function reset() {
      elapsedBeforeSession = 0
      updateDisplay(0)
      sessionStartTimestamp = now()
    }

    reset()

    function updateLoop() {

      if (sessionIsRunning === true) {
        const elapsed = elapsedBeforeSession + (now() - sessionStartTimestamp)
        updateDisplay(elapsed)
      }

      requestAnimationFrame(updateLoop)
    }

    requestAnimationFrame(updateLoop)

    componentsChannel.addEventListener('message', ({ data: { command, commandArgs } }) => {

      switch (command) {

        case 'toggle-stopwatch':
          if (sessionIsRunning) {
            // stop session and increment time elapsed before session
            sessionIsRunning = false
            elapsedBeforeSession += (now() - sessionStartTimestamp)
          }
          else {
            // start session and record timestamp
            sessionIsRunning = true
            sessionStartTimestamp = now()
          }
          break

        case 'reset-stopwatch':
          reset()
          break

        default:
          if (command != null) {
            console.debug('unknown protocol command', command, 'with args', commandArgs)
          }
      }
    })
  })
})()
