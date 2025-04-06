document.getElementById('settings-btn').addEventListener('click', () => {
  // In a production extension, this would open the settings page
  chrome.runtime.openOptionsPage();
});

document.getElementById('help-btn').addEventListener('click', () => {
  // Open help documentation in a new tab
  chrome.tabs.create({ url: 'https://example.com/wiki-copilot-help' });
});