function createModal(url) {
  // Creates modal.
  const modal = document.createElement('div')
  const topBorderWidth = 15

  // Handle closing modal.
  let closeModal = function () {
    modal.remove()
  }
  // Create HTML element.
  modal.classList.add('modal')
  modal.style = `position: fixed; top: 0; left: 0; width: 50%; height: 50%; border-radius: 10px; border-width: ${topBorderWidth}px 2px 2px 2px; border-style: solid; border-color: red; z-index: 10000;`

  const button = document.createElement('button')
  button.id = 'close-modal'
  button.style = 'float: left; position: relative; z-index: 10001; width: 20px; height: 20px; cursor: pointer'
  button.innerHTML = '&times;'
  modal.appendChild(button)

  const iframe = document.createElement('iframe')
  iframe.id = 'iframe'
  iframe.style = 'width: 100%; height: 100%; position: absolute; left: 0;'
  iframe.src = url
  iframe.frameBorder = '0'
  modal.appendChild(iframe)
  // This variable is used to determine if the modal is being dragged.
  let dragging = false
  let offsetX = 0
  let offsetY = 0

  // Update the position of the modal.
  function dragHandler(e) {
    if (dragging) {
      console.log(e.offsetX)
      modal.style.left = e.pageX - offsetX + 'px'
      modal.style.top = e.pageY - offsetY + 'px'
    }
  }

  // Grab the modal.
  function grabHandler(e) {
    dragging = true
    offsetX = e.offsetX
    offsetY = e.offsetY + 15
  }

  // Drop the modal.
  function dropHandler(e) {
    dragging = false
  }

  // Add event handlers.
  /* eslint-disable no-multi-spaces */
  modal.addEventListener('mousedown', grabHandler)    // Modal can be grabbed.
  addEventListener('mouseup', dropHandler)            // Modal can be dropped anywhere.
  addEventListener('mousemove', dragHandler)          // Modal can be dragged anywhere.
  /* eslint-enable no-multi-spaces */

  // Add the modal to the DOM.
  document.documentElement.appendChild(modal)

  // Add event listeners for mouse movement to iframe to get inputs when mouse is over it.
  contentWindow = iframe.contentWindow
  contentWindow.addEventListener('mousemove', dragHandler)
  contentWindow.addEventListener('mouseup', dropHandler)

  // Add event listener for closing modal.
  document.getElementById('close-modal').addEventListener('click', closeModal)
}

// Create a new modal when the extension icon is clicked.
chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: createModal,
      args: [tab.url]
    })
  }
})

// Add to context menu.
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'page-in-page',
    title: 'Open page in modal',
    contexts: ['link']
  })
})

function contextMenuHandler(e, tab) {
  if (!tab.url.includes('chrome://')) {
    let target = e.linkUrl ? e.linkUrl : tab.url
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: createModal,
      args: [target]
    })
  }
}

// Add event listener for context menu.
chrome.contextMenus.onClicked.addListener(contextMenuHandler)