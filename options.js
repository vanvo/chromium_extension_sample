document.addEventListener("DOMContentLoaded", () => {
    const rowsContainer = document.getElementById("rowsContainer");
    const addRowBtn = document.getElementById("addRowBtn");
    const saveBtn = document.getElementById("saveBtn");
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
  });