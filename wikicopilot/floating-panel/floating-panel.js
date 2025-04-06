let selectedText = '';
let operation = '';

window.addEventListener('message', event => {
  if (event.data.action === 'initialize') {
    selectedText = event.data.selectedText;
    operation = event.data.operation;
    
    const operationLabel = document.getElementById('operation-label');
    const contentContainer = document.getElementById('content-container');
    
    contentContainer.classList.add('analyzing', 'gradient-border');
    
    switch (operation) {
      case 'analyze':
        operationLabel.textContent = 'Wikipedia Content Analysis';
        document.querySelector('.loading-text').textContent = 'Analyzing content against Wikipedia guidelines';
        break;
      case 'optimize':
        operationLabel.textContent = 'Wikipedia Content Optimization';
        document.querySelector('.loading-text').textContent = 'Optimizing content for Wikipedia format';
        break;
      case 'research':
        operationLabel.textContent = 'Deep Research';
        document.querySelector('.loading-text').textContent = 'Researching topic in depth';
        break;
      default:
        operationLabel.textContent = 'Processing Content';
        document.querySelector('.loading-text').textContent = 'Processing with AI';
    }
  }
  
  if (event.data.action === 'updateContent') {
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultContent = document.getElementById('result-content');
    const contentContainer = document.getElementById('content-container');
    
    contentContainer.classList.remove('analyzing', 'gradient-border');
    
    loadingSpinner.style.display = 'none';
    resultContent.style.display = 'block';
    
    resultContent.innerHTML = formatContent(event.data.content);
  }
});

function formatContent(content) {
  content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/__(.*?)__/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  content = content.replace(/_(.*?)_/g, '<em>$1</em>');
  content = content.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  content = content.replace(/^\s*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>');
  content = content.replace(/^\s*[\-\*\+]\s+(.*$)/gim, '<ul><li>$1</li></ul>');
  
  content = content.replace(/<\/ol>\s*<ol>/g, '');
  content = content.replace(/<\/ul>\s*<ul>/g, '');
  
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  content = content.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">');
  content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  content = content.replace(/^>(.*$)/gim, '<blockquote>$1</blockquote>');
  content = content.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');
  
  content = content.replace(/^-{3,}/gm, '<hr>');
  content = content.replace(/^_{3,}/gm, '<hr>');
  content = content.replace(/^\*{3,}/gm, '<hr>');
  
  content = content.replace(/\n\n/g, '</p><p>');
  content = content.replace(/\n/g, '<br>');
  
  if (!content.startsWith('<h') && !content.startsWith('<p') && 
      !content.startsWith('<ul') && !content.startsWith('<ol') && 
      !content.startsWith('<blockquote') && !content.startsWith('<hr')) {
    content = '<p>' + content;
  }
  
  if (!content.endsWith('</p>') && !content.endsWith('</h1>') && 
      !content.endsWith('</h2>') && !content.endsWith('</h3>') && 
      !content.endsWith('</ul>') && !content.endsWith('</ol>') && 
      !content.endsWith('</blockquote>')) {
    content = content + '</p>';
  }
  
  const wrapperClass = operation === 'analyze' ? 'analysis-result' : 
                       operation === 'optimize' ? 'optimized-content' : 
                       operation === 'research' ? 'research-result' : 
                       'default-result';
  
  return `<div class="${wrapperClass}">${content}</div>`;
}

document.getElementById('close-panel-btn').addEventListener('click', () => {
  window.parent.postMessage({ action: 'closeFloatingPanel' }, '*');
});

document.getElementById('open-sidebar-btn').addEventListener('click', () => {
  window.parent.postMessage({ action: 'openInSidebar' }, '*');
  window.parent.postMessage({ action: 'closeFloatingPanel' }, '*');
});

const panelHeader = document.getElementById('panel-header');
panelHeader.addEventListener('mousedown', initDrag);

function initDrag(e) {
  e.preventDefault();
  window.parent.postMessage({ 
    action: 'startDrag', 
    initialX: e.clientX, 
    initialY: e.clientY 
  }, '*');
  
  document.addEventListener('mouseup', stopDrag);
}

function stopDrag() {
  document.removeEventListener('mouseup', stopDrag);
  window.parent.postMessage({ action: 'stopDrag' }, '*');
}