chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });
  
  // Tự động kiểm tra cập nhật từ GitHub
  chrome.runtime.onUpdateAvailable.addListener((details) => {
    console.log("Update available: ", details.version);
    chrome.runtime.reload();
  });

  const CHECK_INTERVAL = 30 * 1000; // 60 phút

// Kiểm tra cập nhật khi trình duyệt khởi động
chrome.runtime.onStartup.addListener(() => {
  console.log("Kiểm tra cập nhật khi trình duyệt khởi động...");
  checkAndStoreUpdateStatus();
});

// Đặt báo thức kiểm tra định kỳ
chrome.alarms.create("checkForUpdate", { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkForUpdate") {
    console.log("Kiểm tra cập nhật định kỳ...");
    checkAndStoreUpdateStatus();
  }
});

// Hàm kiểm tra phiên bản mới và lưu vào storage
async function checkAndStoreUpdateStatus() {
  const updateUrl = "https://raw.githubusercontent.com/vanvo/chromium_extension_sample/refs/heads/main/updates.json";

  try {
    const response = await fetch(updateUrl);
    if (!response.ok) throw new Error("Không thể lấy thông tin cập nhật.");
    const updateData = await response.json();

    const currentVersion = chrome.runtime.getManifest().version;
    const isNewVersion = compareVersions(updateData.version, currentVersion);

    // Lưu trạng thái cập nhật vào storage
    chrome.storage.local.set({ updateAvailable: isNewVersion ? updateData : null });
  } catch (error) {
    console.error("Lỗi khi kiểm tra cập nhật:", error);
  }
}

// Hàm so sánh phiên bản
function compareVersions(newVersion, currentVersion) {
  const newParts = newVersion.split(".").map(Number);
  const currentParts = currentVersion.split(".").map(Number);

  for (let i = 0; i < newParts.length; i++) {
    if ((newParts[i] || 0) > (currentParts[i] || 0)) return true;
    if ((newParts[i] || 0) < (currentParts[i] || 0)) return false;
  }

  return false;
}