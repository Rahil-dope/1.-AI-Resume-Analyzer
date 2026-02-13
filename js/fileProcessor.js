/**
 * File Processor Module
 * Handles PDF and DOCX file validation and text extraction
 */

const FileProcessor = {
    // Maximum file size in MB
    MAX_FILE_SIZE_MB: 5,
    
    // Supported file types
    SUPPORTED_TYPES: {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    },

    /**
     * Validate file type and size
     * @param {File} file - File object from input
     * @returns {Object} - { valid: boolean, error: string }
     */
    validateFile(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        // Check file type
        if (!this.SUPPORTED_TYPES[file.type]) {
            return { 
                valid: false, 
                error: 'Unsupported file type. Please upload a PDF or DOCX file.' 
            };
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > this.MAX_FILE_SIZE_MB) {
            return { 
                valid: false, 
                error: `File too large. Maximum size is ${this.MAX_FILE_SIZE_MB}MB.` 
            };
        }

        return { valid: true, error: null };
    },

    /**
     * Extract text from PDF file using PDF.js
     * @param {File} file - PDF file object
     * @returns {Promise<string>} - Extracted text content
     */
    async extractTextFromPDF(file) {
        try {
            // Configure PDF.js worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = 
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            
            // Extract text from each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }

            return fullText.trim();
        } catch (error) {
            console.error('PDF extraction error:', error);
            throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
        }
    },

    /**
     * Extract text from DOCX file using Mammoth.js
     * @param {File} file - DOCX file object
     * @returns {Promise<string>} - Extracted text content
     */
    async extractTextFromDOCX(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            
            if (!result.value || result.value.trim().length === 0) {
                throw new Error('No text content found in DOCX file');
            }

            return result.value.trim();
        } catch (error) {
            console.error('DOCX extraction error:', error);
            throw new Error('Failed to extract text from DOCX. Please ensure the file is not corrupted.');
        }
    },

    /**
     * Main processing function - validates file and extracts text
     * @param {File} file - Resume file (PDF or DOCX)
     * @returns {Promise<Object>} - { success: boolean, text: string, error: string }
     */
    async processResume(file) {
        // Validate file first
        const validation = this.validateFile(file);
        if (!validation.valid) {
            return { 
                success: false, 
                text: null, 
                error: validation.error 
            };
        }

        try {
            let extractedText = '';
            const fileType = this.SUPPORTED_TYPES[file.type];

            // Extract based on file type
            if (fileType === 'pdf') {
                extractedText = await this.extractTextFromPDF(file);
            } else if (fileType === 'docx') {
                extractedText = await this.extractTextFromDOCX(file);
            }

            // Verify we got some text
            if (!extractedText || extractedText.length < 50) {
                throw new Error('Extracted text is too short. Please ensure your resume has readable content.');
            }

            return { 
                success: true, 
                text: extractedText, 
                error: null 
            };
        } catch (error) {
            return { 
                success: false, 
                text: null, 
                error: error.message 
            };
        }
    }
};
