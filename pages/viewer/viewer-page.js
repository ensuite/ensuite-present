(function () {

  'use strict'

  const params = new URLSearchParams(window.location.search)

  // display a grid of slide deck
  // ex: multi=3 => grid of 9 slide decks (3 by 3)
  // default : multi=1
  const multi = Number(params.get('multi')) || 1

  // display the slide deck in advance or with delay
  // shift=1 will display the very next step
  // default : shift=0
  const shift = Number(params.get('shift')) || 0

  // connect to a named event bus
  // this allows to have several groups of slide decks that are not synced together
  // default : bus=default
  const bus = params.get('bus') || 'default'

  // apply "secret" goTo() only if secret is enabled
  // this allows a speaker to move slides on his screen and not on the projector
  // default : secret=false
  const secret = (params.get('secret') === 'true') ? true : false

  const wrapperReference = document.querySelector('.slideViewer-wrapper')

  wrapperReference.dataset.secret = secret
  wrapperReference.dataset.bus = bus

  if (multi === 1) {
    wrapperReference.dataset.shift = shift
  }
  else {
    document.body.classList.add('multi')
    document.body.setAttribute('style', `--multi: ${multi}`)

    const before = wrapperReference.nextSibling

    for (let i = 1; i < multi * multi; i += 1) {
      const newWrapper = wrapperReference.cloneNode(true)
      newWrapper.dataset.shift = i + shift
      wrapperReference.parentElement.insertBefore(newWrapper, before)
    }

    wrapperReference.dataset.shift = 0 + shift
  }
})()
