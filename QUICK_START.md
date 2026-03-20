# QuickLink - Quick Start Guide

## 🎯 Quick Start (5 Minutes)

### 1. Start the Development Server
```bash
cd "c:\Users\DHIVYADHARSHINI R\OneDrive\Desktop\URL_kat"
npm run dev
```
👉 Open http://localhost:5173/ in your browser

### 2. Create a Short URL
1. Paste a long URL like `https://www.google.com`
2. Click "Shorten URL"
3. See your new short URL appear in the list

### 3. View Analytics
- Click "Analytics" button on any URL card
- Or go to "Analytics" in the navigation menu

### 4. Test Features
- 📋 Copy short URL using the copy button
- 📊 View analytics for each URL
- 🗑️ Delete URLs with confirmation

---

## 📁 Key Files to Know

| File | What It Does |
|------|-------------|
| `src/App.jsx` | Main routing and app setup |
| `src/context/UrlContext.jsx` | All data and operations (URLs, clicks, etc) |
| `src/pages/Dashboard.jsx` | Main page with form and URL list |
| `src/pages/AnalyticsDetail.jsx` | Analytics page for specific URL |
| `src/components/UrlShortenerForm.jsx` | URL creation form |
| `src/utils/urlValidator.js` | Helper functions (validation, formatting) |

---

## 🔄 How Data Flows

```
User Input (Form)
    ↓
UrlContext (Creates new URL)
    ↓
localStorage (Saves data)
    ↓
Component Re-renders (Shows new URL)
```

---

## 🎨 Customization Examples

### Change Primary Color

**File**: `src/styles/globals.css` and other CSS files

Find `#667eea` and replace with your color:
```css
/* Before */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* After */
background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
```

### Change Site Name

**File**: `src/components/shared/Header.jsx`

```jsx
// Change from
<span className="logo-text">QuickLink</span>

// To your brand name
<span className="logo-text">YourBrandName</span>
```

### Add More Metrics

**File**: `src/components/AnalyticsOverview.jsx`

Add a new stat card:
```jsx
<div className="stat-card">
  <div className="stat-icon">🎯</div>
  <div className="stat-info">
    <span className="stat-label">Conversion Rate</span>
    <span className="stat-value">85%</span>
  </div>
</div>
```

---

## 🐛 Common Issues & Fixes

### Issue: Webpack/Build Errors
**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install`

```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Issue: Styles Not Loading
**Solution**: Check CSS import paths (should use `../../styles/` from components folder)

### Issue: localStorage Data Lost
**Solution**: Browser cache was cleared. Data is stored in browser localStorage, clearing browser data deletes it.

### Issue: Hot reload not working
**Solution**: Restart dev server with `npm run dev`

---

## 📚 File Templates

### Creating a New Component
```jsx
import React from 'react';
import './styles/MyComponent.css';

export const MyComponent = () => {
  return (
    <div className="my-component">
      <h2>My Component</h2>
      <p>Content here</p>
    </div>
  );
};
```

### Creating a New Page
```jsx
import React from 'react';
import '../styles/MyPage.css';

export const MyPage = () => {
  return (
    <div className="my-page">
      <h1>My Page</h1>
      <p>Page content</p>
    </div>
  );
};
```

Then add route in `App.jsx`:
```jsx
<Route path="/my-page" element={<MyPage />} />
```

---

## 🚀 Building for Production

### Create Production Build
```bash
npm run build
```

Output folder: `dist/`

### Preview Production Build
```bash
npm run preview
```

Then open http://localhost:4173/

### Deploy to Your Server
Copy contents of `dist/` folder to your web server

---

## 📊 Understanding the Data

### URL Object Structure
```javascript
{
  id: "url_1234567890",                    // Unique ID
  originalUrl: "https://example.com",      // Long URL
  shortUrl: "qk.li/abc123",                // Short URL display
  shortCode: "abc123",                     // Code part
  created: "2026-03-20T10:30:00Z",        // Creation timestamp
  clicks: 5,                               // Total clicks
  clickHistory: [
    { timestamp: "2026-03-20T10:35:00Z" },
    // ... more clicks
  ]
}
```

---

## 🔗 API-Ready Architecture

The code is ready for backend integration. Replace localStorage with API calls:

**Before (localStorage)**:
```javascript
localStorage.setItem('shortened_urls', JSON.stringify(updated));
```

**After (API)**:
```javascript
const response = await fetch('/api/urls', {
  method: 'POST',
  body: JSON.stringify(newUrl)
});
```

---

## 📱 Testing Responsive Design

### Using Browser DevTools
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select different devices: iPhone, iPad, Desktop

### Common Breakpoints to Test
- Mobile: 375px (iPhone)
- Tablet: 768px
- Desktop: 1440px

---

## 🎯 Browser Support

✅ Works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 💡 Tips for Development

### 1. Use React DevTools
Install React DevTools browser extension to inspect components and state

### 2. Check localStorage
Open DevTools → Application → localStorage to see stored data

### 3. Use Console
```bash
# View stored URLs
console.log(JSON.parse(localStorage.getItem('shortened_urls')))
```

### 4. Format Code
```bash
npm run lint
```

---

## 📖 Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - Complete overview of what was built
2. **FRONTEND_DOCUMENTATION.md** - Technical documentation
3. **FEATURE_GUIDE.md** - User guide and features
4. **README.md** - Project info (edit as needed)

---

## 🎓 Learning Resources

### React
- [React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [React Context API](https://react.dev/reference/react/useContext)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

### CSS
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

---

## ✨ What's Next?

1. **Add Backend**: Connect to your backend API
2. **Add Authentication**: Login system for users
3. **Add Features**: QR codes, expiring URLs, custom aliases
4. **Improve Analytics**: Geographic data, device type, referrer
5. **Deploy**: Host on Netlify, Vercel, or your server

---

## 📞 Developer Commands Reference

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎯 Quick Reference

### Common File Paths
```
/src/context/UrlContext.jsx        - State management
/src/pages/Dashboard.jsx           - Main page
/src/utils/urlValidator.js         - Helper functions
/src/styles/globals.css            - Global styles
```

### Key Imports
```javascript
import { useUrlContext } from '../context/UrlContext';
import { isValidUrl, formatDate } from '../utils/urlValidator';
import { useNavigate } from 'react-router-dom';
```

### Key Functions
```javascript
// Create short URL
const { createShortUrl } = useUrlContext();
createShortUrl("https://example.com");

// Get specific URL
const { getUrlById } = useUrlContext();
getUrlById(id);

// Delete URL
const { deleteUrl } = useUrlContext();
deleteUrl(id);

// Record click
const { recordClick } = useUrlContext();
recordClick(id);
```

---

## ✅ Pre-Launch Checklist

- [ ] Run `npm run build` successfully
- [ ] Test all routes
- [ ] Test mobile responsiveness
- [ ] Check localStorage persistence
- [ ] Test all buttons and forms
- [ ] Verify analytics pages
- [ ] Check error messages
- [ ] Test delete/copy functions

---

**Happy Coding! 🚀**

For detailed information, see the documentation files in the project root.
