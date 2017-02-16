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

  qsa('.clock-wrapper').forEach((wrapper) => {

    const hoursDom = wrapper.querySelector('.hours')
    const minutesDom = wrapper.querySelector('.minutes')
    const secondsDom = wrapper.querySelector('.seconds')

    function updateLoop() {
      const date = new Date()
      hoursDom.textContent = pad(date.getHours())
      minutesDom.textContent = pad(date.getMinutes())
      secondsDom.textContent = pad(date.getSeconds())
      requestAnimationFrame(updateLoop)
    }

    requestAnimationFrame(updateLoop)
  })
})()
