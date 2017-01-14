// DOM stuffs
const pageListDisplay = document.querySelector('#page-list')
const pageTarget = document.querySelector('#page-target')
const messageForm = document.querySelector('#message-form')
const messageInput = document.querySelector('#message-input')
const messageOutput = document.querySelector('#message-output')

// screen utils

function isFullscreen() {

  // Firefox 1px bug ???
  // https://bugzilla.mozilla.org/show_bug.cgi?id=729011

  // works in FF (with black line patched) and Chrome

  const widthMatch = (window.outerWidth === window.innerWidth) || (window.outerWidth >= window.screen.width)
  const heightMatch = (window.outerHeight === window.innerHeight) || (window.outerHeight === window.screen.height)

  return widthMatch && heightMatch
}

function getRatio(width, height) {

  // based on ?/360 denominator
  const ratioNames = {
    840: "21/9",
    640: "16/9",
    576: "16/10",
    480: "4/3",
    450: "5/4",
  }

  const ratio = width / height
  const ratioNumerator = Math.round(ratio * 360)

  if (ratioNames[ratioNumerator] != null) {
    return ratioNames[ratioNumerator]
  }

  return ratio.toFixed(2)
}

function getScreenRatio() {
  return getRatio(window.screen.width, window.screen.height)
}

function getPageRatio() {
  return getRatio(window.innerWidth, window.innerHeight)
}

// debounce utils
function debounce(fn, delay = 200) {
  let id
  return function () {
    if (id) {
      clearTimeout(id)
    }
    id = setTimeout(fn, delay)
  }
}

// broadcast stuffs
const bc = new BroadcastChannel('foobar')

// pages
const currentPage = {
  id: (Math.random() * 1e100).toString(36).substr(0, 4).toUpperCase(),
  createdAt: new Date().getTime(),
}

const pageList = new Map()
pageList.set(currentPage.id, currentPage)

function updatePage() {
  currentPage.title = document.title
  currentPage.isFullscreen = isFullscreen()
  currentPage.screenRatio = getScreenRatio()
  currentPage.pageRatio = getPageRatio()
  currentPage.width = window.innerWidth
  currentPage.height = window.innerHeight
}

function formatPageListDisplay() {

  const sortedPageList = Array.from(pageList.values())
    .sort(function sortPageList(pageA, pageB) {
      if (pageA.createdAt > pageB.createdAt) {
        return 1
      }
      if (pageA.createdAt < pageB.createdAt) {
        return -1
      }
      return 0
    })

  pageListDisplay.innerHTML = sortedPageList
    .map((page) => {
      const cssClass = (page.id === currentPage.id) ? 'pageItem pageItem--current' : 'pageItem'
      return `<div class="${cssClass}">
        <div>id: ${page.id}</div>
        <div>title: ${page.title}</div>
        <div>isFullscreen: ${page.isFullscreen}</div>
        <div>screenRatio: ${page.screenRatio}</div>
        <div>pageRatio: ${page.pageRatio}</div>
        <div>width: ${page.width}</div>
        <div>height: ${page.height}</div>
      </div>`
    })
    .join('')

  pageTarget.innerHTML = `<option value="ALL">ALL but me</option>` + sortedPageList
    .filter((page) => page.id !== currentPage.id)
    .map((page) => {
      return `<option value="${page.id}">${page.title}</option>`
    })
    .join('')

}

// messages
const I_JUST_ARRIVED_WHO_S_THERE = 'I_JUST_ARRIVED_WHO_S_THERE'
const I_M_LEAVING = 'I_M_LEAVING'
const I_AM_HERE = 'I_AM_HERE'
const I_CHANGED = 'I_CHANGED'
const MESSAGE = 'MESSAGE'

window.addEventListener('resize', debounce(() => {
  updatePage()
  formatPageListDisplay()
  bc.postMessage({ eventType: I_CHANGED, originPage: currentPage })
}))

window.addEventListener('load', () => {
  document.title = `MP (${currentPage.id})`
  updatePage()
  formatPageListDisplay()
  bc.postMessage({ eventType: I_JUST_ARRIVED_WHO_S_THERE, originPage: currentPage })
})

window.addEventListener('unload', () => {
  bc.postMessage({ eventType: I_M_LEAVING, originPage: currentPage })
})

bc.addEventListener('message', ({ data: { eventType, originPage, message, targetPage } }) => {

  console.log(eventType, originPage)

  if (eventType === I_JUST_ARRIVED_WHO_S_THERE) {
    pageList.set(originPage.id, originPage)
    formatPageListDisplay()
    bc.postMessage({ eventType: I_AM_HERE, originPage: currentPage })
  }

  if (eventType === I_AM_HERE) {
    pageList.set(originPage.id, originPage)
    formatPageListDisplay()
  }

  if (eventType === I_CHANGED) {
    pageList.set(originPage.id, originPage)
    formatPageListDisplay()
  }

  if (eventType === I_M_LEAVING) {
    pageList.delete(originPage.id)
    formatPageListDisplay()
  }

  if (eventType === MESSAGE) {
    if (targetPage == null || targetPage.id === currentPage.id) {
      messageOutput.innerHTML += `<div>${message} (${originPage.id})</div>`
    }
  }
})

// form/message stuffs
messageForm.addEventListener('submit', (e) => {

  e.preventDefault()

  const messageObject = {
    eventType: MESSAGE,
    originPage: currentPage,
    message: messageInput.value,
  }

  if (pageTarget.value !== 'ALL' && pageList.has(pageTarget.value)) {
    messageObject.targetPage = pageList.get(pageTarget.value)
  }

  bc.postMessage(messageObject)
  messageInput.value = ''
})

//   TODO !!!!
// X debouce resize
//   direct message through BroadcastChannel and page.ID
//   add the page origin that sent the message
//   way to adress a window with BroadcastChannel (maybe provide and ID or get the ID from iframe)
// X maybe change the array into a map
//   add some polling for resize and other maybe (FF does not see to need that)
// X  detect fullscreen (TO BE IMPROVED)
