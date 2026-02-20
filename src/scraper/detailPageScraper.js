import { extractDetail } from '../extractor/index.js'
import { interceptor } from '../services/instance.js'
export const detailPageScraper = async (id = null) => {
  try {
    // Ensure the ID starts with a slash
    const endpoint = id.startsWith('/') ? id : `/${id}`
    
    const obj = await interceptor(endpoint)

    if (!obj.status) {
      return obj
    }

    const response = extractDetail(obj.data)

    return response
  } catch (error) {
    return { status: false, message: error.message }
  }
}
