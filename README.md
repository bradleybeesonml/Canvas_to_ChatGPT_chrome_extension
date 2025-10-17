# Canvas to ChatGPT Chrome Extension

This Chrome extension helps you quickly send content from a Canvas page to ChatGPT for analysis or homework help.

## How it Works

1.  Navigate to a page on Canvas (like an assignment, announcement, or article).
2.  Click the extension icon in your browser toolbar.
3.  Click the "Send to ChatGPT" button.
4.  A new tab will open to `chat.openai.com`, and the extension will attempt to paste the content of the Canvas page into the chat input box.
5.  The pasted text is structured to include the original page's title and URL for context.
6.  If the extension cannot find the chat input box on the ChatGPT website, a popup will appear with the content, allowing you to manually copy and paste it.

## Installation (for Development)

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" by toggling the switch in the top-right corner.
4.  Click the "Load unpacked" button that appears.
5.  Select the directory where you saved this project.
6.  The extension should now be installed and visible in your browser's toolbar!


## Debugging

If the extension isn't working as expected, you can use Chrome's Developer Tools to debug it. Each part of the extension has its own console.

1.  **Reload the extension:** After making code changes, go to `chrome://extensions` and click the "reload" button for the "Canvas to ChatGPT" extension.
2.  **Check the Canvas Page Console:**
    *   Navigate to a Canvas page.
    *   Open the Developer Tools (Right-click on the page -> `Inspect`).
    *   Click the "Console" tab.
    *   You should see a "Canvas content extracted:" message after you click the "Send to ChatGPT" button in the extension popup.
3.  **Check the Background Script (Service Worker) Console:**
    *   Go to `chrome://extensions`.
    *   Find the "Canvas to ChatGPT" extension and click the `Service Worker` link. This will open a new DevTools window.
    *   In its "Console" tab, you should see a "Background script received content:" message after the content is extracted.
4.  **Check the ChatGPT Page Console:**
    *   After the ChatGPT tab opens, open its Developer Tools (`Inspect` -> `Console`).
    *   You should see messages like "ChatGPT content script loaded," "Retrieved from storage," and "Attempting to paste." This will tell you if the script is running and what data it found.
