import { trpcClient } from './lib/trpc'; // Import our raw tRPC client

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-bookie',
    title: 'Save to Bookie',
    contexts: ['page', 'link', 'selection'],
  });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-to-bookie' && tab) {
    const url = info.linkUrl || info.pageUrl;
    const title = info.selectionText || tab.title || 'Untitled';

    if (!url) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Save Failed',
        message: 'Could not determine the URL to save.',
      });
      return;
    }

    try {
      // Use the tRPC client directly from the background script
      const savedBookmark = await trpcClient.bookmarks.create.mutate({
        url,
        title,
      });

      chrome.notifications.create({
        type: 'basic',
        iconUrl: savedBookmark.favicon || 'icons/icon48.png',
        title: 'Bookmark Saved!',
        message: `Saved "${savedBookmark.title}"`,
      });
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      if (error?.data?.code === 'UNAUTHORIZED') {
        errorMessage =
          'You are not logged in. Please log in via the popup first.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Save Failed',
        message: errorMessage,
      });
    }
  }
});
