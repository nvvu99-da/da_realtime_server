import config from '../config'

export class RedisAdapter {
  constructor(pubClient, subClient) {
    this.pubClient = pubClient
    this.subClient = subClient

    const responseChannel = config.redis.channels.responseFromMainServer
    this.subClient.subscribe(responseChannel, (message, _) => {
      const { event, data } = JSON.parse(message)
      this.listener(event, data)
    })
  }

  onAny = (listener) => {
    this.listener = listener
  }

  emit = (event, data) => {
    const message = JSON.stringify({
      event,
      data,
    })
    const requestChannel = config.redis.channels.requestToMainServer
    this.pubClient.publish(requestChannel, message)
  }
}
