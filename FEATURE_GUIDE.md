# QuickLink Feature Guide

## Dashboard

### Main Features

#### 1. URL Shortener Form
Located at the top of the dashboard, this section allows you to create new shortened URLs.

**How to use:**
1. Paste your long URL into the input field (e.g., `https://www.example.com/very/long/path`)
2. Click the "Shorten URL" button
3. A success notification appears at the top-right
4. Your new shortened URL is added to the list below

**Validation:**
- URL must be valid (start with http:// or https://)
- Error message appears if URL is invalid
- Submit button is disabled while form is processing

#### 2. Analytics Overview
Quick stats dashboard showing your overall usage:
- **Total URLs Created**: Total number of shortened URLs you've made
- **Total Clicks**: Combined clicks across all your URLs
- **Last Visit**: When your any URL was last clicked
- **Avg Clicks/URL**: Average click count per URL

Below the stats is a "Recent Activity" section showing the last 5 clicks from all your URLs.

#### 3. My Shortened Links
A list of all your shortened URLs with the following information for each:

**Columns/Sections:**
- **Original URL**: The long URL you shortened (clickable, opens in new tab)
- **Short URL**: Your short link with a copy button
- **Created**: Date the URL was created
- **Clicks**: Number of times the link was clicked
- **Actions**: Two buttons:
  - 📊 Analytics: View detailed analytics for this URL
  - 🗑️ Delete: Remove the shortened URL (requires confirmation)

**Interactions:**
- Click the "Copy" button to copy the short URL to your clipboard
- Click "Analytics" to see detailed statistics including click history
- Click "Delete" to remove the URL with a confirmation dialog

---

## Analytics Pages

### 1. Analytics Overview Page
Accessible from the top navigation menu.

**Shows:**
- **Statistics Cards**: Total URLs, total clicks, last visit, and average clicks
- **Recent Activity**: Feed of last 5 clicks with timestamps

This gives you a bird's-eye view of your URL performance.

### 2. Analytics Detail Page
Accessible by clicking the "Analytics" button on any shortened URL or visiting `/analytics/:id`

#### Information Panel

Shows the full details of your shortened URL:
- **Original URL**: Complete long URL (clickable)
- **Short URL**: Your shortened link with copy button
- **Created Date**: When this URL was created

#### Metrics Cards

Four metric cards showing:
1. **Total Clicks**: Large number showing total click count
2. **Last Visited**: How long ago the link was last clicked
3. **Created On**: Date the link was created
4. **CTR**: Click-through rate (100% if clicked, 0% if not)

#### Click History

A detailed table showing all visits to your shortened URL:
- **#**: Click number (most recent first)
- **Timestamp**: Date and time of each click
- **Time Ago**: Relative time display (e.g., "2h ago")

The history is displayed in reverse chronological order, so most recent clicks appear first.

---

## Notifications

The app provides feedback through toast notifications in the top-right corner:

**Success (Green)**
- "Short URL created successfully!"
- "Short URL copied to clipboard!"
- "URL deleted successfully!" (displayed as info)

**Error (Red)**
- "Please enter a URL"
- "Please enter a valid URL"
- "Failed to create short URL. Please try again."

Notifications automatically disappear after 3 seconds.

---

## Data Persistence

All your URLs and click data are saved in your browser's LocalStorage:
- Urls persist even after closing the browser
- Clearing browser cache/data will delete your URLs
- **Note**: Each browser/device has its own separate data

---

## How Click Tracking Works

When someone clicks on your shortened URL (simulated by the app):
1. The click timestamp is recorded
2. The click count increases
3. The data updates in real-time
4. Click history is updated in the analytics page

**Example**: If you have a URL `qk.li/abc123` that gets clicked, you'll see:
- Click count increases from 0 to 1
- "Last Visit" shows "just now"
- Click history shows the exact timestamp

---

## Tips & Best Practices

1. **Monitor Popular Links**: Use the Analytics Overview to quickly see which links are most popular

2. **Share Short URLs**: Use the copy button for easy sharing on social media, emails, or messages

3. **Track Long Campaigns**: Keep your URLs organized and watch their performance over time

4. **Clean Up**: Delete URLs you no longer need to keep your dashboard clean

5. **Check Details**: Click on the Analytics button to see the complete history of any URL

---

## Responsive Design

The application works perfectly on:
- 📱 Mobile phones (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktop computers (1024px and up)

On mobile:
- Cards stack vertically
- Buttons adjust size for touch
- More compact layout for smaller screens
- Still shows all essential information

---

## Keyboard Shortcuts & Accessibility

- **Tab**: Navigate through form fields and buttons
- **Enter**: Submit form when in the URL input field
- **Click**: Select action buttons and links
- **Color Contrast**: All text meets accessibility standards
- **Screen Reader Friendly**: Semantic HTML structure

---

## Troubleshooting

### Issue: URL appears but doesn't show in list
- **Solution**: Refresh the page (Ctrl+R or Cmd+R)

### Issue: Short URL didn't copy
- **Solution**: Try again or check clipboard permissions in browser

### Issue: Lost all my URLs
- **Solution**: Check if browser data was cleared. URLs are stored in LocalStorage.

### Issue: Analytics not updating
- **Solution**: The app records clicks when you view the detail page. In a real app, this would be triggered when someone visits the short link.

---

## Contact & Support

For issues or feature requests, please contact the development team.

---

*Last Updated: March 2026*
