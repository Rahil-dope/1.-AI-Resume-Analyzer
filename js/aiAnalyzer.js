/**
 * AI Analyzer Module
 * Handles LLM integration for resume analysis
 */

const AIAnalyzer = {
    // API Configuration
    API_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4',
    TEMPERATURE: 0.3,
    MAX_TOKENS: 2000,

    /**
     * Get API key from localStorage or config
     * @returns {string|null} - API key or null if not configured
     */
    getApiKey() {
        // Try localStorage first (user-provided key)
        const localKey = localStorage.getItem('openai_api_key');
        if (localKey) {
            return localKey;
        }

        // Fallback to config file if exists
        if (typeof CONFIG !== 'undefined' && CONFIG.OPENAI_API_KEY) {
            return CONFIG.OPENAI_API_KEY;
        }

        return null;
    },

    /**
     * Check if API key is configured
     * @returns {boolean}
     */
    hasApiKey() {
        return this.getApiKey() !== null;
    },

    /**
     * Save API key to localStorage
     * @param {string} apiKey - OpenAI API key
     */
    saveApiKey(apiKey) {
        if (apiKey && apiKey.trim()) {
            localStorage.setItem('openai_api_key', apiKey.trim());
        }
    },

    /**
     * Clear API key from localStorage
     */
    clearApiKey() {
        localStorage.removeItem('openai_api_key');
    },

    /**
     * Build the system prompt for the recruiter persona
     * @returns {string} - System prompt
     */
    getSystemPrompt() {
        return `You are a senior technical recruiter with 15+ years of experience evaluating resumes.

Your Analysis Style:
- Direct and professional
- Slightly critical but constructive
- Zero fluff or generic praise
- Focus on hireability signals
- Honest assessment of strengths and weaknesses

CRITICAL: You MUST respond with ONLY valid JSON. No additional text, explanations, or markdown formatting.

Output Structure (JSON only):
{
  "score_overall": <number 0-100>,
  "scores": {
    "impact": <number 0-100>,
    "clarity": <number 0-100>,
    "structure": <number 0-100>,
    "skills": <number 0-100>,
    "ats_compatibility": <number 0-100>
  },
  "interview_probability": "<percentage like '65%'>",
  "top_strengths": [<array of 3-5 specific strengths>],
  "critical_weaknesses": [<array of 3-5 specific weaknesses>],
  "recruiter_summary": "<2-3 sentence honest assessment>",
  "rewritten_bullets": [
    {
      "original": "<original bullet point from resume>",
      "improved": "<rewritten version with impact metrics>"
    }
  ]
}

Scoring Criteria:
- Impact: Quantifiable achievements, business outcomes
- Clarity: Easy to scan, well-written, concise
- Structure: Logical flow, proper formatting
- Skills: Relevant technical/soft skills clearly demonstrated
- ATS Compatibility: Keywords, standard sections, parseable format

Select 3-5 bullet points from the resume to rewrite as examples.`;
    },

    /**
     * Analyze resume text using OpenAI API
     * @param {string} resumeText - Extracted resume text
     * @returns {Promise<Object>} - Analysis result
     */
    async analyzeResume(resumeText) {
        const apiKey = this.getApiKey();

        if (!apiKey) {
            throw new Error('API key not configured. Please add your OpenAI API key.');
        }

        try {
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: this.getSystemPrompt()
                        },
                        {
                            role: 'user',
                            content: `Analyze this resume:\n\n${resumeText}`
                        }
                    ],
                    temperature: this.TEMPERATURE,
                    max_tokens: this.MAX_TOKENS,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenAI API key.');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again in a moment.');
                } else if (response.status === 500) {
                    throw new Error('OpenAI service error. Please try again later.');
                } else {
                    throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
                }
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Parse JSON response
            const analysis = JSON.parse(content);

            // Validate response structure
            this.validateAnalysisResponse(analysis);

            return {
                success: true,
                data: analysis,
                error: null
            };

        } catch (error) {
            console.error('AI analysis error:', error);
            return {
                success: false,
                data: null,
                error: error.message
            };
        }
    },

    /**
     * Validate the AI response has required fields
     * @param {Object} analysis - Parsed AI response
     * @throws {Error} - If validation fails
     */
    validateAnalysisResponse(analysis) {
        const required = [
            'score_overall',
            'scores',
            'interview_probability',
            'top_strengths',
            'critical_weaknesses',
            'recruiter_summary',
            'rewritten_bullets'
        ];

        for (const field of required) {
            if (!(field in analysis)) {
                throw new Error(`Invalid AI response: missing field '${field}'`);
            }
        }

        // Validate scores object
        const requiredScores = ['impact', 'clarity', 'structure', 'skills', 'ats_compatibility'];
        for (const score of requiredScores) {
            if (!(score in analysis.scores)) {
                throw new Error(`Invalid AI response: missing score '${score}'`);
            }
        }
    }
};
