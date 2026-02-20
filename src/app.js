import Fastify from 'fastify'
import cors from '@fastify/cors'
import routes from './routes/routes.js'
import { portfolioController } from './controllers/index.js'

const app = Fastify()

app.register(cors, {
  origin: '*',
})
app.register(routes, { prefix: '/api' })
app.get('/', portfolioController)

export default app
