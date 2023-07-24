import { FastifyReply, FastifyRequest } from 'fastify'
import {
    PromocodeType,
    RestrictionsValues,
    ValidatePromocodeType,
} from './promocodes.schema'
import { promocodeDB, promocodeValidator } from './promocodes.service'
import { shouldApprove } from '../../utils/helpers'

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
        const { restrictions, avantage, name } = await promocodeDB.get(
            promocode_name,
        )
        const result = await promocodeValidator(
            restrictions as RestrictionsValues[],
            conditions,
        )
        const { reason } = shouldApprove(result)

        if (reason) {
            return reply.code(500).send({
                promocode_name: name,
                status: 'denied',
                avantage,
                reason,
            })
        }
        return reply.code(202).send({
            promocode_name: name,
            status: 'accepted',
            avantage,
        })
    } catch (error) {
        request.log.error(error)
        return reply.code(500).send(error)
    }
}
