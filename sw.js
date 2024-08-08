function createModal (url) {
  // Creates modal.
  const modal = document.createElement('div')

  // Handle closing modal.
  function closeModal () {
    modal.remove()
  }
  // Create HTML element.
  modal.classList.add('modal')
  modal.style = 'position: fixed; top: 0; left: 0; width: 50%; height: 50%; border-radius: 10px; background-image: linear-gradient(#587283, #537ead); box-shadow: 3px 3px 3px black; z-index: 10000; padding: 20px 3px 3px 3px; resize: both;'

  const button = document.createElement('button')
  button.id = 'close-modal'
  button.style = 'float: left; position: relative; z-index: 10001; width: 30px; height: 30px; border-radius: 10px; cursor: pointer'
  button.innerHTML = '&times;'
  modal.appendChild(button)

  const iframe = document.createElement('iframe')
  iframe.id = 'iframe'
  iframe.style = 'width: 100%; height: 100%; position: relative; left: 0; top: -30px; border-radius: 10px; resize: both;'
  iframe.src = url
  iframe.frameBorder = '0'
  modal.appendChild(iframe)
  // This variable is used to determine if the modal is being dragged.
  let dragging = false
  let offsetX = 0
  let offsetY = 0

  // Update the position of the modal.
  function dragHandler (e) {
    if (dragging) {
      modal.style.left = e.screenX + offsetX + 'px'
      modal.style.top = e.screenY + offsetY + 'px'
    }
  }

  // Grab the modal.
  function grabHandler (e) {
    if (!e.ctrlKey) dragging = true
    offsetX = modal.offsetLeft - e.screenX
    offsetY = modal.offsetTop - e.screenY
  }

  // Drop the modal.
  function dropHandler (e) {
    dragging = false
  }

  // Add event handlers.
  /* eslint-disable no-multi-spaces */
  /* eslint-disable no-undef */
  modal.addEventListener('mousedown', grabHandler)    // Modal can be grabbed.
  addEventListener('mouseup', dropHandler)            // Modal can be dropped anywhere on the screen.
  addEventListener('mousemove', dragHandler)          // Modal can be dragged anywhere on the screen.
  /* eslint-enable no-multi-spaces */
  /* eslint-enable no-undef */

  // Add the modal to the DOM.
  document.documentElement.appendChild(modal)

  // Add event listeners for mouse movement to iframe to get inputs when mouse is over it.
  /* eslint-disable no-undef */
  contentWindow = iframe.contentWindow
  contentWindow.addEventListener('mousemove', dragHandler)
  contentWindow.addEventListener('mouseup', dropHandler)
  /* eslint-enable no-undef */

  // Handle resizing the modal.

  function resizeHandler () {
    if (iframe.offsetHeight < 300 || iframe.offsetWidth < 300) return
    modal.style.width = iframe.offsetWidth + 'px'
    modal.style.height = iframe.offsetHeight + 'px'
  }

  new ResizeObserver(resizeHandler).observe(iframe) // eslint-disable-line no-undef

  // Add event listener for closing modal.
  button.addEventListener('click', closeModal)
}

// Create a new modal when the extension icon is clicked.
chrome.action.onClicked.addListener((tab) => { // eslint-disable-line no-undef
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({ // eslint-disable-line no-undef
      target: { tabId: tab.id },
      function: createModal,
      args: [tab.url]
    })
  }
})

// Add to context menu.
/* eslint-disable no-undef */
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    /* eslint-enable no-undef */
    id: 'page-in-page',
    title: 'Open page in modal',
    contexts: ['link']
  })
})

function contextMenuHandler (e, tab) {
  if (!tab.url.includes('chrome://')) {
    const target = e.linkUrl ? e.linkUrl : tab.url
    chrome.scripting.executeScript({ // eslint-disable-line no-undef
      target: { tabId: tab.id },
      function: createModal,
      args: [target]
    })
  }
}

// Add event listener for context menu.
chrome.contextMenus.onClicked.addListener(contextMenuHandler) // eslint-disable-line no-undef
