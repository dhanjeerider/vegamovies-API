import { interceptor } from '../services/instance.js'
import { load } from 'cheerio'

export const debugController = async (request, reply) => {
  try {
    const { url } = request.query
    if (!url) {
      return reply.code(400).send({ error: 'url parameter is required' })
    }

    // Extract ID from URL
    let postId = url
    if (url.includes('vegamovies.ad/')) {
      postId = url.split('vegamovies.ad/')[1]
    }

    const endpoint = postId.startsWith('/') ? postId : `/${postId}`
    const obj = await interceptor(endpoint)

    if (!obj.status) {
      return reply.code(500).send({ error: 'Failed to fetch page', details: obj })
    }

    const $ = load(obj.data)
    const infoContainer = $('.entry-content, .post-inner, .post-body, article')

    // Find all headings and their surrounding content
    const sections = []
    
    infoContainer.find('h1, h2, h3, h4, h5, h6, p, div').each((index, el) => {
      const text = $(el).text().trim()
      
      // Look for download-related content
      if (text.match(/download|click here|\d+p|\d+\s*(MB|GB)|episode/i)) {
        const tagName = el.name
        const className = $(el).attr('class') || 'no-class'
        const html = $(el).html()?.substring(0, 200)
        
        // Get all links in this element or its siblings
        const links = []
        $(el).find('a').each((_, linkEl) => {
          links.push({
            text: $(linkEl).text().trim(),
            href: $(linkEl).attr('href'),
          })
        })
        
        // Check next siblings for links
        let nextEl = $(el).next()
        for (let i = 0; i < 3 && nextEl.length; i++) {
          nextEl.find('a').each((_, linkEl) => {
            links.push({
              text: $(linkEl).text().trim(),
              href: $(linkEl).attr('href'),
              fromSibling: true,
            })
          })
          nextEl = nextEl.next()
        }
        
        if (text.length < 300) {
          sections.push({
            index,
            tag: tagName,
            class: className,
            text: text.substring(0, 150),
            html: html,
            links: links,
          })
        }
      }
    })

    reply.type('text/html').send(`
<!DOCTYPE html>
<html>
<head>
    <title>HTML Structure Debug</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
        .section { background: #252525; margin: 20px 0; padding: 15px; border-left: 3px solid #007acc; }
        .tag { color: #4ec9b0; font-weight: bold; }
        .class { color: #dcdcaa; }
        .text { color: #ce9178; margin: 10px 0; }
        .html { color: #9cdcfe; margin: 10px 0; white-space: pre-wrap; word-break: break-all; }
        .links { background: #1e1e1e; padding: 10px; margin: 10px 0; }
        .link { color: #569cd6; margin: 5px 0; }
        h1 { color: #4ec9b0; }
        .summary { background: #252525; padding: 15px; border: 2px solid #4ec9b0; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>🔍 HTML Structure Debug Tool</h1>
    <div class="summary">
        <strong>URL:</strong> ${url}<br>
        <strong>Sections Found:</strong> ${sections.length}<br>
        <strong>Total Links:</strong> ${sections.reduce((sum, s) => sum + s.links.length, 0)}
    </div>
    
    ${sections
      .map(
        (section) => `
        <div class="section">
            <div><span class="tag">&lt;${section.tag}&gt;</span> <span class="class">${section.class}</span></div>
            <div class="text"><strong>Text:</strong> ${section.text}</div>
            <div class="html"><strong>HTML:</strong> ${section.html}</div>
            ${
              section.links.length > 0
                ? `
                <div class="links">
                    <strong>Links (${section.links.length}):</strong>
                    ${section.links
                      .map(
                        (link) => `
                        <div class="link">
                            • [${link.text || 'no text'}] ${link.fromSibling ? '(from sibling)' : ''}<br>
                            &nbsp;&nbsp;→ ${link.href || 'no href'}
                        </div>
                    `
                      )
                      .join('')}
                </div>
            `
                : ''
            }
        </div>
    `
      )
      .join('')}
</body>
</html>
    `)
  } catch (error) {
    reply.code(500).send({ error: error.message })
  }
}
