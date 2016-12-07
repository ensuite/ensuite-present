(function () {

  'use strict'

  function flatten(array) {
    const newArray = []
    array.forEach((itemOrItems) => {
      if (Array.isArray(itemOrItems)) {
        newArray.push(...itemOrItems)
      }
      else {
        newArray.push(itemOrItems)
      }
    })
    return newArray
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector))
  }

  qsa('.slideViewer-wrapper').forEach((wrapper) => {

    const viewer = wrapper.querySelector('.slideViewer')

    // display the slide deck in advance or with delay
    // data-shift=1 will display the very next step
    // default : 0
    const shift = Number(wrapper.dataset.shift) || 0

    // connect to a named event bus
    // this allows to have several groups of slide decks that are not synced together
    // default : bus=default
    const bus = wrapper.dataset.bus || 'default'

    // apply "viewerIsPublic" goTo() only if viewerIsPublic is enabled
    // this allows a speaker to move slides on his screen and not on the projector
    // default : secret=false
    const viewerIsSecret = ((wrapper.dataset.secret === 'true') ? true : false)

    // ADD a prefix in the name
    const componentsChannel = new BroadcastChannel(`COMPONENTS_CHANNEL(${bus})`)

    const componentId = (Math.random() * 1e30).toString(36)
    let details
    let flattenSteps
    let initCursor

    // Last know state from component
    const lastKnownState = {}

    // Display slides once they're loaded and ask for details
    viewer.addEventListener('load', () => {
      wrapper.classList.add('slideViewer-wrapper--loaded')
      sendCommandToIframe('get-slide-deck-details')
    })

    // Events from slide deck
    window.addEventListener('message', ({ source, data: { event, eventData } }) => {

      switch (event) {

        case 'slide-deck-details':
          details = eventData.details
          console.log(details)
          flattenSteps = flatten(details.steps)
          goToStep({ cursor: (initCursor || (flattenSteps[0].cursor)) })
          componentsChannel.postMessage({ event, eventData })
          break;

        default:
          if (event != null) {
            console.debug('unknown protocol event', event, 'with data', eventData)
          }
      }
    })

    componentsChannel.addEventListener('message', ({ data: { command, commandArgs } }) => {

      switch (command) {

        case 'load-slide-deck':

          if (lastKnownState.url != null && lastKnownState.url === commandArgs.url) {
            break
          }

          wrapper.classList.remove('slideViewer-wrapper--loaded')
          initCursor = commandArgs.initCursor
          lastKnownState.url = commandArgs.url
          viewer.src = commandArgs.url
          break

        case 'go-to-step':
          goToStep(commandArgs)
          break

        case 'go-to-first-step':
          goToStep({ cursor: flattenSteps[0].cursor, secret: commandArgs.secret })
          break

        case 'go-to-previous-step':
          goToStep({ cursor: lastKnownState.cursor, secret: commandArgs.secret, move: -1 })
          break

        case 'go-to-next-step':
          goToStep({ cursor: lastKnownState.cursor, secret: commandArgs.secret, move: 1 })
          break

        case 'go-to-last-step':
          goToStep({ cursor: flattenSteps[flattenSteps.length - 1].cursor, secret: commandArgs.secret })
          break

        case 'toggle-slide-deck-state':
          const { state, enabled } = commandArgs
          sendCommandToIframe('toggle-slide-deck-state', { state, enabled })
          break

        // case 'get-current-state':
        //   if (lastKnownState.url != null && lastKnownState.cursor != null) {
        //     componentsChannel.postMessage({
        //       command: 'apply-current-state',
        //       commandArgs: { lastKnownState, toComponentId: commandArgs.fromComponentId }
        //     })
        //   }
        //   break
        //
        // case 'apply-current-state':
        //   if (commandArgs.toComponentId === componentId) {
        //     lastKnownState.url = commandArgs.lastKnownState.url
        //     viewer.src = commandArgs.lastKnownState.url
        //     lastKnownState.cursor = commandArgs.lastKnownState.cursor
        //     initCursor = commandArgs.lastKnownState.cursor
        //   }
        //   break

        default:
          if (command != null) {
            console.debug('unknown protocol command', command, 'with args', commandArgs)
          }
      }
    })

    // componentsChannel.postMessage({ command: 'get-current-state', commandArgs: { fromComponentId: componentId } })

    function sendCommandToIframe(command, commandArgs) {
      viewer.contentWindow.postMessage({ command, commandArgs }, '*')
    }

    // "move" is to easily go to current step +1 or -5
    // shift is to...
    function goToStep({ cursor, secret = false, move = 0 }) {

      const stepIndex = flattenSteps.findIndex((step) => step.cursor === cursor)
      const newStepIndex = stepIndex + move
      const newStep = flattenSteps[newStepIndex]

      // don't send "go-to-step" if step cannot be found
      if (!newStep) {
        return
      }

      lastKnownState.cursor = newStep.cursor

      const shiftedStepIndex = newStepIndex + shift
      const shiftedStep = flattenSteps[shiftedStepIndex]
      const isOutOfBounds = (shiftedStepIndex < 0) || (shiftedStepIndex >= flattenSteps.length)

      wrapper.classList.toggle('slideViewer-wrapper--overTheEnd', isOutOfBounds)

      // don't send "go-to-step" if step cannot be found
      if (!shiftedStep) {
        return
      }

      // don't send "go-to-step" if it is secret and viewer is not
      if (secret && !viewerIsSecret) {
        return
      }

      sendCommandToIframe('go-to-step', { cursor: shiftedStep.cursor })
    }
  })
})()
