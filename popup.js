document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-to-chatgpt');
  const messageEl = document.getElementById('message');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;

    console.log("Popup saw URL:", url);

    if (url && url.includes('instructure.com')) {
      // We are on a Canvas page
      sendButton.textContent = 'Send to ChatGPT';
      sendButton.disabled = false;
      messageEl.textContent = 'Ready to send this page to ChatGPT.';
      sendButton.onclick = handleSendToChatGPT;

    } else if (url && (url.includes('chat.openai.com') || url.includes('chatgpt.com'))) {
      // We are on a ChatGPT page
      chrome.storage.local.get('canvasContent', ({ canvasContent }) => {
        if (canvasContent && canvasContent.text) {
          const now = new Date().getTime();
          const dataAge = now - canvasContent.timestamp;
          if (dataAge < 5 * 60 * 1000) { // 5-minute validity
            sendButton.textContent = 'Paste Canvas Content';
            sendButton.disabled = false;
            messageEl.textContent = 'Click to paste the content from Canvas.';
            sendButton.onclick = handlePasteToChatGPT;
          } else {
            sendButton.textContent = 'No Content Found';
            sendButton.disabled = true;
            messageEl.textContent = 'Canvas content has expired. Please go back to Canvas and try again.';
          }
        } else {
          sendButton.textContent = 'No Content Found';
          sendButton.disabled = true;
          messageEl.textContent = 'Go to a Canvas page and send its content first.';
        }
      });
    } else {
      // We are on some other page
      sendButton.disabled = true;
      messageEl.textContent = 'Navigate to a Canvas page to use this extension.';
    }
  });
});

function handleSendToChatGPT() {
  const sendButton = document.getElementById('send-to-chatgpt');
  const messageEl = document.getElementById('message');
  sendButton.disabled = true;
  messageEl.textContent = 'Extracting content...';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: extractCanvasContent,
    });
  });
}

function handlePasteToChatGPT() {
  const sendButton = document.getElementById('send-to-chatgpt');
  const messageEl = document.getElementById('message');
  sendButton.disabled = true;
  messageEl.textContent = 'Pasting...';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: injectPasteLogic,
    }, () => {
      // After script is injected, we can close the popup
      window.close();
    });
  });
}

function injectPasteLogic() {
  console.log('[Canvas->ChatGPT] Paste script running.');

  chrome.storage.local.get('canvasContent', ({ canvasContent }) => {
    if (!canvasContent || !canvasContent.text) {
      console.log('[Canvas->ChatGPT] No content found in storage.');
      return;
    }

    const textToPaste = canvasContent.text;
    console.log('[Canvas->ChatGPT] Found content to paste.');

    const editableDiv = document.getElementById('prompt-textarea');
    console.log('[Canvas->ChatGPT] Looked for editable element, found:', editableDiv);

    if (editableDiv) {
      console.log('[Canvas->ChatGPT] Pasting content into contenteditable div.');
      
      // For contenteditable divs, we set innerText, not value.
      editableDiv.innerText = textToPaste;
      
      // We still need to dispatch an input event for the web app's framework (like React) to notice the change.
      editableDiv.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Focus the element.
      editableDiv.focus();
      
      // The app should handle resizing automatically, so we can remove the manual height adjustment.
      
      // Clear storage on success
      chrome.storage.local.remove('canvasContent');
    } else {
      console.log('[Canvas->ChatGPT] Editable element not found. Fallback: Copying to clipboard and alerting user.');
      // Fallback if the element isn't found
      navigator.clipboard.writeText(textToPaste).then(() => {
        alert('ChatGPT has changed its layout. Could not find the text box, but the Canvas content has been copied to your clipboard. Please paste it manually.');
      }).catch(err => {
        console.error('[Canvas->ChatGPT] Could not copy to clipboard:', err);
        alert('ChatGPT has changed its layout, and we could not automatically copy the content to your clipboard. Please try again from Canvas.');
      }).finally(() => {
        // Clear storage after fallback
        chrome.storage.local.remove('canvasContent');
      });
    }
  });
}

function extractCanvasContent() {
  console.log("Executing NEW version of content script from popup.js");
  
  function extractContent() {
    const mainContentSelectors = [
      'main',
      '#content',
      '.course-body',
      'article',
    ];

    let contentElement = null;
    for (const selector of mainContentSelectors) {
      contentElement = document.querySelector(selector);
      if (contentElement) break;
    }
    if (!contentElement) contentElement = document.body;

    // Create a clone of the content element to avoid modifying the live page.
    const clone = contentElement.cloneNode(true);

    // Replace <br> tags with newline characters for manual line breaks.
    clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));

    // Add two newlines after block-level elements to create paragraph breaks.
    clone.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, pre').forEach(el => el.append('\n\n'));
    
    // For list items, prepend a bullet point and add a single newline.
    clone.querySelectorAll('li').forEach(li => {
      li.prepend('* ');
      li.append('\n');
    });

    // Now, get the text content, which includes our added formatting.
    let contentText = clone.innerText;

    // Clean up excessive whitespace.
    // 1. Collapse any sequence of 3 or more newlines into just two. This standardizes paragraph breaks.
    contentText = contentText.replace(/(\r\n|\n|\r){3,}/g, '\n\n');
    // 2. Trim leading/trailing whitespace from the final text.
    contentText = contentText.trim();

    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const structuredContent = `Context from Canvas Page:\nURL: ${pageUrl}\nTitle: ${pageTitle}\n\n---\n\n${contentText}`;
    
    return structuredContent;
  }

  const content = extractContent();
  console.log('Canvas content extracted:', content);
  chrome.runtime.sendMessage({ action: 'processCanvasContent', data: content });
}
