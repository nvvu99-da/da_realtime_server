import 'dotenv/config'
import { createServer } from 'http'
import express from 'express'
import { expressjwt } from 'express-jwt'
import path from 'path'
import { fileURLToPath } from 'url'
import SocketServer from './websocket/SocketServer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT
const app = express()
const httpServer = createServer(app)

const io = new SocketServer(httpServer)

const jwtMiddleware = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

app.use(
  jwtMiddleware.unless({
    path: ['/'],
  })
)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
