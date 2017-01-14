(function () {

  'use strict'

  const getDisplayInfosBtn = document.querySelector('#getDisplayInfos')
  const displayInfosList = document.querySelector('#displayInfosList')
  const openFullscreenPageBtn = document.querySelector('#openFullscreenPage')
  const closeDisplaysBtn = document.querySelector('#closeDisplays')

  getDisplayInfosBtn.addEventListener('click', () => {

    if (window.msw != null) {

      window.msw.getDisplayInfos().then((displayInfos) => {

        displayInfosList.innerHTML = displayInfos.map((display) => {
          return `<li>${ JSON.stringify(display) }</li>`
        })
      })
    }
  })

  const pages = []

  openFullscreenPageBtn.addEventListener('click', () => {
    if (window.msw != null) {
      window.msw.openPage({
        url: 'http://localhost:8082/slide-deck-viewer.html', fullscreen: true,
        left: 0, top: 0,
        width: 400, height: 300,
      })
      .then((id) => { pages.push(id) })
      window.msw.openPage({
        // url: 'http://localhost:8082/slide-deck-viewer.html?shift=1', fullscreen: true,
          url: 'http://localhost:8082/notes-viewer.html', fullscreen: true,
        left: 1280, top: 0,
        width: 400, height: 300,
      })
      .then((id) => { pages.push(id) })
    }
  })

  closeDisplaysBtn.addEventListener('click', () => {
    window.msw.closePages(pages, (e) => { pages.length = 0 })
  })

})()
