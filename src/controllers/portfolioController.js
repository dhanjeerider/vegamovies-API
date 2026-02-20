import { validQueries } from '../config/queries.js'

export const portfolioController = async (request, reply) => {
  const baseUrl = `${request.protocol}://${request.hostname}`
  const apiPrefix = '/api'

  const documentation = {
    title: '🎬 Vegamovies API Documentation',
    description: 'Complete API documentation for Vegamovies scraper',
    version: '1.0.0',
    baseUrl: baseUrl + apiPrefix,
    endpoints: [
      {
        name: 'Home/Portfolio',
        method: 'GET',
        path: '/',
        description: 'Returns this API documentation',
        example: baseUrl + '/',
      },
      {
        name: 'Search Movies',
        method: 'GET',
        path: '/api/search',
        description: 'Search for movies by keyword',
        parameters: [
          { name: 'keyword', type: 'string', required: true, description: 'Search keyword' },
          { name: 'page', type: 'number', required: false, description: 'Page number' },
        ],
        example: `${baseUrl}${apiPrefix}/search?keyword=avengers&page=1`,
      },
      {
        name: 'Get Post Details',
        method: 'GET',
        path: '/api/post',
        description: 'Get detailed information about a specific post',
        parameters: [
          { name: 'url', type: 'string', required: true, description: 'Post URL' },
        ],
        example: `${baseUrl}${apiPrefix}/post?url=https://vegamovies.ad/example-movie`,
      },
      {
        name: 'Get Servers',
        method: 'GET',
        path: '/api/servers',
        description: 'Get available servers for a post',
        parameters: [
          { name: 'url', type: 'string', required: true, description: 'Post URL' },
        ],
        example: `${baseUrl}${apiPrefix}/servers?url=https://vegamovies.ad/example-movie`,
      },
      {
        name: 'Get Downloads',
        method: 'GET',
        path: '/api/downloads',
        description: 'Get download links for a post',
        parameters: [
          { name: 'url', type: 'string', required: true, description: 'Server URL' },
        ],
        example: `${baseUrl}${apiPrefix}/downloads?url=https://vegamovies.ad/example-server`,
      },
      {
        name: 'Browse Posts by Category',
        method: 'GET',
        path: '/api/posts/:query/:category?',
        description: 'Browse posts by predefined categories and queries',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'Query type (see valid queries below)' },
          { name: 'category', type: 'string', required: false, description: 'Category (required for some queries)' },
          { name: 'page', type: 'number', required: false, description: 'Page number (query parameter)' },
        ],
        examples: [
          `${baseUrl}${apiPrefix}/posts/home?page=1`,
          `${baseUrl}${apiPrefix}/posts/featured`,
          `${baseUrl}${apiPrefix}/posts/girl?page=1`,
          `${baseUrl}${apiPrefix}/posts/archive?page=1`,
          `${baseUrl}${apiPrefix}/posts/postpaid?page=1`,
          `${baseUrl}${apiPrefix}/posts/anime-series`,
          `${baseUrl}${apiPrefix}/posts/web-series/netflix`,
          `${baseUrl}${apiPrefix}/posts/movies-by-genres/action?page=2`,
          `${baseUrl}${apiPrefix}/posts/movies-by-year/2024`,
          `${baseUrl}${apiPrefix}/posts/movies-by-quality/1080p`,
        ],
      },
    ],
    validQueries: validQueries.map((q) => ({
      query: q.query,
      categoryRequired: q.categoryRequired,
      validCategories: q.validCategories || 'N/A',
      example: q.categoryRequired
        ? `${baseUrl}${apiPrefix}/posts/${q.query}/${q.validCategories?.[0] || 'category'}`
        : `${baseUrl}${apiPrefix}/posts/${q.query}`,
    })),
    notes: [
      'All endpoints return JSON responses',
      'Use proper URL encoding for special characters',
      'Page parameter starts from 1',
      'Some categories require specific subcategories',
    ],
    responseFormat: {
      success: {
        status: 200,
        data: '[ ... array of results ... ]',
      },
      error: {
        status: 'error code',
        message: 'error description',
      },
    },
  }

  reply.type('text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentation.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            font-size: 1.8em;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            transition: transform 0.2s;
        }
        
        .endpoint:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .endpoint h3 {
            color: #333;
            margin-bottom: 10px;
            font-size: 1.4em;
        }
        
        .method {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .path {
            display: inline-block;
            background: #333;
            color: white;
            padding: 5px 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        .description {
            margin: 15px 0;
            color: #555;
        }
        
        .params {
            margin: 15px 0;
        }
        
        .param {
            background: white;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        
        .param-name {
            font-weight: bold;
            color: #667eea;
        }
        
        .required {
            color: #dc3545;
            font-size: 0.85em;
        }
        
        .example {
            background: #2d3748;
            color: #48bb78;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin-top: 10px;
        }
        
        .query-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        
        .query-name {
            font-weight: bold;
            color: #667eea;
            font-size: 1.1em;
        }
        
        .badge {
            display: inline-block;
            padding: 3px 10px;
            background: #ffc107;
            color: #333;
            border-radius: 15px;
            font-size: 0.8em;
            margin-left: 10px;
        }
        
        .note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            .content {
                padding: 20px;
            }
            
            .example {
                font-size: 0.75em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${documentation.title}</h1>
            <p>${documentation.description}</p>
            <p>Version: ${documentation.version}</p>
            <p><strong>Base URL:</strong> <code>${documentation.baseUrl}</code></p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>📡 API Endpoints</h2>
                ${documentation.endpoints
                  .map(
                    (endpoint) => `
                    <div class="endpoint">
                        <h3>${endpoint.name}</h3>
                        <div>
                            <span class="method">${endpoint.method}</span>
                            <span class="path">${endpoint.path}</span>
                        </div>
                        <p class="description">${endpoint.description}</p>
                        ${
                          endpoint.parameters
                            ? `
                            <div class="params">
                                <strong>Parameters:</strong>
                                ${endpoint.parameters
                                  .map(
                                    (param) => `
                                    <div class="param">
                                        <span class="param-name">${param.name}</span>
                                        <span class="required">${param.required ? '*required' : 'optional'}</span>
                                        - ${param.description} <code>(${param.type})</code>
                                    </div>
                                `
                                  )
                                  .join('')}
                            </div>
                        `
                            : ''
                        }
                        ${
                          endpoint.example
                            ? `<div class="example">Example: ${endpoint.example}</div>`
                            : ''
                        }
                        ${
                          endpoint.examples
                            ? endpoint.examples
                                .map((ex) => `<div class="example">Example: ${ex}</div>`)
                                .join('')
                            : ''
                        }
                    </div>
                `
                  )
                  .join('')}
            </div>
            
            <div class="section">
                <h2>🔍 Valid Query Types</h2>
                <p>Use these query types with the <code>/api/posts/:query/:category?</code> endpoint:</p>
                ${documentation.validQueries
                  .map(
                    (q) => `
                    <div class="query-item">
                        <div class="query-name">
                            ${q.query}
                            ${q.categoryRequired ? '<span class="badge">Category Required</span>' : ''}
                        </div>
                        ${
                          q.categoryRequired && q.validCategories !== 'N/A'
                            ? `<p><strong>Valid Categories:</strong> ${
                                Array.isArray(q.validCategories)
                                  ? q.validCategories.join(', ')
                                  : q.validCategories
                              }</p>`
                            : ''
                        }
                        <div class="example">${q.example}</div>
                    </div>
                `
                  )
                  .join('')}
            </div>
            
            <div class="section">
                <h2>📝 Important Notes</h2>
                ${documentation.notes.map((note) => `<div class="note">• ${note}</div>`).join('')}
            </div>
            
            <div class="section">
                <h2>📊 Response Format</h2>
                <div class="endpoint">
                    <h3>Success Response</h3>
                    <div class="example">${JSON.stringify(documentation.responseFormat.success, null, 2)}</div>
                </div>
                <div class="endpoint">
                    <h3>Error Response</h3>
                    <div class="example">${JSON.stringify(documentation.responseFormat.error, null, 2)}</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Made with ❤️ for Vegamovies API | © ${new Date().getFullYear()}</p>
            <p>For support and updates, visit the repository</p>
        </div>
    </div>
</body>
</html>
  `)
}
