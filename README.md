# AI Recruiter

A production-style web application that analyzes resumes using AI and provides recruiter-level feedback with a premium SaaS interface.

![AI Recruiter](https://img.shields.io/badge/AI-Recruiter-5b5bff?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-00d4aa?style=for-the-badge)

## ✨ Features

- **🎯 Smart Resume Analysis** - AI-powered evaluation like a senior recruiter with 15+ years experience
- **📊 Comprehensive Scoring** - Get scores across 5 key dimensions: Impact, Clarity, Structure, Skills, ATS Compatibility
- **💡 Actionable Insights** - Detailed strengths, weaknesses, and interview probability
- **✍️ Bullet Point Rewrites** - See before/after examples of improved resume bullets
- **📱 Responsive Design** - Premium dark mode UI inspired by Stripe and Linear
- **🔒 Privacy First** - All processing happens in your browser, no data stored on servers
- **⚡ Fast Processing** - Client-side PDF/DOCX extraction with smooth animations

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or Download** this repository

2. **Open the Application**
   ```bash
   # Option 1: Just open index.html in your browser
   # Double-click index.html or right-click → Open with → Browser
   
   # Option 2: Use a local server (recommended)
   # With Python
   python -m http.server 8000
   
   # With Node.js
   npx serve
   ```

3. **Configure API Key**
   - Click the "API Key" button in the header
   - Enter your OpenAI API key (starts with `sk-`)
   - Click "Save Key"
   - Your key is stored locally in browser storage only

4. **Analyze Your Resume**
   - Drag & drop your resume (PDF or DOCX) into the upload zone
   - Or click to browse and select a file
   - Wait 5-10 seconds for AI analysis
   - Review your comprehensive feedback!

## 📁 Project Structure

```
ai-recruiter/
├── index.html              # Main application page
├── css/
│   ├── styles.css          # Design system & global styles
│   └── components.css      # Component-specific styles
├── js/
│   ├── app.js              # Main application logic
│   ├── fileProcessor.js    # PDF/DOCX text extraction
│   ├── aiAnalyzer.js       # OpenAI LLM integration
│   └── ui.js               # UI rendering & animations
└── README.md               # This file
```

## 🎨 Design Philosophy

**Minimal. Premium. Direct.**

- **Dark Mode First** - Easy on the eyes, professional aesthetic
- **Typography** - Inter font for modern, clean readability
- **Color Palette** - Inspired by Stripe/Linear with accent gradients
- **Animations** - Smooth transitions and score counting effects
- **No Fluff** - Every element serves a purpose

## 🔧 Technical Stack

### Core Technologies
- **HTML5** - Semantic structure
- **Vanilla CSS** - Custom design system (no frameworks)
- **Vanilla JavaScript** - No build tools required

### External Libraries (CDN)
- **PDF.js** - Mozilla's PDF text extraction library
- **Mammoth.js** - DOCX to plain text conversion
- **Inter Font** - Google Fonts for premium typography

### AI Integration
- **OpenAI GPT-4** - Resume analysis with structured prompts
- **JSON Mode** - Enforced structured output for consistency

## 🤖 How It Works

1. **File Upload** - User uploads PDF/DOCX resume
2. **Text Extraction** - Client-side extraction using PDF.js or Mammoth.js
3. **AI Analysis** - Resume text sent to GPT-4 with recruiter persona prompt
4. **Structured Output** - AI returns JSON with scores, insights, and rewrites
5. **Visual Display** - Animated results with scores, strengths, weaknesses, and improvements

### AI Prompt Strategy

The AI is prompted to act as a **senior technical recruiter** with:
- Direct and professional tone
- Slightly critical but constructive feedback
- Focus on hireability signals
- Zero generic praise or fluff

Output includes:
- Overall score (0-100)
- Category scores (Impact, Clarity, Structure, Skills, ATS)
- Interview probability percentage
- Top 3-5 strengths
- Critical 3-5 weaknesses
- 2-3 sentence honest recruiter summary
- Before/after bullet point rewrites

## 🔒 Privacy & Security

- **No Backend** - Pure client-side application
- **No Data Storage** - Files never leave your browser
- **API Key Security** - Stored only in browser's localStorage
- **Direct API Calls** - Your browser connects directly to OpenAI

## 💰 Cost Considerations

This app uses OpenAI's GPT-4 API. Approximate costs:
- ~$0.03-0.10 per resume analysis (depending on resume length)
- Using GPT-4 for best quality results
- Can switch to GPT-3.5-turbo in `js/aiAnalyzer.js` for lower costs

## 🎯 Future SaaS Features

The codebase is structured for easy expansion:

### Planned Enhancements
- [ ] User authentication & saved history
- [ ] Multiple resume comparison
- [ ] Industry-specific analysis templates
- [ ] Export analysis as PDF
- [ ] ATS scanner with keyword optimization
- [ ] LinkedIn profile import
- [ ] Payment integration (credits/subscription)
- [ ] Team/recruiter dashboard
- [ ] Batch processing for recruiters

### Architecture Ready For
- Backend API layer (Express, FastAPI, etc.)
- Database integration (PostgreSQL, MongoDB)
- User management & sessions
- Payment processing (Stripe)
- Analytics & tracking
- Rate limiting & queue management

## 🚀 Deployment Options

### Static Hosting (Free)
- **Netlify** - Drag & drop deployment
- **Vercel** - Connect to GitHub repo
- **GitHub Pages** - Free hosting for public repos
- **Cloudflare Pages** - Fast CDN deployment

### Self-Hosted
Works on any web server:
- Apache
- Nginx
- Any Node.js server
- Any Python server

## 📊 Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Fully Supported |
| Firefox | ✅ Fully Supported |
| Safari | ✅ Fully Supported |
| Edge | ✅ Fully Supported |

## 🛠️ Customization

### Change AI Model
Edit `js/aiAnalyzer.js`:
```javascript
MODEL: 'gpt-3.5-turbo'  // Cheaper, faster
MODEL: 'gpt-4'          // Best quality (default)
MODEL: 'gpt-4-turbo'    // Faster GPT-4
```

### Adjust Max File Size
Edit `js/fileProcessor.js`:
```javascript
MAX_FILE_SIZE_MB: 10  // Default is 5MB
```

### Customize Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --color-accent: #5b5bff;
    --color-success: #00d4aa;
    /* ... more variables */
}
```

## 🐛 Troubleshooting

### "API key not configured"
- Click "API Key" button and enter your OpenAI key
- Ensure key starts with `sk-`
- Check localStorage is enabled in browser

### "Failed to extract text from PDF"
- Ensure PDF is not password-protected
- Try re-saving PDF from another program
- Check if PDF contains actual text (not just images)

### "Rate limit exceeded"
- OpenAI API has rate limits
- Wait a minute and try again
- Check your OpenAI account quota

### File upload not working
- Check file is PDF or DOCX format
- Ensure file is under 5MB (default limit)
- Try a different browser

## 📄 License

This project is open for personal and educational use. For commercial use, please ensure compliance with OpenAI's usage policies.

## 🙏 Credits

- **OpenAI** - GPT-4 API
- **Mozilla** - PDF.js library
- **Mammoth.js** - DOCX conversion
- **Google Fonts** - Inter typeface
- **Inspired by** - Stripe and Linear design systems

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review [OpenAI API documentation](https://platform.openai.com/docs)
3. Ensure your browser is up to date

---

**Built with ❤️ for better resumes and honest feedback.**
