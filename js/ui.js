/**
 * UI Module
 * Handles all UI rendering and animations
 */

const UI = {
    /**
     * Show upload section
     */
    showUploadSection() {
        document.getElementById('uploadSection').classList.remove('hidden');
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
    },

    /**
     * Show loading state with message
     * @param {string} message - Loading message to display
     */
    showLoadingState(message = 'AI recruiter reviewing your resume...') {
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('loadingSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('loadingMessage').textContent = message;
    },

    /**
     * Show results section
     */
    showResultsSection() {
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
    },

    /**
     * Show error message
     * @param {string} errorMessage - Error message to display
     */
    showError(errorMessage) {
        this.showUploadSection();

        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"/>
            </svg>
            <span>${errorMessage}</span>
        `;

        // Add to page
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(errorDiv, mainContent.firstChild);

        // Remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    },

    /**
     * Render complete analysis results
     * @param {Object} analysis - Analysis data from AI
     */
    renderResults(analysis) {
        const resultsSection = document.getElementById('resultsSection');

        resultsSection.innerHTML = `
            <!-- Overall Score -->
            ${this.renderOverallScore(analysis.score_overall)}
            
            <!-- Interview Probability -->
            ${this.renderInterviewProbability(analysis.interview_probability)}
            
            <!-- Category Scores -->
            ${this.renderCategoryScores(analysis.scores)}
            
            <!-- Recruiter Summary -->
            ${this.renderRecruiterSummary(analysis.recruiter_summary)}
            
            <!-- Strengths and Weaknesses -->
            ${this.renderInsights(analysis.top_strengths, analysis.critical_weaknesses)}
            
            <!-- Bullet Comparisons -->
            ${this.renderBulletComparisons(analysis.rewritten_bullets)}
            
            <!-- Action Button -->
            <div style="text-align: center; margin-top: 3rem;">
                <button class="btn-primary" onclick="location.reload()">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 0L10 7M10 0L6 4M10 0L14 4"/>
                        <path d="M3 7V13C3 14.66 4.34 16 6 16H14C15.66 16 17 14.66 17 13V7"/>
                    </svg>
                    Analyze Another Resume
                </button>
            </div>
        `;

        this.showResultsSection();

        // Animate scores after rendering
        setTimeout(() => this.animateScores(analysis), 100);
    },

    /**
     * Render overall score with circular progress
     * @param {number} score - Overall score (0-100)
     * @returns {string} - HTML string
     */
    renderOverallScore(score) {
        const circumference = 2 * Math.PI * 94; // radius = 94
        const offset = circumference - (score / 100) * circumference;

        return `
            <div class="overall-score">
                <div class="score-circle">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <defs>
                            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#5b5bff"/>
                                <stop offset="100%" stop-color="#00d4aa"/>
                            </linearGradient>
                        </defs>
                        <circle class="score-circle-bg" cx="100" cy="100" r="94"/>
                        <circle class="score-circle-fill" cx="100" cy="100" r="94"
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${offset}"
                                data-final-offset="${offset}"/>
                    </svg>
                    <div class="score-circle-text">
                        <div class="score-circle-value" data-target="${score}">0</div>
                        <div class="score-circle-label">Overall Score</div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render interview probability badge
     * @param {string} probability - Probability percentage
     * @returns {string} - HTML string
     */
    renderInterviewProbability(probability) {
        return `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div class="interview-probability">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    Interview Probability: ${probability}
                </div>
            </div>
        `;
    },

    /**
     * Render category scores grid
     * @param {Object} scores - Category scores object
     * @returns {string} - HTML string
     */
    renderCategoryScores(scores) {
        const categories = [
            { key: 'impact', label: 'Impact' },
            { key: 'clarity', label: 'Clarity' },
            { key: 'structure', label: 'Structure' },
            { key: 'skills', label: 'Skills' },
            { key: 'ats_compatibility', label: 'ATS Score' }
        ];

        const categoryCards = categories.map(cat => `
            <div class="category-score">
                <div class="category-score-value" data-target="${scores[cat.key]}">0</div>
                <div class="category-score-label">${cat.label}</div>
            </div>
        `).join('');

        return `
            <h2 class="section-heading">Category Breakdown</h2>
            <div class="category-scores">
                ${categoryCards}
            </div>
        `;
    },

    /**
     * Render recruiter summary
     * @param {string} summary - Recruiter summary text
     * @returns {string} - HTML string
     */
    renderRecruiterSummary(summary) {
        return `
            <div class="recruiter-summary">
                <h3>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                    Recruiter's Take
                </h3>
                <p>${summary}</p>
            </div>
        `;
    },

    /**
     * Render strengths and weaknesses
     * @param {Array} strengths - Array of strength strings
     * @param {Array} weaknesses - Array of weakness strings
     * @returns {string} - HTML string
     */
    renderInsights(strengths, weaknesses) {
        return `
            <h2 class="section-heading">Key Insights</h2>
            <div class="insights-grid">
                <div class="insight-card strengths">
                    <div class="insight-header">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <h3>Top Strengths</h3>
                    </div>
                    <ul class="insight-list">
                        ${strengths.map(s => `<li class="insight-item">${s}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="insight-card weaknesses">
                    <div class="insight-header">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                        </svg>
                        <h3>Critical Weaknesses</h3>
                    </div>
                    <ul class="insight-list">
                        ${weaknesses.map(w => `<li class="insight-item">${w}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Render bullet comparisons
     * @param {Array} bullets - Array of {original, improved} objects
     * @returns {string} - HTML string
     */
    renderBulletComparisons(bullets) {
        if (!bullets || bullets.length === 0) {
            return '';
        }

        const comparisonCards = bullets.map(bullet => `
            <div class="comparison-card">
                <div class="comparison-side original">
                    <div class="comparison-label">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0L0 8L8 16L16 8L8 0ZM9 12H7V10H9V12ZM9 8H7V4H9V8Z"/>
                        </svg>
                        Before
                    </div>
                    <div class="comparison-text">${bullet.original}</div>
                </div>
                <div class="comparison-side improved">
                    <div class="comparison-label">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0L16 8L8 16L0 8L8 0ZM7 4V10H9V4H7Z"/>
                        </svg>
                        After
                    </div>
                    <div class="comparison-text">${bullet.improved}</div>
                </div>
            </div>
        `).join('');

        return `
            <h2 class="section-heading">Bullet Point Improvements</h2>
            <div class="bullet-comparisons">
                ${comparisonCards}
            </div>
        `;
    },

    /**
     * Animate scores with counting effect
     * @param {Object} analysis - Full analysis data
     */
    animateScores(analysis) {
        // Animate overall score
        const overallValue = document.querySelector('.score-circle-value');
        if (overallValue) {
            this.animateNumber(overallValue, 0, analysis.score_overall, 1500);
        }

        // Animate circular progress
        const circleFill = document.querySelector('.score-circle-fill');
        if (circleFill) {
            const finalOffset = circleFill.getAttribute('data-final-offset');
            circleFill.style.strokeDashoffset = finalOffset;
        }

        // Animate category scores
        document.querySelectorAll('.category-score-value').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            this.animateNumber(el, 0, target, 1200);
        });
    },

    /**
     * Animate number counting up
     * @param {HTMLElement} element - Element to animate
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Animation duration in ms
     */
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeProgress);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        };

        requestAnimationFrame(animate);
    }
};

// Add error notification styles dynamically
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error-notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--color-surface);
        border: 1px solid var(--color-error);
        border-left: 4px solid var(--color-error);
        border-radius: var(--radius-md);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--color-text-primary);
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
        z-index: 2000;
        max-width: 400px;
    }
    
    .error-notification svg {
        color: var(--color-error);
        flex-shrink: 0;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(errorStyles);
