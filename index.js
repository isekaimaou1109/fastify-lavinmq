import wrapper from 'fastify-plugin'
import { AMQPClient } from '@cloudamqp/amqp-client'

function lavinMQPlugin(fastify, options, complete) {
  if (options.url && typeof options.url === 'string') {
    const lavinmq = new AMQPClient(options.url)    
    let connection;

    fastify.addHook('onReady', async function () {
      try {
        connection = await lavinmq.connect()
        fastify.decorate('lavinmq', Object.freeze({
          connection
        }))
      } catch (error) {
        error.connection.close()
      }
    })

    fastify.addHook('preClose', async function() {
      await connection.close()
    })

    complete()
  }
}

export default wrapper(lavinMQPlugin, {
  name: '@isekaimaouyoki-sama/fastify-lavinmq',
  fastify: '4.x'
});
