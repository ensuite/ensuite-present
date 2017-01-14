(function () {

  'use strict'

  const params = new URLSearchParams(window.location.search)

  // open a slide deck
  // default : slide-deck-url=about:blank
  const slideDeckUrl = params.get('slide-deck-url') || 'about:blank'

  // connect to a named event bus
  // this allows to have several groups of slide decks that are not synced together
  // default : bus=default
  const bus = params.get('bus') || 'default'

  // setup keyboard shortcuts

  const initCursor = localStorage.getItem('initCursor') || null

  const componentsChannel = new BroadcastChannel(`COMPONENTS_CHANNEL(${bus})`)
  componentsChannel.postMessage({ command:'load-slide-deck', commandArgs: { url: slideDeckUrl, initCursor } })

  componentsChannel.addEventListener('message', ({ data: { command, commandArgs } }) => {

    switch (command) {

      case 'set-slide-deck-ratio':
        const { ratio } = commandArgs
        document.body.dataset.slideRatio = ratio
        break

      default:
        if (command != null) {
          console.debug('unknown protocol command', command, 'with args', commandArgs)
        }
    }
  })

  // const deckChannel = new BroadcastChannel('SLIDE_DECK')
  // const consoleChannel = new BroadcastChannel('SPEAKER_CONSOLE')
  // let currentIdx = 0
  // let slideDeckDetails
  // let slideRatio = '16/9'
  //
  // deckChannel.addEventListener('message', ({ source, data }) => {
  //
  //   if (data.command === 'GO_TO') {
  //     const foundStates = slideDeckDetails.filter((state) => state.curstor === data.cursor)
  //     if (foundStates[0] != null) {
  //       currentIdx = slideDeckDetails.indexOf(foundStates[0])
  //     }
  //   }
  // })
  //
  // window.addEventListener('message', (e) => {
  //   if (e.data.eventType = 'SLIDE_DECK_DETAILS') {
  //     slideDeckDetails = e.data.slideDeckDetails
  //     deckChannel.postMessage({ command: 'GO_TO', cursor: slideDeckDetails[0].cursor, secret: false })
  //   }
  // })
  //
  // window.addEventListener('keydown', (e) => {
  //
  //   console.log(e.keyCode)
  //
  //   if (e.keyCode === 39 || e.keyCode === 188 || e.keyCode === 70) {
  //     currentIdx += 1
  //     const secret = (e.shiftKey === true || e.keyCode === 70)
  //     document.querySelector('.footer').classList.toggle('unsync', secret)
  //     deckChannel.postMessage({ command: 'GO_TO', cursor: slideDeckDetails[currentIdx].cursor, secret })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 37 || e.keyCode === 75 || e.keyCode === 69) {
  //     currentIdx -= 1
  //     const secret = (e.shiftKey === true || e.keyCode === 69)
  //     document.querySelector('.footer').classList.toggle('unsync', secret)
  //     deckChannel.postMessage({ command: 'GO_TO', cursor: slideDeckDetails[currentIdx].cursor, secret })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 82) {
  //     deckChannel.postMessage({ command: 'NEXT_RATIO' })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 73) {
  //     deckChannel.postMessage({ command: 'TRIGGER', on: true })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 83 || e.keyCode === 79) {
  //     consoleChannel.postMessage({ command: 'TOGGLE_TIMER' })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 82 || e.keyCode === 78) {
  //     consoleChannel.postMessage({ command: 'RESET_TIMER' })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 65 || e.keyCode === 71) {
  //     if (slideRatio === '16/9') {
  //       slideRatio = '4/3'
  //     }
  //     else {
  //       slideRatio = '16/9'
  //     }
  //     document.body.dataset.slideRatio = slideRatio
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 72) {
  //     document.querySelector('.slideViewer-wrapper[data-shift="0"]').classList.add('fullscreen')
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 67) {
  //     document.querySelector('.notes-wrapper').scrollTop -= 100
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 68) {
  //     document.querySelector('.notes-wrapper').scrollTop += 100
  //     e.preventDefault()
  //   }
  // })
  //
  // window.addEventListener('keyup', (e) => {
  //
  //   console.log(e.keyCode)
  //
  //   if (e.keyCode === 73) {
  //     deckChannel.postMessage({ command: 'TRIGGER', on: false })
  //     e.preventDefault()
  //   }
  //
  //   if (e.keyCode === 72) {
  //     document.querySelector('.slideViewer-wrapper[data-shift="0"]').classList.remove('fullscreen')
  //     e.preventDefault()
  //   }
  // })
  //
  // window.addEventListener('focus', (e) => {
  //   document.body.classList.remove('blurred')
  // })
  // window.addEventListener('blur', (e) => {
  //   document.body.classList.add('blurred')
  // })
})()
