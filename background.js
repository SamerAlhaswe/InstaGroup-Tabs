let lastGroupId = null;

// Load the last group ID from storage when the extension initializes
chrome.storage.local.get("lastGroupId", (data) => {
  lastGroupId = data.lastGroupId || null;
});

// Event listener for when a tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    // Check if the tab is part of a group
    if (tab.groupId && tab.groupId !== -1) {
      lastGroupId = tab.groupId;
      // Save the last active group ID to storage
      chrome.storage.local.set({ lastGroupId });
    }
  } catch (error) {
    console.error("Error in onActivated listener:", error);
  }
});

// Event listener for the keyboard command (Alt+T or your set shortcut) to open a new tab in the last group
chrome.commands.onCommand.addListener((command) => {
  if (command === "new_tab_in_group" && lastGroupId !== null) {
    chrome.tabs.create({ active: true }, (newTab) => {
      if (!chrome.runtime.lastError) {
        chrome.tabs.group({ tabIds: [newTab.id], groupId: lastGroupId });
      }
    });
  }
});
