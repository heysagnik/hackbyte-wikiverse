const isWikipediaDomain = window.location.hostname.includes('wikipedia.org');

if (!isWikipediaDomain) {
  console.log('Wiki Copilot is only available on Wikipedia domains');
  // Don't execute the rest of the script on non-Wikipedia domains
} else {
  let floatingPanel = null;
  let sidebar = null;
  let selectedText = '';
  let currentOperation = '';
  let currentResult = '';

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showFloatingPanel') {
      selectedText = message.selectedText;
      currentOperation = message.operation;
      
      createFloatingPanel();
      processSelectedText();
      
      sendResponse({ success: true });
    }
    
    if (message.action === 'openSidebar') {
      selectedText = message.selectedText;
      currentOperation = message.operation;
      currentResult = message.result;
      
      createSidebar();
      
      sendResponse({ success: true });
    }
  });

  function processSelectedText() {
    if (!selectedText || !currentOperation) return;
    
    chrome.runtime.sendMessage({
      action: 'processWithGemini',
      text: selectedText,
      operation: currentOperation
    }, response => {
      if (response.success) {
        currentResult = response.result;
        updateFloatingPanelContent(currentResult);
      } else {
        updateFloatingPanelContent(`Error: ${response.error || 'Failed to process text'}`);
      }
    });
  }

  function createFloatingPanel() {
    if (floatingPanel) {
      document.body.removeChild(floatingPanel);
    }
    
    floatingPanel = document.createElement('iframe');
    floatingPanel.src = chrome.runtime.getURL('floating-panel/floating-panel.html');
    floatingPanel.id = 'wiki-copilot-floating-panel';
    floatingPanel.style.cssText = `
      position: fixed;
      top: 20%;
      right: 20px;
      width: 350px;
      height: 300px;
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2147483647;
      background-color: white;
    `;
    
    document.body.appendChild(floatingPanel);
    
    floatingPanel.onload = () => {
      floatingPanel.contentWindow.postMessage({
        action: 'initialize',
        selectedText,
        operation: currentOperation
      }, '*');
      
      setupDraggable(floatingPanel);
    };
  }

  function createSidebar() {
    if (sidebar) {
      document.body.removeChild(sidebar);
    }
    
    sidebar = document.createElement('iframe');
    sidebar.src = chrome.runtime.getURL('sidebar/sidebar.html');
    sidebar.id = 'wiki-copilot-sidebar';
    sidebar.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 380px;
      height: 100vh;
      border: none;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      z-index: 2147483647;
      background-color: white;
    `;
    
    document.body.appendChild(sidebar);
    
    sidebar.onload = () => {
      sidebar.contentWindow.postMessage({
        action: 'initialize',
        selectedText,
        operation: currentOperation,
        result: currentResult
      }, '*');
    };
  }

  function updateFloatingPanelContent(content) {
    if (floatingPanel) {
      floatingPanel.contentWindow.postMessage({
        action: 'updateContent',
        content
      }, '*');
    }
  }

  function setupDraggable(element) {
    setTimeout(() => {
      try {
        if (!element.contentWindow || !element.contentDocument) {
          setupParentDrag(element);
          return;
        }
        
        const doc = element.contentDocument || element.contentWindow.document;
        if (!doc) {
          setupParentDrag(element);
          return;
        }
        
        const header = doc.getElementById('panel-header');
        if (!header) {
          console.warn('Panel header element not found, using alternative drag method');
          setupParentDrag(element);
          return;
        }
        
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        header.addEventListener('mousedown', dragMouseDown);
        
        function dragMouseDown(e) {
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          
          document.addEventListener('mouseup', closeDragElement);
          document.addEventListener('mousemove', elementDrag);
        }
        
        function elementDrag(e) {
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          
          element.style.top = (element.offsetTop - pos2) + "px";
          element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
          document.removeEventListener('mouseup', closeDragElement);
          document.removeEventListener('mousemove', elementDrag);
        }
      } catch (error) {
        console.error('Error setting up draggable functionality:', error);
        setupParentDrag(element);
      }
    }, 100);
  }

  function setupParentDrag(element) {
    const dragZone = document.createElement('div');
    dragZone.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      cursor: move;
      z-index: 2147483647;
    `;
    
    const rect = element.getBoundingClientRect();
    dragZone.style.width = rect.width + 'px';
    
    document.body.appendChild(dragZone);
    
    let isDragging = false;
    let offsetX, offsetY;
    
    dragZone.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
    
    function onMouseMove(e) {
      if (!isDragging) return;
      
      element.style.left = (e.clientX - offsetX) + 'px';
      element.style.top = (e.clientY - offsetY) + 'px';
      
      dragZone.style.left = element.style.left;
      dragZone.style.top = element.style.top;
    }
    
    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    
    window.addEventListener('message', event => {
      if (event.data.action === 'closeFloatingPanel') {
        document.body.removeChild(dragZone);
      }
    });
  }

  window.addEventListener('message', event => {
    if (event.data.action === 'closeFloatingPanel' && floatingPanel) {
      document.body.removeChild(floatingPanel);
      floatingPanel = null;
    }
    
    if (event.data.action === 'closeSidebar' && sidebar) {
      document.body.removeChild(sidebar);
      sidebar = null;
    }
    
    if (event.data.action === 'openInSidebar') {
      chrome.runtime.sendMessage({
        action: 'openSidebar',
        selectedText,
        operation: currentOperation,
        result: currentResult
      });
    }
    
    if (event.data.action === 'startDrag' && floatingPanel) {
      const initialX = event.data.initialX;
      const initialY = event.data.initialY;
      startDrag(initialX, initialY);
    }
    
    if (event.data.action === 'stopDrag') {
      stopDrag();
    }
  });

  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function startDrag(initialX, initialY) {
    if (!floatingPanel) return;
    
    isDragging = true;
    
    const rect = floatingPanel.getBoundingClientRect();
    dragOffsetX = initialX - rect.left;
    dragOffsetY = initialY - rect.top;
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', stopDrag);
  }

  function handleDragMove(e) {
    if (!isDragging || !floatingPanel) return;
    
    const newLeft = e.clientX - dragOffsetX;
    const newTop = e.clientY - dragOffsetY;
    
    floatingPanel.style.left = `${newLeft}px`;
    floatingPanel.style.top = `${newTop}px`;
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', stopDrag);
  }
}