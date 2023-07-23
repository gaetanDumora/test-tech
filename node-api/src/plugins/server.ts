import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

export const startServer = fp(async function (server: FastifyInstance) {
    // Hooks
    server.addHook('onRequest', async (request) => {
        server.log.info({ request }, 'incoming request')
    })
    server.addHook('onResponse', async (request, reply) => {
        server.log.info({ request, reply }, 'request completed')
    })
    server.addHook('onSend', async (request, reply) => {
        reply.header('Cache-Control', 'no-store')
    })
    server.setErrorHandler((err, request, reply) => {
        if (reply.statusCode >= 500) {
            request.log.error({ request, reply, err }, err && err.message)
        } else if (reply.statusCode >= 400) {
            request.log.info({ request, reply, err }, err && err.message)
        }

        if (reply.statusCode >= 500) {
            reply.send(err)
        } else {
            reply.send(err)
        }
    })
})
