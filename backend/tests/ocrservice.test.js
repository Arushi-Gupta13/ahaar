const scanReceipt = require('../services/ocrservice');
const path = require('path');

describe('scanReceipt', () => {
    it('should return text from a receipt image', async () => {
        // Provide a sample image path for testing (ensure you have an actual image to test)
        const imagePath = path.join(__dirname, 'backend/image.png');

        const text = await scanReceipt(imagePath);

        expect(text).toBeDefined(); // Check that the text is not undefined
        expect(typeof text).toBe('string'); // Ensure the result is a string
        // You can add more checks based on the expected output
    });

    it('should throw an error if OCR fails', async () => {
        // Provide an invalid path to simulate an error
        const invalidImagePath = path.join(__dirname, 'invalid-image.png');

        await expect(scanReceipt(invalidImagePath)).rejects.toThrowError();
    });
});
