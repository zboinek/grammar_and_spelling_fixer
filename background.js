chrome.commands.onCommand.addListener(function (command) {
  if (command === "my_shortcut_command") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getSelectedText,
      });
    });
  }
});

function getSelectedText() {
  const selectedText = window.getSelection().toString();
  chrome.storage.local.set({ selectedText: selectedText }, function () {
    chrome.runtime.sendMessage({ action: "openPopup" });
  });
}
