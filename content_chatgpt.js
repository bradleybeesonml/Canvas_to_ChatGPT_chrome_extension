(function() {
  console.log('[Canvas->ChatGPT] Automatic paste script running.');

  chrome.storage.local.get('canvasContent', ({ canvasContent }) => {
    if (!canvasContent || !canvasContent.text) {
      console.log('[Canvas->ChatGPT] No content found in storage for automatic paste.');
      return;
    }
    
    const now = new Date().getTime();
    const dataAge = now - canvasContent.timestamp;

    if (dataAge > 5 * 60 * 1000) {
      console.log('[Canvas->ChatGPT] Stale content found, not pasting.');
      chrome.storage.local.remove('canvasContent');
      return;
    }

    const textToPaste = canvasContent.text;
    console.log('[Canvas->ChatGPT] Found content to paste automatically.');

    // We'll give the page a moment to fully render before trying to paste
    setTimeout(() => {
      const editableDiv = document.getElementById('prompt-textarea');
      console.log('[Canvas->ChatGPT] Looked for editable element, found:', editableDiv);

      if (editableDiv) {
        console.log('[Canvas->ChatGPT] Pasting content into contenteditable div.');
        
        const sanitizedText = textToPaste.replace(/\u00A0/g, ' ');
        editableDiv.innerText = sanitizedText;

        editableDiv.dispatchEvent(new Event('input', { bubbles: true }));
        editableDiv.focus();
        chrome.storage.local.remove('canvasContent');
      } else {
        console.log('[Canvas->ChatGPT] Automatic paste failed: Editable element not found. The user can try the manual paste button.');
        // Don't alert here, as it can be intrusive. The manual button is the fallback.
      }
    }, 1000); // Wait 1 second before trying to paste
  });
})();
