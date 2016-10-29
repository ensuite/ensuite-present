const rez = document.querySelector('#rez')

function isFullscreen() {

  // Firefox 1px bug ???
  // https://bugzilla.mozilla.org/show_bug.cgi?id=729011

  // works in FF (with black line patched) and Chrome

  const widthMatch = (window.outerWidth === window.innerWidth) || (window.outerWidth >= window.screen.width)
  const heightMatch = (window.outerHeight === window.innerHeight) || (window.outerHeight === window.screen.height)

  return widthMatch && heightMatch
}

// https://github.com/sindresorhus/screenfull.js
// https://github.com/tombigel/detect-zoom

// if we force zoom to 100% in Chrome we can get physical screen resolution with
// ${window.screen.width * window.devicePixelRatio}

// Firefox will give us approximately (needs rounding) correct physical size whatever the zoom
// ${window.screen.width * window.devicePixelRatio}

// based on ?/360 denominator
const ratios = {
  840: "21/9",
  640: "16/9",
  576: "16/10",
  480: "4/3",
  450: "5/4",
}

function ratio() {
  const r = Math.round(window.screen.width / window.screen.height * 360)
  if (ratios[r] != null) {
    return ratios[r]
  }
  return (window.screen.width / window.screen.height).toFixed(2)
}

console.log(ratio())

function updateInfos() {
  rez.innerHTML = `
window.devicePixelRatio         ${window.devicePixelRatio}
window.innerWidth               ${window.innerWidth}
window.innerHeight              ${window.innerHeight}
window.outerWidth               ${window.outerWidth}
window.outerHeight              ${window.outerHeight}
window.screenX                  ${window.screenX}
window.screenY                  ${window.screenY}
window.screen.width             ${window.screen.width}
window.screen.height            ${window.screen.height}
window.screen.availWidth        ${window.screen.availWidth}
window.screen.availHeight       ${window.screen.availHeight}
window.screen.availLeft         ${window.screen.availLeft}
window.screen.availTop          ${window.screen.availTop}
window.screen.orientation.angle ${window.screen.orientation.angle}
window.screen.orientation.type  ${window.screen.orientation.type}
isFullscreen                    ${isFullscreen()}
ratio                           ${ratio()}
  `.trim()
}

window.addEventListener('resize', updateInfos)
updateInfos()
