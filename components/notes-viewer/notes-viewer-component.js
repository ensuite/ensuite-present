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

  qsa('.notes-wrapper').forEach((wrapper) => {

    const notesBody = wrapper.querySelector('.notes-body')

    // connect to a named event bus
    // this allows to have several groups of slide decks that are not synced together
    // default : bus=default
    const bus = wrapper.dataset.bus || 'default'

    // ADD a prefix in the name
    const componentsChannel = new BroadcastChannel(`COMPONENTS_CHANNEL(${bus})`)

    const componentId = (Math.random() * 1e30).toString(36)
    let details
    let flattenSteps
    let initCursor

    // Last know state from component
    const lastKnownState = {}

    wrapper.addEventListener('click', (e) => {

      let block = e.target

      if (block.dataset.slideIdx == null) {
        block = block.parentElement
      }

      const commandArgs = { cursor: block.dataset.slideIdx, secret: false }
      goToStep(commandArgs)
      componentsChannel.postMessage({ command: 'go-to-step', commandArgs })
    })

    componentsChannel.addEventListener('message', ({ data: { event, eventData } }) => {

      switch (event) {

        case 'slide-deck-details':
          details = eventData.details
          flattenSteps = flatten(details.steps)
          notesBody.innerHTML = transformNotesToHtml(flattenSteps)
          goToStep({ cursor: (initCursor || (flattenSteps[0].cursor)) })
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
          initCursor = commandArgs.initCursor
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

        case 'move-notes':
          wrapper.scrollTop += commandArgs.amount
          break

        default:
          if (command != null) {
            console.debug('unknown protocol command', command, 'with args', commandArgs)
          }
      }
    })

    function transformNotesToHtml(steps) {

      return steps
        .map(({ cursor, notes }) => {

          const blocks = notes
            .split('\n')
            .map((line) => `<div class="notes-line">${line}</div>`)
            .join('')

          return `<div class="notes-block" data-slide-idx="${cursor}">${blocks}</div>`
        })
        .join('')
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

      const oldBlock = wrapper.querySelector('.current-block')
      if (oldBlock != null) {
        oldBlock.classList.remove('current-block')
      }

      const currentBlock = wrapper.querySelector(`.notes-block[data-slide-idx="${newStep.cursor}"]`)
      currentBlock.scrollIntoView({ behavior: 'smooth' })
      currentBlock.classList.add('current-block')
    }
  })
})()
