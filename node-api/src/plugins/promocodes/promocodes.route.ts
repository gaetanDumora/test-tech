import { FastifyInstance } from 'fastify'
import {
    registerPromocodeHandler,
    validatePromocodeHandler,
} from './promocodes.controller'
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
    server.post(
        '/validate',
        {
            schema: {
                body: $ref('validatePromocodePayload'),
                response: {
                    202: $ref('validatedPromocodeResponse'),
                },
            },
        },
        validatePromocodeHandler,
    )
}
