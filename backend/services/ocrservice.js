const Tesseract = require('tesseract.js');

// Define common product categories and their typical shelf life in days
const SHELF_LIFE = {
    DAIRY: {
        pattern: /(milk|yogurt|cheese|cream|butter)/i,
        days: 14
    },
    PRODUCE: {
        pattern: /(apple|banana|lettuce|tomato|vegetable|fruit)/i,
        days: 7
    },
    MEAT: {
        pattern: /(chicken|beef|pork|fish|meat)/i,
        days: 5
    },
    BAKERY: {
        pattern: /(bread|muffin|pastry|cake)/i,
        days: 7
    },
    PANTRY: {
        pattern: /(cereal|pasta|rice|canned)/i,
        days: 365
    }
};

function parsePurchaseDate(text) {
    const datePatterns = [
        /(\d{2})\/(\d{2})\/(\d{4})/,
        /(\d{4})-(\d{2})-(\d{2})/,
        /(\d{2})-(\d{2})-(\d{4})/
    ];
    
    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            return new Date(match[0]);
        }
    }
    
    return new Date();
}

function estimateExpiryDate(itemName, purchaseDate) {
    let shelfLifeDays = 30; // Default shelf life
    
    for (const [category, info] of Object.entries(SHELF_LIFE)) {
        if (info.pattern.test(itemName)) {
            shelfLifeDays = info.days;
            break;
        }
    }
    
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
    return expiryDate;
}

function parseReceiptText(text) {
    const lines = text.split('\n');
    const items = [];
    const purchaseDate = parsePurchaseDate(text);
    
    lines.forEach(line => {
        // Skip empty lines and lines containing total
        if (!line.trim() || /total[:]*\s*[$]*\s*\d+\.\d{2}/i.test(line)) {
            return;
        }
        
        // Enhanced regex to match various price formats
        const match = line.match(/(.+?)\s*(?:-?\s*|\$?\s*)(\d+\.\d{2})\s*$/);
        if (match) {
            const name = match[1].trim();
            const price = parseFloat(match[2]);
            
            // Additional check to skip total lines that might be formatted differently
            if (!/total/i.test(name)) {
                const expiryDate = estimateExpiryDate(name, purchaseDate);
                
                items.push({
                    name,
                    price,
                    quantity: 1,
                    purchaseDate,
                    estimatedExpiryDate: expiryDate
                });
            }
        }
    });
    
    return items;
}

async function scanReceipt(imagePath) {
    try {
        const result = await Tesseract.recognize(imagePath, 'eng', {
            logger: m => console.log(m)
        });
        
        const rawText = result.data.text;
        const items = parseReceiptText(rawText);
        
        return {
            items,
            rawText,
            scannedAt: new Date()
        };
    } catch (error) {
        console.error("Error during OCR:", error);
        throw error;
    }
}

module.exports = {
    scanReceipt,
    parseReceiptText,
    estimateExpiryDate
};