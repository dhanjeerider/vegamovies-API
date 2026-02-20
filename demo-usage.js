/**
 * ===============================================
 * Vegamovies API - Live Scraping Demo
 * ===============================================
 * 
 * This demo shows how to fetch single URLs and scrape live content
 * from https://vegamovies.ad/
 */

// Example 1: Using fetch API (Node.js 18+)
async function fetchPostDetails_Method1() {
  const url = 'https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html'
  
  const apiUrl = `http://localhost:3000/api/post?url=${encodeURIComponent(url)}`
  
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    console.log('✅ Method 1 - Full URL:')
    console.log('Title:', data.data.title)
    console.log('Type:', data.data.type)
    console.log('Synopsis:', data.data.synopsis.substring(0, 100) + '...')
    console.log('Images:', data.data.images.length)
    console.log('Servers:', data.data.servers.length)
    console.log('\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Example 2: Using just the post ID
async function fetchPostDetails_Method2() {
  const postId = '49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html'
  
  const apiUrl = `http://localhost:3000/api/post?url=${encodeURIComponent(postId)}`
  
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    console.log('✅ Method 2 - Post ID Only:')
    console.log('Title:', data.data.title)
    console.log('Type:', data.data.type)
    console.log('\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Example 3: Using axios (if installed)
async function fetchPostDetails_Method3() {
  // Uncomment if you have axios installed
  /*
  const axios = require('axios')
  
  const url = 'https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html'
  
  try {
    const { data } = await axios.get('http://localhost:3000/api/post', {
      params: { url }
    })
    
    console.log('✅ Method 3 - Using Axios:')
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
  */
}

// Example 4: Batch fetching multiple posts
async function fetchMultiplePosts() {
  const urls = [
    'https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html',
    // Add more URLs here
  ]
  
  console.log('🔄 Fetching multiple posts...\n')
  
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const apiUrl = `http://localhost:3000/api/post?url=${encodeURIComponent(url)}`
        const response = await fetch(apiUrl)
        const data = await response.json()
        return data
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message)
        return null
      }
    })
  )
  
  results.forEach((result, index) => {
    if (result && result.status) {
      console.log(`${index + 1}. ${result.data.title}`)
    }
  })
  console.log('\n')
}

// Example 5: Search and fetch details
async function searchAndFetchDetails() {
  // First, search for content
  const searchUrl = 'http://localhost:3000/api/search?keyword=night+agent'
  
  try {
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()
    
    console.log('🔍 Search Results:\n')
    
    if (searchData.status && searchData.data.length > 0) {
      // Get details of the first result
      const firstResult = searchData.data[0]
      console.log('First result:', firstResult.title)
      
      if (firstResult.url) {
        const detailUrl = `http://localhost:3000/api/post?url=${encodeURIComponent(firstResult.url)}`
        const detailResponse = await fetch(detailUrl)
        const detailData = await detailResponse.json()
        
        console.log('\n📄 Detailed Information:')
        console.log('Title:', detailData.data.title)
        console.log('Synopsis:', detailData.data.synopsis)
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Example 6: cURL command equivalents
function showCurlExamples() {
  console.log('📝 cURL Command Examples:\n')
  
  console.log('1. Fetch post with full URL:')
  console.log('curl "http://localhost:3000/api/post?url=https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html"\n')
  
  console.log('2. Fetch post with ID only:')
  console.log('curl "http://localhost:3000/api/post?url=49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html"\n')
  
  console.log('3. Search for content:')
  console.log('curl "http://localhost:3000/api/search?keyword=night+agent&page=1"\n')
  
  console.log('4. Browse home page:')
  console.log('curl "http://localhost:3000/api/posts/home"\n')
  
  console.log('5. Get download servers (after getting post details):')
  console.log('curl "http://localhost:3000/api/servers?url=YOUR_URL_HERE"\n')
  
  console.log('6. Get download links:')
  console.log('curl "http://localhost:3000/api/downloads?url=SERVER_URL_HERE"\n')
}

// Run all demos
async function runAllDemos() {
  console.log('\n' + '='.repeat(60))
  console.log('🎬 Vegamovies API - Live Scraping Demo')
  console.log('='.repeat(60) + '\n')
  
  await fetchPostDetails_Method1()
  await fetchPostDetails_Method2()
  // await fetchMultiplePosts()
  // await searchAndFetchDetails()
  
  showCurlExamples()
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ Demo Complete!')
  console.log('='.repeat(60) + '\n')
}

// Run the demo
runAllDemos().catch(console.error)
