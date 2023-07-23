import { FastifyReply, FastifyRequest } from 'fastify'
import { PromocodeType, ValidatePromocodeType } from './promocodes.schema'
import { promocodeDB } from './promocodes.service'

export const registerPromocodeHandler = async (
    request: FastifyRequest<{ Body: PromocodeType }>,
    reply: FastifyReply,
) => {
    const promocode = request.body

    try {
        const { id } = await promocodeDB.insert(promocode)
        return reply.code(202).send({ created: true, _id: id })
    } catch (error) {
        request.log.error(error)
        return reply.code(500).send(error)
    }
}

export const validatePromocodeHandler = async (
    request: FastifyRequest<{ Body: ValidatePromocodeType }>,
    reply: FastifyReply,
) => {
    const { promocode_name, arguments: conditions } = request.body
    try {
        const { restrictions } = await promocodeDB.get(promocode_name)
    } catch (error) {
        request.log.error(error)
        return reply.code(500).send(error)
    }
}
