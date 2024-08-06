function createModal() {
  // Creates modal.
  const modal = document.createElement('div')

  // Handle closing modal.
  let closeModal = function () {
    modal.remove()
  }
  // Create HTML element.
  modal.classList.add('modal')
  modal.style = "position: fixed; top: 0; left: 0; width: 50%; height: 50%; border-radius: 10px; border-width: 10px 5px 5px 5px; border-style: solid; border-color: red; z-index: 10000;";
  modal.innerHTML = `
    <button id="close-modal" style="float: left; position: relative; z-index: 10001; width: 20px; height: 20px; cursor: pointer">&times;</button>
    <iframe id="iframe" style="width: 100%; height: 100%; position: absolute; left: 0;" src="${window.location.href}" frameborder="0"></iframe>
  `
  // This variable is used to determine if the modal is being dragged.
  let dragging = false

  // Update the position of the modal.
  function dragHandler(e) {
    if (dragging) {
      console.log(modal.style.left = parseInt(modal.style.left) + e.movementX + 'px')
      console.log(modal.style.top = parseInt(modal.style.top) + e.movementY + 'px')
      modal.style.left = parseInt(modal.style.left) + e.movementX + 'px'
      modal.style.top = parseInt(modal.style.top) + e.movementY + 'px'
    }
  }

  // Grab the modal.
  function grabHandler(e) {
    dragging = true
  }

  // Drop the modal.
  function dropHandler(e) {
    dragging = false
  }

  // Add event handlers.
  modal.addEventListener('mousedown', grabHandler)    // Modal can be grabbed.
  addEventListener('mouseup', dropHandler)            // Modal can be dropped anywhere.
  addEventListener('mousemove', dragHandler)          // Modal can be dragged anywhere.

  // Add the modal to the DOM.
  document.documentElement.appendChild(modal)

  // Add event listeners for mouse movement to iframe to get inputs when mouse is over it.
  contentWindow = document.getElementById('iframe').contentWindow
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
      function: createModal
    })
  }
})