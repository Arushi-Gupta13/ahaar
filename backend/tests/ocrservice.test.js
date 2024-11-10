const { scanReceipt, parseReceiptText, estimateExpiryDate } = require('../services/ocrservice');
const Tesseract = require('tesseract.js');
const path = require('path');

// Mock Tesseract.js
jest.mock('tesseract.js', () => ({
    recognize: jest.fn()
}));

describe('Receipt Scanner', () => {
    // Sample receipt text for testing
    const sampleReceiptText = `
        GROCERY STORE
        123 Main St
        Date: 2024-03-15
        
        Milk 2L          $3.99
        Bread            $2.50
        Fresh Apples     $4.99
        Chicken Breast   $8.99
        ------------------------
        Total:          $20.47
    `;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Setup default Tesseract mock response
        Tesseract.recognize.mockResolvedValue({
            data: { text: sampleReceiptText }
        });
    });

    describe('scanReceipt', () => {
        it('should successfully scan and parse a receipt image', async () => {
            const imagePath = path.join(__dirname, 'backend/tests/receipt.png');
            const result = await scanReceipt(imagePath);

            expect(result).toBeDefined();
            expect(result.items).toBeInstanceOf(Array);
            expect(result.rawText).toBe(sampleReceiptText);
            expect(result.scannedAt).toBeInstanceOf(Date);
        });

        it('should throw an error for invalid image path', async () => {
            Tesseract.recognize.mockRejectedValue(new Error('Invalid image'));
            const invalidPath = path.join(__dirname, 'non-existent.jpg');

            await expect(scanReceipt(invalidPath))
                .rejects
                .toThrow('Invalid image');
        });

        it('should properly parse items with their prices', async () => {
            const result = await scanReceipt('backend/tests/receipt.png');
            
            expect(result.items).toContainEqual(
                expect.objectContaining({
                    name: 'Milk 2L',
                    price: 3.99,
                    quantity: 1
                })
            );
        });
    });

    describe('parseReceiptText', () => {
        it('should extract items and prices correctly', () => {
            const items = parseReceiptText(sampleReceiptText);

            expect(items).toHaveLength(4); // Excluding the total
            expect(items[0]).toEqual(
                expect.objectContaining({
                    name: 'Milk 2L',
                    price: 3.99,
                    quantity: 1
                })
            );
        });

        it('should include purchase date and estimated expiry date', () => {
            const items = parseReceiptText(sampleReceiptText);

            items.forEach(item => {
                expect(item.purchaseDate).toBeInstanceOf(Date);
                expect(item.estimatedExpiryDate).toBeInstanceOf(Date);
                expect(item.estimatedExpiryDate > item.purchaseDate).toBe(true);
            });
        });

        it('should handle various price formats', () => {
            const textWithDifferentFormats = `
                Item1 - $10.99
                Item2 $20.50
                Item3: $30.00
                Item4 40.99
            `;

            const items = parseReceiptText(textWithDifferentFormats);
            expect(items).toHaveLength(4);
            expect(items.map(item => item.price))
                .toEqual([10.99, 20.50, 30.00, 40.99]);
        });
    });

    describe('estimateExpiryDate', () => {
        const purchaseDate = new Date('2024-03-15');

        it('should estimate correct expiry dates for different categories', () => {
            const tests = [
                { item: 'Milk 2L', expectedDays: 14 }, // DAIRY
                { item: 'Fresh Apples', expectedDays: 7 }, // PRODUCE
                { item: 'Chicken Breast', expectedDays: 5 }, // MEAT
                { item: 'White Bread', expectedDays: 7 }, // BAKERY
                { item: 'Canned Beans', expectedDays: 365 }, // PANTRY
                { item: 'Unknown Item', expectedDays: 30 }, // DEFAULT
            ];

            tests.forEach(({ item, expectedDays }) => {
                const expiryDate = estimateExpiryDate(item, purchaseDate);
                const daysDifference = Math.round(
                    (expiryDate - purchaseDate) / (1000 * 60 * 60 * 24)
                );
                expect(daysDifference).toBe(expectedDays);
            });
        });
    });

    describe('Integration', () => {
        it('should process a complete receipt correctly', async () => {
            const result = await scanReceipt('test-receipt.jpg');

            expect(result).toEqual(
                expect.objectContaining({
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            name: expect.any(String),
                            price: expect.any(Number),
                            quantity: expect.any(Number),
                            purchaseDate: expect.any(Date),
                            estimatedExpiryDate: expect.any(Date)
                        })
                    ]),
                    rawText: expect.any(String),
                    scannedAt: expect.any(Date)
                })
            );
        });
    });
});