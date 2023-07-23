import { FastifyInstance } from 'fastify'
import { registerPromocodeHandler } from './promocodes.controller'
import { $ref } from './promocodes.schema'

export async function promocodeRoutes(server: FastifyInstance) {
    server.post(
        '/register',
        {
            schema: {
                body: $ref('promocodePayload'),
                response: {
                    202: $ref('promocodeResponse'),
                },
            },
        },
        registerPromocodeHandler,
    )
}
