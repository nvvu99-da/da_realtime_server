import {Server} from 'socket.io';
import {createClient} from 'redis'
import {RedisAdapter} from './RedisAdapter'

export default class SocketServer extends Server {
  constructor(...args) {
    super(...args)

    this.connectAdapter()
  }

  connectAdapter = async () => {
    const pubClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      }
    })
    const subClient = pubClient.duplicate()
    await pubClient.connect()
    await subClient.connect()

    const redisAdapter = new RedisAdapter(pubClient, subClient)

    this.on('connection', (socket) => {
      socket.onAny(redisAdapter.emit)
    })

    redisAdapter.onAny((event, data) => {
      this.in(data.socket).emit(event, data)
    })
  }
}
