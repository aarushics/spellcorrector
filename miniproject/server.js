require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// LanguageTool API URL
const LT_API_URL = "https://api.languagetool.org/v2/check";

// Function to send text to LanguageTool API
const checkGrammar = async (text) => {
  try {
    const response = await axios.post(
      LT_API_URL,
      new URLSearchParams({ language: "en-US", text })
    );
    return response.data;
  } catch (error) {
    console.error("Error connecting to LanguageTool API", error);
    return { error: "LanguageTool API error" };
  }
};

// Function to extract text from different file formats
const extractText = async (filePath, fileType) => {
  if (fileType === "application/pdf") {
    const data = await pdfParse(fs.readFileSync(filePath));
    return data.text;
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  } else if (fileType.startsWith("text/")) {
    return fs.readFileSync(filePath, "utf8");
  }
  return null;
};

// Route to upload and check grammar
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  try {
    const fileText = await extractText(filePath, fileType);
    if (!fileText) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const result = await checkGrammar(fileText);
    fs.unlinkSync(filePath); // Delete temp file

    res.json({ filename: req.file.originalname, grammarCheck: result });
  } catch (error) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: "Error processing file" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
