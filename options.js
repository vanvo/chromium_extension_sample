document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const saveButton = document.getElementById("saveBtn");
    const statusDiv = document.getElementById("status");
  
    // Lấy dữ liệu từ chrome.storage
    chrome.storage.local.get(["username"], (result) => {
      if (result.username) {
        usernameInput.value = result.username;
        console.log(`Name2 "${result.username}" has loaded`);
      }
    });
  
    // Lưu dữ liệu vào chrome.storage
    saveButton.addEventListener("click", () => {
      const username = usernameInput.value.trim();
      chrome.storage.local.set({ username }, () => {
        statusDiv.textContent = "Settings saved!";
        setTimeout(() => {
          statusDiv.textContent = "";
        }, 2000);
      });
    });
  });