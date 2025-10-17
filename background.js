chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processCanvasContent') {
    console.log('Background script received content:', request.data);

    chrome.storage.local.set({ 
        canvasContent: { 
            text: request.data,
            timestamp: new Date().getTime()
        }
    }, () => {
      // Create the tab
      chrome.tabs.create({ url: 'https://chatgpt.com/' }, (newTab) => {
        // Add a listener to inject the script only when the tab is fully loaded
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === newTab.id && changeInfo.status === 'complete') {
            console.log('[Canvas->ChatGPT] ChatGPT tab loaded. Injecting paste script.');
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              files: ['content_chatgpt.js'],
            });
            // Remove the listener to avoid it firing multiple times
            chrome.tabs.onUpdated.removeListener(listener);
          }
        });
      });
    });
  }
});

// Clean up old data from storage on startup and when a new window is created
chrome.runtime.onStartup.addListener(cleanupStorage);
chrome.windows.onCreated.addListener(cleanupStorage);

function cleanupStorage() {
    chrome.storage.local.get('canvasContent', ({ canvasContent }) => {
        if (canvasContent) {
            const now = new Date().getTime();
            const dataAge = now - canvasContent.timestamp; // age in milliseconds
            // If data is more than 5 minutes old, clear it.
            if (dataAge > 5 * 60 * 1000) {
                chrome.storage.local.remove('canvasContent', () => {
                    console.log('Cleaned up old Canvas content from storage.');
                });
            }
        }
    });
}
