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

  qsa('.timer-wrapper').forEach((wrapper) => {

    // connect to a named event bus
    // this allows to have several groups of slide decks that are not synced together
    // default : bus=default
    const bus = wrapper.dataset.bus || 'default'

    // ADD a prefix in the name
    const componentsChannel = new BroadcastChannel(`COMPONENTS_CHANNEL(${bus})`)

    const plusMinusDom = wrapper.querySelector('.plusMinus')
    const hoursDom = wrapper.querySelector('.hours')
    const minutesDom = wrapper.querySelector('.minutes')
    const secondsDom = wrapper.querySelector('.seconds')

    let totalTime = 50 * 60

    function updateDisplay(t) {

      const positive = (t >= 0)
      plusMinusDom.textContent = positive ? '+' : '-'
      wrapper.classList.toggle('timer-wrapper--over', !positive)

      const asbT = Math.abs(t)

      const hours = Math.floor(asbT / (60 * 60))
      hoursDom.textContent = pad(hours)

      const minutes = Math.floor((asbT / 60) % 60)
      minutesDom.textContent = pad(minutes)

      const seconds = Math.floor(asbT % 60)
      secondsDom.textContent = pad(seconds)
    }

    let sessionIsRunning = false
    // time elapsed before the current session
    let elapsedBeforeSession
    // timestamp where the current session started
    let sessionStartTimestamp

    function reset() {
      elapsedBeforeSession = 0
      updateDisplay(totalTime - 0)
      sessionStartTimestamp = now()
    }

    reset()

    function updateLoop() {

      if (sessionIsRunning === true) {
        const elapsed = elapsedBeforeSession + (now() - sessionStartTimestamp)
        updateDisplay(totalTime - elapsed)
      }

      requestAnimationFrame(updateLoop)
    }

    requestAnimationFrame(updateLoop)

    componentsChannel.addEventListener('message', ({ data: { command, commandArgs } }) => {

      switch (command) {

        case 'toggle-timer':
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

        case 'reset-timer':
          reset()
          break

        case 'update-timer':
          totalTime = Math.max(totalTime + commandArgs.amount, 0)
          if (!sessionIsRunning) {
            updateDisplay(totalTime - elapsedBeforeSession)
          }
          break

        default:
          if (command != null) {
            console.debug('unknown protocol command', command, 'with args', commandArgs)
          }
      }
    })
  })
})()
