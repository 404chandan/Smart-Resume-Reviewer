const fs = require('fs');
const pdfParse = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');

/**
 * Extract text safely from PDFs.
 * - Tries pdf-parse first.
 * - Falls back to pdf-lib if XRef error occurs.
 */
async function extractText(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    console.log("📄 Extracting text locally using pdf-parse...");

    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("Empty text content");
    }

    console.log("✅ Resume text extracted successfully via pdf-parse.");
    return data.text.trim();
  } catch (err) {
    console.warn("❌ PDF text extraction failed:", err.message);

    try {
      console.log("⚙️ Retrying extraction using pdf-lib fallback...");
      const buffer = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(buffer);
      let textContent = "";

      const pages = pdfDoc.getPages();
      for (const page of pages) {
        textContent += page.getTextContent ? await page.getTextContent() : "";
      }

      if (!textContent || textContent.trim().length === 0) {
        throw new Error("pdf-lib also failed to extract text");
      }

      console.log("✅ Text extracted successfully via pdf-lib fallback.");
      return textContent.trim();
    } catch (fallbackErr) {
      console.error("❌ Fallback also failed:", fallbackErr.message);
      throw new Error("Failed to extract text from PDF.");
    }
  }
}

module.exports = { extractText };
