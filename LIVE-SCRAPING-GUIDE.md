# 🎬 Live Scraping Guide - Vegamovies API

## How to Fetch Single URLs with Live Content

This guide shows you how to scrape live content from **https://vegamovies.ad/** using the API.

---

## 📡 Quick Start

### Endpoint: `/api/post`

**Method:** GET  
**Parameter:** `url` (required)

The `url` parameter accepts:
- ✅ Full URL: `https://vegamovies.ad/49221-the-night-agent-2026...html`
- ✅ Post ID only: `49221-the-night-agent-2026...html`

---

## 🚀 Usage Examples

### 1. Using cURL

```bash
# With full URL
curl "http://localhost:3000/api/post?url=https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html"

# With post ID only
curl "http://localhost:3000/api/post?url=49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html"

# Pretty print JSON
curl -s "http://localhost:3000/api/post?url=https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html" | python3 -m json.tool
```

### 2. Using JavaScript/Node.js

```javascript
// Using fetch API
async function fetchMovieDetails() {
  const url = 'https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html'
  
  const response = await fetch(`http://localhost:3000/api/post?url=${encodeURIComponent(url)}`)
  const data = await response.json()
  
  console.log('Title:', data.data.title)
  console.log('Type:', data.data.type)
  console.log('Synopsis:', data.data.synopsis)
  console.log('Images:', data.data.images.length)
  console.log('Servers:', data.data.servers.length)
}

fetchMovieDetails()
```

### 3. Using Python

```python
import requests
import urllib.parse

url = "https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html"
encoded_url = urllib.parse.quote(url, safe='')

response = requests.get(f"http://localhost:3000/api/post?url={encoded_url}")
data = response.json()

if data['status']:
    post = data['data']
    print(f"Title: {post['title']}")
    print(f"Type: {post['type']}")
    print(f"Synopsis: {post['synopsis']}")
    print(f"Images: {len(post['images'])}")
    print(f"Servers: {len(post['servers'])}")
```

### 4. Using Browser (HTML/JavaScript)

Open `demo.html` in your browser for an interactive demo, or use this code:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Fetch Movie</title>
</head>
<body>
    <input type="text" id="movieUrl" placeholder="Enter movie URL">
    <button onclick="fetchMovie()">Fetch</button>
    <div id="result"></div>
    
    <script>
        async function fetchMovie() {
            const url = document.getElementById('movieUrl').value
            const response = await fetch(`http://localhost:3000/api/post?url=${encodeURIComponent(url)}`)
            const data = await response.json()
            
            document.getElementById('result').innerHTML = `
                <h3>${data.data.title}</h3>
                <p><strong>Type:</strong> ${data.data.type}</p>
                <p><strong>Synopsis:</strong> ${data.data.synopsis}</p>
            `
        }
    </script>
</body>
</html>
```

---

## 📊 Response Format

### Success Response

```json
{
  "status": true,
  "data": {
    "title": "The Night Agent 2026 Season 3...",
    "type": "series",
    "synopsis": "The Night Agent is a sophisticated, character-based action thriller...",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "servers": [
      {
        "downloadtitle": "Episode 1 [720p]",
        "quality": "720p",
        "size": "500MB",
        "links": [
          {
            "url": "https://download-link.com",
            "serverName": "FastDL"
          }
        ]
      }
    ]
  }
}
```

### Error Response

```json
{
  "status": false,
  "message": "url parameter is required (can be full URL or just the post ID)"
}
```

---

## 🔄 Complete Workflow

### Step 1: Search for Content

```bash
curl "http://localhost:3000/api/search?keyword=night+agent&page=1"
```

### Step 2: Get Post Details

```bash
curl "http://localhost:3000/api/post?url=https://vegamovies.ad/49221-the-night-agent-2026..."
```

### Step 3: Get Download Servers

```bash
curl "http://localhost:3000/api/servers?url=https://vegamovies.ad/49221-the-night-agent-2026..."
```

### Step 4: Get Download Links

```bash
curl "http://localhost:3000/api/downloads?url=SERVER_URL_FROM_STEP_3"
```

---

## 💡 Pro Tips

1. **URL Encoding**: Always encode URLs when passing as parameters
   ```javascript
   encodeURIComponent(url)
   ```

2. **Batch Processing**: Fetch multiple posts in parallel
   ```javascript
   const urls = ['url1', 'url2', 'url3']
   const results = await Promise.all(
     urls.map(url => fetch(`/api/post?url=${encodeURIComponent(url)}`))
   )
   ```

3. **Error Handling**: Always check the `status` field
   ```javascript
   if (data.status) {
     // Success
   } else {
     // Handle error
     console.error(data.message)
   }
   ```

4. **Pagination**: For browsing categories, use the `page` parameter
   ```bash
   curl "http://localhost:3000/api/posts/home?page=2"
   ```

---

## 🎯 Live Demo

### Try the Interactive Demo

1. **Node.js Demo**:
   ```bash
   node demo-usage.js
   ```

2. **Browser Demo**:
   Open `demo.html` in your browser

3. **Portfolio Page**:
   Visit http://localhost:3000/ for complete API documentation

---

## 🐛 Troubleshooting

### Issue: 404 or Server Error

**Solution**: The website might have Cloudflare protection active. Make sure:
- Your Cloudflare cookies are valid
- The URL is correct and the page exists
- Try accessing the URL directly in a browser first

### Issue: Empty Servers Array

**Reason**: The download links might be on a separate page or require additional parsing.

**Solution**: Use the `/api/servers` endpoint after getting post details.

---

## 📝 Notes

- ✅ Works with any valid Vegamovies URL
- ✅ Automatically extracts title, synopsis, images, and download links
- ✅ Supports both movies and series
- ✅ Real-time scraping - always gets fresh content
- ⚠️ Requires valid Cloudflare bypass (works locally)

---

## 🔗 Related Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/search` | Search for content |
| `/api/posts/:query` | Browse categories |
| `/api/servers` | Get available servers |
| `/api/downloads` | Get download links |

---

## 📞 Support

For more examples and documentation, visit the portfolio page at http://localhost:3000/

---

**Made with ❤️ for Vegamovies API**
