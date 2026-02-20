import { load } from 'cheerio'

export const extractDetail = (html) => {
  try {
    const $ = load(html)

    const infoContainer = $('.entry-content, .post-inner, .post-body, article')

    // Extract title - try multiple selectors
    let title = infoContainer.find('h3:contains("Download")').first().text().replace(/Download|~.*$/gi, '').trim()
    
    if (!title) {
      title = $('h1.entry-title, h1.post-title, .title h1').first().text().trim()
    }
    
    if (!title) {
      title = $('title').text().split('|')[0].trim()
    }

    // Synopsis Extraction - try multiple patterns
    let synopsis = infoContainer.find('h3:contains("SYNOPSIS/PLOT"), h4:contains("synopsis"), h3:contains("Synopsis"), strong:contains("Synopsis")').next('p').text().trim()
    
    if (!synopsis) {
      synopsis = infoContainer.find('p').filter((_, el) => {
        const text = $(el).text()
        return text.length > 100 && !text.includes('Download') && !text.includes('Screenshot')
      }).first().text().trim()
    }

    // Type detection
    const type = infoContainer.find('strong:contains("Series Name"), h3:contains("Season"), h3:contains("Episode")').length ? 'series' : 'movie'
    
    // Images Extraction
    const images = []
    infoContainer.find('img').each((_, el) => {
      const imgSrc = $(el).attr('src') || $(el).attr('data-src')
      if (imgSrc && !imgSrc.includes('emoji')) {
        images.push(imgSrc)
      }
    })

    // Download Links Array - Enhanced extraction
    const servers = []
    
    // Method 1: Find headers with size information
    infoContainer.find('h3, h4, h5, h6, p').filter((_, el) => {
      const text = $(el).text()
      // Match patterns like [500MB], [1.5GB], etc.
      return text.match(/\[\s*\d+(\.\d+)?\s*(MB|GB|mb|gb)\s*\]/)
    }).each((_, el) => {
      const headerText = $(el).text().trim()
      const downloadtitle = headerText
      
      // Extract quality
      const quality = headerText.match(/(\d+p)\b/i)?.[1] || 
                     headerText.match(/(480p|720p|1080p|2160p|4K)/i)?.[1] || ''
      
      // Extract size
      const size = headerText.match(/\[\s*\d+(\.\d+)?\s*(MB|GB|mb|gb)\s*\]/i)?.[0]?.replace(/[\[\]]/g, '').trim() || ''

      // Find all links following this header
      const links = []
      
      // Look in next siblings until we hit another header
      let nextEl = $(el).next()
      let attempts = 0
      
      while (nextEl.length && attempts < 10) {
        attempts++
        
        // Check if we hit another download header
        if (nextEl.is('h3, h4, h5, h6') && nextEl.text().match(/\[\s*\d+(\.\d+)?\s*(MB|GB)\s*\]/)) {
          break
        }
        
        // Extract links from this element
        nextEl.find('a').each((_, linkEl) => {
          const url = $(linkEl).attr('href')
          if (url && url.startsWith('http')) {
            const serverName = $(linkEl).text().trim() || 
                             $(linkEl).find('button, span, strong').text().trim() || 
                             'Download'
            
            links.push({ url, serverName })
          }
        })
        
        // Also check if the element itself is a link
        if (nextEl.is('a')) {
          const url = nextEl.attr('href')
          if (url && url.startsWith('http')) {
            const serverName = nextEl.text().trim() || 
                             nextEl.find('button, span, strong').text().trim() || 
                             'Download'
            links.push({ url, serverName })
          }
        }
        
        nextEl = nextEl.next()
      }
      
      if (links.length > 0) {
        servers.push({
          downloadtitle,
          quality,
          size,
          links,
        })
      }
    })

    // Method 2: If no servers found, look for any download section
    if (servers.length === 0) {
      console.log('No servers found with Method 1, trying alternative approach...')
      
      // Find all links that might be download links
      infoContainer.find('a').each((_, linkEl) => {
        const url = $(linkEl).attr('href')
        const linkText = $(linkEl).text().trim()
        const parentText = $(linkEl).parent().text()
        
        // Check if this looks like a download link
        if (url && url.startsWith('http') && 
            (linkText.toLowerCase().includes('download') || 
             linkText.toLowerCase().includes('server') ||
             parentText.match(/\d+p/) ||
             parentText.match(/\d+\s*(MB|GB)/))) {
          
          const serverName = linkText || $(linkEl).find('button, span').text().trim() || 'Download Link'
          
          // Try to find quality and size from parent or surrounding text
          const surroundingText = $(linkEl).parent().text() + ' ' + $(linkEl).prev().text()
          const quality = surroundingText.match(/(\d+p)\b/)?.[1] || ''
          const size = surroundingText.match(/\d+(\.\d+)?\s*(MB|GB)/i)?.[0] || ''
          
          servers.push({
            downloadtitle: surroundingText.substring(0, 100).trim() || 'Download',
            quality,
            size,
            links: [{ url, serverName }]
          })
        }
      })
    }

    console.log(`Extracted: ${servers.length} download sections`)

    return {
      title,
      type,
      synopsis,
      images,
      servers,
    }
  } catch (error) {
    console.error('Error extracting details:', error)
    return null
  }
}
