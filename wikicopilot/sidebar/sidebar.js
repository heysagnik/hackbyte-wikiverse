let selectedText = '';
let operation = '';
let initialResult = '';
let chatHistory = [];

window.addEventListener('message', event => {
  if (event.data.action === 'initialize') {
    selectedText = event.data.selectedText;
    operation = event.data.operation;
    initialResult = event.data.result;
    
    initializeChat();
  }
});

function initializeChat() {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.innerHTML = ''; // Clear any existing content
  
  // Add system message
  const systemMessage = document.createElement('div');
  systemMessage.className = 'system-message';
  systemMessage.textContent = `Wiki Copilot - ${capitalizeFirstLetter(operation)} mode`;
  chatContainer.appendChild(systemMessage);
  
  // Add user's initial selected text
  addMessage('user', selectedText);
  
  // Add assistant's initial response
  if (initialResult) {
    addMessage('assistant', initialResult);
    
    // Add to chat history
    chatHistory = [
      { role: 'user', content: selectedText },
      { role: 'assistant', content: initialResult }
    ];
  } else {
    chatHistory = [{ role: 'user', content: selectedText }];
    // Request initial analysis if no result was provided
    processWithGemini(selectedText, operation);
  }
  
  setupSuggestionChips();
  setupClearButton();
  
  scrollToBottom();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function setupSuggestionChips() {
  const chips = document.querySelectorAll('.chip');
  
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const chipText = chip.textContent;
      let prompt = '';
      
      switch(chipText) {
        case 'Analyze this paragraph':
          prompt = `Analyze this paragraph following Wikipedia guidelines: ${selectedText}`;
          break;
        case 'Optimize for NPOV':
          prompt = `Rewrite this to follow Wikipedia's Neutral Point of View policy: ${selectedText}`;
          break;
        case 'Research this topic':
          prompt = `Provide deeper research on this topic for Wikipedia: ${selectedText}`;
          break;
        default:
          prompt = chipText;
      }
      
      // Set the input value
      const inputElement = document.getElementById('chat-input');
      inputElement.value = prompt;
      
      // Enable send button
      document.getElementById('send-button').disabled = false;
      
      // Focus the input
      inputElement.focus();
    });
  });
}

function setupClearButton() {
  const clearButton = document.getElementById('clear-button');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      const inputElement = document.getElementById('chat-input');
      inputElement.value = '';
      document.getElementById('send-button').disabled = true;
      inputElement.focus();
    });
  } else {
    // Create and insert the clear button if it doesn't exist
    const inputWrapper = document.querySelector('.input-wrapper');
    if (inputWrapper) {
      const clearButton = document.createElement('button');
      clearButton.id = 'clear-button';
      clearButton.className = 'action-button';
      clearButton.title = 'Clear input';
      clearButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
        </svg>
      `;
      
      // Insert at the beginning of the input wrapper
      inputWrapper.insertBefore(clearButton, inputWrapper.firstChild);
      
      // Add event listener
      clearButton.addEventListener('click', () => {
        const inputElement = document.getElementById('chat-input');
        inputElement.value = '';
        document.getElementById('send-button').disabled = true;
        inputElement.focus();
      });
    }
  }
}

function addMessage(role, content) {
  const chatContainer = document.getElementById('chat-container');
  
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';
  
  const messageHeader = document.createElement('div');
  messageHeader.className = `message-header ${role}-header`;
  messageHeader.textContent = role === 'user' ? 'You' : 'Wiki Copilot';
  messageContainer.appendChild(messageHeader);
  
  const message = document.createElement('div');
  message.className = `message ${role}-message`;
  
  // Support for markdown using a simple approach
  // For production, consider using a library like marked.js
  message.innerHTML = formatMessage(content);
  
  messageContainer.appendChild(message);
  chatContainer.appendChild(messageContainer);
}

function formatMessage(content) {
  // Headers
  content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold and italic
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Lists
  content = content.replace(/^\s*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>');
  content = content.replace(/^\s*[\-\*]\s+(.*$)/gim, '<ul><li>$1</li></ul>');
  
  // Fix adjacent list items
  content = content.replace(/<\/ol>\s*<ol>/g, '');
  content = content.replace(/<\/ul>\s*<ul>/g, '');
  
  // Code blocks
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Line breaks
  content = content.replace(/\n/g, '<br>');
  
  return content;
}

function addLoadingIndicator() {
  const chatContainer = document.getElementById('chat-container');
  
  const loadingContainer = document.createElement('div');
  loadingContainer.className = 'loading-indicator';
  loadingContainer.id = 'loading-indicator';
  
  const loadingText = document.createElement('span');
  loadingText.textContent = 'Wiki Copilot is thinking';
  
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'loading-dots';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }
  
  loadingContainer.appendChild(loadingText);
  loadingContainer.appendChild(dotsContainer);
  chatContainer.appendChild(loadingContainer);
  
  scrollToBottom();
}

function removeLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function scrollToBottom() {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.getElementById('close-sidebar-btn').addEventListener('click', () => {
  window.parent.postMessage({ action: 'closeSidebar' }, '*');
});

// Auto-resize textarea as user types
document.getElementById('chat-input').addEventListener('input', function() {
  // Enable/disable send button based on content
  document.getElementById('send-button').disabled = this.value.trim() === '';
  
  // Auto-resize textarea
  this.style.height = 'auto';
  const newHeight = Math.min(this.scrollHeight, 120); // Max height of 120px
  this.style.height = newHeight + 'px';
});

document.getElementById('chat-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (this.value.trim() !== '') {
      sendMessage();
    }
  }
});

document.getElementById('send-button').addEventListener('click', sendMessage);

function sendMessage() {
  const inputElement = document.getElementById('chat-input');
  const message = inputElement.value.trim();
  
  if (message === '') return;
  
  // Add user message to chat
  addMessage('user', message);
  
  // Clear input and reset height
  inputElement.value = '';
  inputElement.style.height = 'auto';
  document.getElementById('send-button').disabled = true;
  
  // Add to chat history
  chatHistory.push({ role: 'user', content: message });
  
  // Show loading indicator
  addLoadingIndicator();
  scrollToBottom();
  
  // Send to Gemini API
  processWithGemini(message, operation);
}

async function processWithGemini(text, operation) {
  try {
    // Send request to background script to handle API call
    chrome.runtime.sendMessage({
      action: 'processWithGemini',
      text: text,
      operation: operation,
      history: chatHistory.slice(0, -1) // Send previous history, excluding the last user message
    }, response => {
      removeLoadingIndicator();
      
      if (response.success) {
        // Add assistant message to chat
        addMessage('assistant', response.result);
        
        // Add to chat history
        chatHistory.push({ role: 'assistant', content: response.result });
      } else {
        // Handle error
        const errorMessage = response.error || 'An error occurred while processing your request';
        addSystemErrorMessage(errorMessage);
      }
      
      scrollToBottom();
    });
  } catch (error) {
    removeLoadingIndicator();
    addSystemErrorMessage('Failed to communicate with Gemini API');
    console.error('Error processing with Gemini:', error);
    scrollToBottom();
  }
}

function addSystemErrorMessage(message) {
  const chatContainer = document.getElementById('chat-container');
  
  const errorMessage = document.createElement('div');
  errorMessage.className = 'system-message error-message';
  errorMessage.textContent = message;
  chatContainer.appendChild(errorMessage);
}

// Initialize autofocus on the input
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('chat-input').focus();
  }, 300);
});