// script.js
function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let fileNameDisplay = document.getElementById("fileName");

    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        fileNameDisplay.textContent = `Uploaded File: ${file.name}`;
    } else {
        fileNameDisplay.textContent = "No file selected.";
    }
}
