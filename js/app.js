/**
 * Main Application Logic
 * Coordinates file upload, processing, analysis, and display
 */

class App {
    constructor() {
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        this.setupEventListeners();
        this.checkApiKeyStatus();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Upload zone click
        const uploadZone = document.getElementById('uploadZone');
        uploadZone.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // File input change
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');

            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });

        // API Key modal
        const apiKeyBtn = document.getElementById('apiKeyBtn');
        const apiKeyModal = document.getElementById('apiKeyModal');
        const modalClose = document.getElementById('modalClose');
        const saveApiKey = document.getElementById('saveApiKey');
        const clearApiKey = document.getElementById('clearApiKey');

        apiKeyBtn.addEventListener('click', () => {
            this.openApiKeyModal();
        });

        modalClose.addEventListener('click', () => {
            this.closeApiKeyModal();
        });

        // Close modal on backdrop click
        apiKeyModal.addEventListener('click', (e) => {
            if (e.target === apiKeyModal) {
                this.closeApiKeyModal();
            }
        });

        saveApiKey.addEventListener('click', () => {
            this.saveApiKey();
        });

        clearApiKey.addEventListener('click', () => {
            this.clearApiKey();
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !apiKeyModal.classList.contains('hidden')) {
                this.closeApiKeyModal();
            }
        });
    }

    /**
     * Check API key status and update UI
     */
    checkApiKeyStatus() {
        const hasKey = AIAnalyzer.hasApiKey();
        const apiKeyBtn = document.getElementById('apiKeyBtn');

        if (hasKey) {
            apiKeyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                API Key Set
            `;
            apiKeyBtn.style.borderColor = 'var(--color-success)';
        }
    }

    /**
     * Open API key modal
     */
    openApiKeyModal() {
        const modal = document.getElementById('apiKeyModal');
        const input = document.getElementById('apiKeyInput');

        // Pre-fill if key exists
        const currentKey = AIAnalyzer.getApiKey();
        input.value = currentKey ? '••••••••••••••••' : '';

        modal.classList.remove('hidden');

        // Clear placeholder on focus
        input.addEventListener('focus', () => {
            if (input.value === '••••••••••••••••') {
                input.value = '';
            }
        }, { once: true });

        setTimeout(() => input.focus(), 100);
    }

    /**
     * Close API key modal
     */
    closeApiKeyModal() {
        document.getElementById('apiKeyModal').classList.add('hidden');
        document.getElementById('apiKeyInput').value = '';
    }

    /**
     * Save API key to localStorage
     */
    saveApiKey() {
        const input = document.getElementById('apiKeyInput');
        const apiKey = input.value.trim();

        if (!apiKey || apiKey === '••••••••••••••••') {
            UI.showError('Please enter a valid API key');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            UI.showError('Invalid API key format. OpenAI keys start with "sk-"');
            return;
        }

        AIAnalyzer.saveApiKey(apiKey);
        this.checkApiKeyStatus();
        this.closeApiKeyModal();

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'error-notification';
        successDiv.style.borderColor = 'var(--color-success)';
        successDiv.style.borderLeftColor = 'var(--color-success)';
        successDiv.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--color-success)">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
            <span>API key saved successfully!</span>
        `;
        document.querySelector('.main-content').insertBefore(successDiv, document.querySelector('.main-content').firstChild);
        setTimeout(() => successDiv.remove(), 3000);
    }

    /**
     * Clear API key from localStorage
     */
    clearApiKey() {
        AIAnalyzer.clearApiKey();
        this.checkApiKeyStatus();
        this.closeApiKeyModal();

        const apiKeyBtn = document.getElementById('apiKeyBtn');
        apiKeyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 8.5C14 9.88 12.88 11 11.5 11H10V13C10 13.55 9.55 14 9 14H7.5C6.12 14 5 12.88 5 11.5C5 10.12 6.12 9 7.5 9H8V7.5C8 6.12 9.12 5 10.5 5C11.88 5 13 6.12 13 7.5V8H14V8.5ZM11.5 5C10.67 5 10 5.67 10 6.5V7H11.5C12.33 7 13 6.33 13 5.5C13 4.67 12.33 4 11.5 4C10.67 4 10 4.67 10 5.5H11.5V5Z"/>
            </svg>
            API Key
        `;
        apiKeyBtn.style.borderColor = '';
    }

    /**
     * Handle file upload and process resume
     * @param {File} file - Uploaded file
     */
    async handleFileUpload(file) {
        // Check API key first
        if (!AIAnalyzer.hasApiKey()) {
            UI.showError('Please configure your OpenAI API key first');
            this.openApiKeyModal();
            return;
        }

        try {
            // Step 1: Show loading - Extracting text
            UI.showLoadingState('Extracting text from your resume...');

            // Step 2: Process file and extract text
            const result = await FileProcessor.processResume(file);

            if (!result.success) {
                UI.showError(result.error);
                return;
            }

            // Step 3: Show loading - AI Analysis
            UI.showLoadingState('AI recruiter reviewing your resume...');

            // Step 4: Analyze with AI
            const analysis = await AIAnalyzer.analyzeResume(result.text);

            if (!analysis.success) {
                UI.showError(analysis.error);
                return;
            }

            // Step 5: Display results
            UI.renderResults(analysis.data);

        } catch (error) {
            console.error('Upload handling error:', error);
            UI.showError('An unexpected error occurred. Please try again.');
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
