export default {
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  channels: {
    requestToMainServer: 'request_to_main_server',
    responseFromMainServer: 'response_from_main_server'
  },
}
