// Variable to store the ID of the last active tab group
let lastGroupId = null;

// Event listener for when a tab is activated (i.e., clicked or switched to)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // Get the currently active tab
    const tab = await chrome.tabs.get(activeInfo.tabId);
    
    // Check if the tab is part of a group
    if (tab.groupId && tab.groupId !== -1) {  // -1 indicates no group
      lastGroupId = tab.groupId;  // Store the group ID as the last active group
    }
  } catch (error) {
    console.error("Error accessing tab info:", error);
  }
});

// Event listener for the keyboard command (Alt+T) to open a new tab in the last group
chrome.commands.onCommand.addListener((command) => {
  if (command === "new_tab_in_group" && lastGroupId !== null) {
    // Create a new tab
    chrome.tabs.create({ active: true }, (newTab) => {
      // Add the new tab to the last active group
      chrome.tabs.group({ tabIds: [newTab.id], groupId: lastGroupId });
    });
  }
});

