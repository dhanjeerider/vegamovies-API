# Vegamovies API  

This is an unofficial web scraping API for Vegamovies, built using Node.js and Fastify. It fetches movie and TV show data in real-time from **https://vegamovies.ad/** and returns it in JSON format.  

## ✨ Features

- 🏠 **Portfolio Page** - Beautiful API documentation at the root endpoint
- 🔍 **Search Movies** - Search for any movie or TV show
- 📺 **Browse by Category** - Filter by genres, year, quality, and more
- 🎬 **New Categories Added** - Girl, Archive, and Postpaid sections
- 📥 **Download Links** - Get direct download links for movies
- 🎯 **Servers** - Access multiple server options

## 🚀 How to Run Locally  

1. Clone this repository:  
   ```sh
   git clone https://github.com/yahyaMomin/vegamovies-API.git
   cd vegamovies-API
```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Start the development server:
   ```sh
   pnpm run dev
   ```

4. The API will run at http://localhost:3000

## 📡 API Endpoints

Visit the root endpoint (http://localhost:3000) for complete interactive documentation!

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API Portfolio/Documentation |
| `/api/search?keyword={query}&page={num}` | GET | Search movies |
| `/api/post?url={url}` | GET | Get post details |
| `/api/servers?url={url}` | GET | Get available servers |
| `/api/downloads?url={url}` | GET | Get download links |
| `/api/posts/:query/:category?` | GET | Browse by category |

### Available Queries

- `home` - Homepage posts
- `featured` - Featured content
- `girl` - Girl category **[NEW]**
- `archive` - Archive section **[NEW]**  
- `postpaid` - Postpaid content **[NEW]**
- `anime-series` - Anime series
- `chinese-series` - Chinese series
- `korean-series` - Korean series
- `english` - English content
- `wwe-show` - WWE shows
- `web-series/:platform` - Web series (Netflix, Amazon Prime, Disney+, etc.)
- `movies-by-genres/:genre` - Movies by genre (Action, Comedy, Horror, etc.)
- `movies-by-year/:year` - Movies by release year
- `movies-by-quality/:quality` - Movies by video quality (480p, 720p, 1080p, 4K)

### Example Requests

```bash
# Search for movies
curl "http://localhost:3000/api/search?keyword=avengers&page=1"

# Get home page posts
curl "http://localhost:3000/api/posts/home?page=1"

# Browse girl category
curl "http://localhost:3000/api/posts/girl"

# Browse archive
curl "http://localhost:3000/api/posts/archive?page=1"

# Get Netflix web series
curl "http://localhost:3000/api/posts/web-series/netflix"

# Get action movies
curl "http://localhost:3000/api/posts/movies-by-genres/action"

# Get 2024 movies
curl "http://localhost:3000/api/posts/movies-by-year/2024"
```

## 🔧 Tech Stack  

- **Node.js** (Fastify)  
- **Axios** (for fetching data)  
- **Cheerio** (for HTML parsing)
- **Puppeteer** (for Cloudflare bypass)

## ❗ Deployment Note  

This API works perfectly on local machines. However, deploying it on free platforms like Vercel or Render may face Cloudflare protection challenges. Cloudflare bypass has been implemented locally.

If you have experience deploying web scraping APIs, contributions are welcome!



🤝 Contributing

If you have experience with deploying web scraping APIs on Vercel, Render, or any other free hosting service, please contribute to this project!

How to Contribute

1. Fork the repository


2. Create a new branch (git checkout -b fix-deployment)


3. Commit your changes (git commit -m "Fix deployment issue")


4. Push to your branch (git push origin fix-deployment)


5. Open a Pull Request



Any help is appreciated!

📜 License

This project is open-source and available under the MIT License.


---

💡 Contact

If you have any suggestions or questions, feel free to open an issue.

This README clearly states the project's purpose, current status, and how others can contribute. Let me know if you want any modifications!

