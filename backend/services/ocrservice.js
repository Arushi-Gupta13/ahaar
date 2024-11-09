const Tesseract = require('tesseract.js');

// Function to parse raw text into structured data
function parseReceiptText(text) {
    const lines = text.split('\n');
    const items = [];

    lines.forEach(line => {
        // Simple regex to match "item name - price" or "item name price"
        const match = line.match(/(.+)\s+(\d+\.\d{2})$/);
        if (match) {
            const name = match[1].trim();
            const price = parseFloat(match[2]);
            items.push({ name, price, quantity: 1 }); // Default quantity as 1 for now
        }
    });

    return items;
}

async function scanReceipt(imagePath) {
    try {
        const result = await Tesseract.recognize(imagePath, 'eng', {
            logger: (m) => console.log(m),
        });
        const rawText = result.data.text;
        const items = parseReceiptText(rawText);
        return items;
    } catch (error) {
        console.error("Error during OCR:", error);
        throw error;
    }
}

module.exports = scanReceipt;
