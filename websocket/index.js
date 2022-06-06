import {createClient} from 'redis'
import {RedisAdapter} from './RedisAdapter'

export default function handleSocketIO(io) {
  io.on('connection', (socket) => {
    const pubClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      }
    })
    const subClient = pubClient.duplicate()
    const redisAdapter = new RedisAdapter(pubClient, subClient)

    socket.onAny(redisAdapter.emit)
  })
}
