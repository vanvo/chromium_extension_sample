document.getElementById('apiForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('inputName').value;
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = "Loading...";
  
    try {
      const response = await fetch(`https://api.agify.io/?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      responseContainer.innerHTML = `
        <p>Estimated Age: ${data.age}</p>
        <p>Count: ${data.count}</p>
      `;
      
      console.log("Response data");
      console.log(data);
    } catch (error) {
      responseContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });

  document.getElementById("settingsBtn").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  document.addEventListener("DOMContentLoaded", async () => {
    const currentVersion = chrome.runtime.getManifest().version;
    const responseContainer = document.getElementById("responseContainer");
    const inputName = document.getElementById("inputName"); // Lấy input name
    
  
    // Hiển thị phiên bản hiện tại
    // responseContainer.innerHTML = `Phiên bản hiện tại: ${currentVersion}`;
  
    // Kiểm tra cập nhật
    const updateInfo = await checkForUpdate();
  
    if (updateInfo) {
      const updateLink = document.createElement("a");
      updateLink.href = updateInfo.update_url;
      updateLink.target = "_blank";
      updateLink.textContent = `Đã có phiên bản mới: ${updateInfo.version}`; // Hiển thị số phiên bản mới
      updateLink.style.display = "block";
      updateLink.style.marginTop = "10px";
      updateLink.style.color = "blue";
      responseContainer.appendChild(updateLink); // Chèn link vào responseContainer
    }

    // Lấy giá trị `name` từ local storage và hiển thị trong input
  chrome.storage.local.get(["username"], (result) => {
    if (result.username) {
      inputName.value = result.username; // Hiển thị giá trị lưu trữ
      console.log(`Name "${result.username}" has loaded`);
    }
  });

  // Lưu giá trị `name` khi người dùng nhập
  inputName.addEventListener("change", () => {
    const name = inputName.value.trim();
    chrome.storage.local.set({ username: name }, () => {
      console.log(`Name "${name}" has been saved.`);
    });
  });
  });
  
  // Hàm kiểm tra phiên bản mới
  async function checkForUpdate() {
    const updateUrl = "https://raw.githubusercontent.com/vanvo/chromium_extension_sample/refs/heads/main/updates.json";
  
    try {
      const response = await fetch(updateUrl);
      if (!response.ok) throw new Error("Không thể lấy thông tin cập nhật.");
      const updateData = await response.json();
  
      const currentVersion = chrome.runtime.getManifest().version;
      if (compareVersions(updateData.version, currentVersion)) {
        return updateData; // Có phiên bản mới
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra cập nhật:", error);
    }
  
    return null; // Không có phiên bản mới
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