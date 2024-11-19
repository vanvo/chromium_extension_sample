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
    } catch (error) {
      responseContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });