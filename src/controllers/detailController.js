import { createError, createResponse } from '../helper/response.js'
import scraper from '../scraper/index.js'

export const detailController = async (request, reply) => {
  try {
    const { url } = request.query
    if (!url) return createError(reply, 400, 'url parameter is required (can be full URL or just the post ID)')

    // Extract ID from full URL if provided, otherwise use as-is
    let postId = url
    if (url.includes('vegamovies.ad/')) {
      // Extract the part after the domain
      postId = url.split('vegamovies.ad/')[1]
    } else if (url.startsWith('http')) {
      // If it's a URL but not vegamovies, extract the path
      try {
        const urlObj = new URL(url)
        postId = urlObj.pathname.substring(1) // Remove leading slash
      } catch (e) {
        postId = url
      }
    }

    console.log('Fetching post:', postId)

    const detailPage = await scraper.detailPageScraper(postId)

    return createResponse(reply, 200, detailPage)
  } catch (error) {
    return createError(reply, 500, 'internal server error at detailPage: ' + error.message)
  }
}
