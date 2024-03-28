# @isekaimaouyoki-sama/fastify-lavinmq

This is a small wrapper around [LavinMQ](https://lavinmq.com/).

## Install
```
npm install --save @isekaimaouyoki-sama/fastify-lavinmq
```

## Usage

Easy to use require/import this plugin as below

```js
const path = require('path')
const fastify = require('fastify')()

fastify.register(
  require('@isekaimaouyoki-sama/fastify-lavinmq'),
  { 
    url: "<connection-url>"
  }
)

fastify.get("/", async function(request, reply) {
  var data

  const channel = await fastify.lavinmq.connection.channel()
  const queue = await channel.queue()
  const consumer = await queue.subscribe({ noAck: true }, async (msg) => {
    data = msg.bodyToString()
    await consumer.cancel()
    reply.send(data)
  })

  await queue.publish("Hello World", { deliveryMode: 2 })
  await consumer.wait()
  await fastify.lavinmq.connection.close()
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```