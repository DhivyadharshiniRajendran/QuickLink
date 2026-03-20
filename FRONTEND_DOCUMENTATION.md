# QuickLink - URL Shortener Frontend

## Project Overview

QuickLink is a modern, responsive URL shortener application built with React, Vite, and React Router. It allows users to create short URLs, track analytics, and view detailed statistics about their shortened links.

## Features Implemented

### ✅ Core Functionality
- **URL Shortening**: Create short, memorable URLs from long URLs
- **View All URLs**: Display all shortened URLs in a responsive table/card layout
- **URL Details Display**: Shows original URL, short URL, creation date, and total clicks
- **Delete URLs**: Easy deletion of shortened URLs with confirmation
- **Copy to Clipboard**: One-click copy functionality for short URLs
- **Form Validation**: Real-time URL validation with error messages

### ✅ Analytics Features
- **Click Tracking**: Count number of clicks per shortened URL
- **Visit Timestamps**: Record timestamp of each visit
- **Analytics Dashboard**: Global analytics overview showing:
  - Total URLs created
  - Total clicks across all URLs
  - Last visited time
  - Recent visit history
  - Average clicks per URL
- **Detailed Analytics Page**: Per-URL analytics showing:
  - Total click count
  - Last visited time
  - Recent visit history with timestamps
  - Full click details in reverse chronological order

### ✅ UI/UX Features
- **Responsive Design**: Mobile-first responsive layout that works on all screen sizes
- **Clean Dashboard Layout**: Intuitive navigation and organized information hierarchy
- **Loading States**: Visual feedback during form submission
- **Success States**: Confirmation messages for completed actions
- **Error States**: Clear error messages for validation and operation failures
- **Form Validation Messages**: Real-time validation feedback on input fields
- **Smooth Animations**: Subtle transitions and animations for better UX
- **Modern Design**: Gradient backgrounds, modern colors, and clean typography

### ✅ No External Icon Libraries
- Used emoji icons instead of lucide-react or other icon libraries
- Clean, simple, and universally supported icons

## Project Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── Header.jsx              # Navigation header
│   │   ├── Notification.jsx        # Toast notifications
│   │   ├── LoadingSpinner.jsx      # Loading state component
│   │   └── EmptyState.jsx          # Empty state placeholder
│   ├── UrlShortenerForm.jsx        # URL form with validation
│   ├── ShortUrlCard.jsx            # Individual URL card
│   ├── ShortUrlsTable.jsx          # URLs list container
│   ├── AnalyticsOverview.jsx       # Dashboard analytics
│   └── styles/
│       ├── UrlShortenerForm.css    # Form styles
│       ├── ShortUrlCard.css        # Card styles
│       ├── ShortUrlsTable.css      # Table styles
│       └── AnalyticsOverview.css   # Analytics styles
├── pages/
│   ├── Dashboard.jsx               # Main dashboard page
│   ├── AnalyticsOverviewPage.jsx   # Analytics overview page
│   └── AnalyticsDetail.jsx         # Detailed URL analytics page
├── context/
│   └── UrlContext.jsx              # Global state management
├── utils/
│   ├── urlValidator.js             # URL validation & utilities
│   └── useLocalStorage.js          # LocalStorage hook
├── styles/
│   ├── globals.css                 # Global styles
│   ├── Header.css                  # Header styles
│   ├── Notification.css            # Notification styles
│   ├── EmptyState.css              # Empty state styles
│   ├── LoadingSpinner.css          # Loader styles
│   ├── Dashboard.css               # Dashboard page styles
│   ├── AnalyticsOverviewPage.css   # Analytics page styles
│   └── AnalyticsDetail.css         # Detail analytics styles
├── App.jsx                         # Main app component with routing
└── main.jsx                        # Entry point
```

## Technology Stack

- **React 19.2.4**: UI framework
- **React Router v7.13.1**: Client-side routing
- **Vite v8.0.1**: Build tool and dev server
- **CSS3**: Styling with modern features (Grid, Flexbox, Gradients)
- **Context API**: State management
- **LocalStorage**: Persistent data storage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The application is set up with Vite's HMR (Hot Module Replacement) for fast development. The dev server runs on `http://localhost:5173/`

## Routes

- `/` - Dashboard (Home page with URL shortener and all URLs list)
- `/analytics-overview` - Global analytics overview
- `/analytics/:id` - Detailed analytics for a specific shortened URL

## State Management

The application uses React Context API (`UrlContext`) to manage:
- Shortened URLs list
- Click history for each URL
- Notification state
- CRUD operations (Create, Read, Delete)

Data persists in localStorage, so URLs and click history survive page refreshes.

## Key Features Explained

### URL Validation
- Validates URLs on form submission
- Supports HTTP and HTTPS URLs
- Shows helpful error messages for invalid inputs

### Click Tracking
- Each URL maintains a click history array
- Timestamps are automatically recorded
- Analytics show time-ago format for recent visits

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 1024px
- Touch-friendly buttons and inputs
- Adaptive grid layouts

### Form States
1. **Empty**: Submit button disabled when input is empty
2. **Loading**: Shows "Creating..." text during submission
3. **Success**: Shows success notification and clears form
4. **Error**: Displays specific error message

## Components Overview

### Header
Navigation component with QuickLink branding and user menu

### UrlShortenerForm
Form component for creating new shortened URLs with:
- Input validation
- Loading state
- Error message display
- Disabled state during submission

### ShortUrlCard
Individual URL display card with:
- Original URL link
- Short URL with copy button
- Creation date
- Click count
- Action buttons (View Analytics, Delete)

### AnalyticsOverview
Dashboard statistics showing:
- Total URLs and clicks
- Last visited time
- Recent activity feed
- Average metrics

### AnalyticsDetail
Detailed page for individual URL showing:
- Full URL information
- Comprehensive metrics
- Complete click history
- Delete option

## Styling Highlights

- **Color Scheme**: Purple gradients (#667eea, #764ba2) with complementary grays
- **Typography**: System fonts for optimal performance
- **Spacing**: Consistent spacing scale (0.25rem to 4rem)
- **Shadows**: Subtle shadows for depth without clutter
- **Animations**: Smooth transitions (0.3s ease) for hover and state changes
- **Accessibility**: Sufficient color contrast and readable font sizes

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations

- Code splitting with Vite
- CSS optimization and minification
- Efficient re-renders with React hooks
- LocalStorage for instant data access
- No unnecessary dependencies

## Future Enhancement Ideas

- Backend API integration for persistent data
- User authentication and accounts
- Custom short URL aliases
- QR code generation
- Advanced analytics (geographic, device, referrer)
- URL expiration and scheduling
- Password protection for shared URLs
- Batch URL creation and management

## Notes

- The application currently uses LocalStorage for data persistence
- URLs are lost when localStorage is cleared
- Ready for easy migration to a backend API
- No external icon library (uses emoji icons for simplicity)

---

**Created**: March 2026
**Last Updated**: March 2026
