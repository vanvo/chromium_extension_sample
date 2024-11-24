document.addEventListener("DOMContentLoaded", () => {
    const rowsContainer = document.getElementById("rowsContainer");
    const addRowBtn = document.getElementById("addRowBtn");
    const saveBtn = document.getElementById("saveBtn");
    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const importInput = document.getElementById("importInput");
    const statusDiv = document.getElementById("status");
  
    // Tạo một hàng mới
    function createRow(value = "") {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
  
      const input = document.createElement("input");
      input.type = "text";
      input.value = value;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => {
        rowDiv.remove();
      });
  
      rowDiv.appendChild(input);
      rowDiv.appendChild(deleteBtn);
      rowsContainer.appendChild(rowDiv);
    }
  
    // Lấy dữ liệu từ storage và hiển thị các hàng
    chrome.storage.local.get("names", (result) => {
      const names = result.names || [];
      names.forEach((name) => createRow(name));
    });
  
    // Thêm một hàng mới khi nhấn nút +
    addRowBtn.addEventListener("click", () => {
      createRow();
    });
  
    // Lưu dữ liệu vào storage khi nhấn Save
    saveBtn.addEventListener("click", () => {
      const rows = document.querySelectorAll(".row input");
      const names = Array.from(rows).map((row) => row.value.trim()).filter((name) => name);
  
      chrome.storage.local.set({ names }, () => {
        statusDiv.textContent = "Settings saved!";
        setTimeout(() => (statusDiv.textContent = ""), 2000);
      });
    });
  
    // Export dữ liệu ra file JSON
    exportBtn.addEventListener("click", () => {
      chrome.storage.local.get("names", (result) => {
        const data = result.names || [];
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement("a");
        a.href = url;
        a.download = "settings.json";
        a.click();
  
        URL.revokeObjectURL(url);
      });
    });
  
    // Import dữ liệu từ file JSON
    importBtn.addEventListener("click", () => {
      importInput.click(); // Mở hộp thoại chọn file
    });
  
    importInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            // Xóa tất cả các hàng hiện tại
            rowsContainer.innerHTML = "";
  
            // Tạo lại các hàng từ file JSON
            data.forEach((name) => createRow(name));
  
            // Lưu vào storage
            chrome.storage.local.set({ names: data }, () => {
              statusDiv.textContent = "Settings imported successfully!";
              setTimeout(() => (statusDiv.textContent = ""), 2000);
            });
          } else {
            throw new Error("Invalid JSON format");
          }
        } catch (error) {
          statusDiv.textContent = "Error importing settings: Invalid JSON file.";
          setTimeout(() => (statusDiv.textContent = ""), 2000);
          console.error(error);
        }
      };
      reader.readAsText(file);
    });
  });