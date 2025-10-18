const fs = require("fs");
const pdfParse = require("pdf-parse");
const PDFParser = require("pdf2json");

/**
 * Extract text from a PDF file with multiple fallback strategies.
 */
async function extractText(filePath) {
  // 1️⃣ Try pdf-parse first
  try {
    console.log("📄 Extracting text locally using pdf-parse...");
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    if (data.text && data.text.trim().length > 0) {
      console.log("✅ Successfully extracted text using pdf-parse.");
      return data.text;
    }
  } catch (err) {
    console.error("❌ pdf-parse failed:", err.message);
  }

  // 2️⃣ Try pdf2json as fallback
  try {
    console.log("⚙️ Retrying extraction using pdf2json...");
    const pdfParser = new PDFParser();

    const text = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        // Extract all text items
        const rawText = pdfData.Pages.map(page =>
          page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" ")
        ).join("\n");
        resolve(rawText);
      });

      pdfParser.loadPDF(filePath);
    });

    if (text && text.trim().length > 0) {
      console.log("✅ Successfully extracted text using pdf2json.");
      return text;
    }
  } catch (err) {
    console.error("❌ pdf2json failed:", err.message);
  }

  // 3️⃣ Final fallback: graceful failure
  throw new Error("Failed to extract text from PDF.");
}

module.exports = { extractText };
