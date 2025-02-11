// script.js

let fileInput = document.getElementById("fileInput");
let dropZone = document.getElementById("dropZone");
let fileNameDisplay = document.getElementById("fileName");

// Function to handle file selection
function uploadFile() {
    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        fileNameDisplay.textContent = `Uploaded File: ${file.name}`;
    } else {
        fileNameDisplay.textContent = "No file selected.";
    }
}

// Drag & Drop Event Listeners
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("highlight");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("highlight");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("highlight");

    if (event.dataTransfer.files.length > 0) {
        fileInput.files = event.dataTransfer.files; // Assign dropped file
        uploadFile();
    }
});

// Click on drop zone to open file selector
dropZone.addEventListener("click", () => {
    fileInput.click();
});

// Handle manual file selection
fileInput.addEventListener("change", uploadFile);
