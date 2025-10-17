# Privacy Policy for Canvas to ChatGPT

**Last updated: October 17, 2025**

This Privacy Policy describes how the "Canvas to ChatGPT" Chrome Extension (the "Extension") handles your information when you use it.

## Information We Collect

The Extension does **not** collect, store, or transmit any personal information, browsing history, or user data to our servers. We do not have servers for this extension.

## How the Extension Works

The sole purpose of the Extension is to facilitate the transfer of text from a Canvas web page to a ChatGPT web page. Here is a breakdown of how it handles data:

1.  **Reading Canvas Content:** When you are on a web page hosted on `instructure.com` and you click the "Send to ChatGPT" button, the Extension reads the visible text content from that single, active page. This action is initiated entirely by you.

2.  **Temporary Storage:** The extracted text is stored *temporarily* and *locally* on your computer using the `chrome.storage.local` API. This data is not transmitted over the network and is only accessible by the Extension on your computer. This data is designed to be cleared after a short period (5 minutes) or once it has been successfully used.

3.  **Pasting into ChatGPT:** The Extension opens a new tab to `chatgpt.com` or `chat.openai.com`. A script then retrieves the text from local storage and pastes it into the chat input box on that page. Once the text is pasted, it is handled by OpenAI's services according to their own privacy policy. The Extension does not monitor or record your interactions with ChatGPT.

## Permissions

The Extension requires the following permissions to function:
*   `activeTab` / `scripting`: To allow the script to run on the active page to extract content when you click the extension button.
*   `tabs`: To identify if you are on a Canvas or ChatGPT page to provide the correct button in the popup.
*   `storage`: To temporarily store the Canvas content on your local machine before it is pasted.
*   `host_permissions`: To enable the automatic pasting functionality on `chatgpt.com`.

## Data Security

All data handling is done locally on your device. We do not have access to your Canvas account, your OpenAI account, or any of the text you process with the Extension.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at bbeeson1 (at) byu dot edu.
