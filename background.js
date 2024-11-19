chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  // Tự động kiểm tra cập nhật từ GitHub
  chrome.runtime.onUpdateAvailable.addListener((details) => {
    console.log("Update available: ", details.version);
    chrome.runtime.reload();
  });