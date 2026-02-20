/**
 * Debug tool to inspect HTML structure from vegamovies.ad
 * This helps us understand how to better extract download information
 */

async function inspectPage() {
  const url = 'https://vegamovies.ad/49221-the-night-agent-2026-season-3-hindi-dual-audio-web-dl-720p-480p-1080p-all-episodes.html'
  
  try {
    const response = await fetch(`http://localhost:3000/api/post?url=${encodeURIComponent(url)}`)
    const data = await response.json()
    
    console.log('\n' + '='.repeat(80))
    console.log('📊 EXTRACTION RESULTS')
    console.log('='.repeat(80))
    
    console.log('\n📝 Title:', data.data.title)
    console.log('📺 Type:', data.data.type)
    console.log('📄 Synopsis:', data.data.synopsis.substring(0, 100) + '...')
    console.log('🖼️  Images:', data.data.images.length, 'found')
    
    console.log('\n' + '='.repeat(80))
    console.log('📥 DOWNLOAD SERVERS (' + data.data.servers.length + ' found)')
    console.log('='.repeat(80))
    
    data.data.servers.forEach((server, index) => {
      console.log(`\n[${index + 1}] ${server.downloadtitle}`)
      console.log(`    Quality: ${server.quality || 'N/A'}`)
      console.log(`    Size: ${server.size || 'N/A'}`)
      console.log(`    Links: ${server.links.length}`)
      server.links.forEach((link, i) => {
        console.log(`      ${i + 1}. [${link.serverName}] ${link.url}`)
      })
    })
    
    console.log('\n' + '='.repeat(80))
    
    // Check if we got everything
    if (data.data.servers.length > 0) {
      console.log('✅ SUCCESS: Download links extracted!')
      
      const withQuality = data.data.servers.filter(s => s.quality).length
      const withSize = data.data.servers.filter(s => s.size).length
      
      console.log(`   - Servers with quality info: ${withQuality}/${data.data.servers.length}`)
      console.log(`   - Servers with size info: ${withSize}/${data.data.servers.length}`)
      
      if (withQuality === 0 || withSize === 0) {
        console.log('\n⚠️  WARNING: Quality/Size information not being extracted')
        console.log('   This is likely because the HTML structure is different than expected')
      }
    } else {
      console.log('❌ ERROR: No download links found!')
    }
    
    console.log('\n' + '='.repeat(80))
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

inspectPage()
