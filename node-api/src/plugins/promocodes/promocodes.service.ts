import { Conditions, deepVerify } from '../../utils/helpers'
import { DB } from '../database/database'
import { PromocodeType, RestrictionsValues } from './promocodes.schema'

export const promocodeDB = {
    get: (name: string): Promise<PromocodeType> => {
        return new Promise((resolve, reject) => {
            if (DB.has(name)) {
                const promocode = DB.get(name)
                resolve(promocode!)
            } else {
                reject(`promocode ${name} doesn't exist`)
            }
        })
    },
    insert: (promocode: PromocodeType): Promise<{ id: string }> => {
        return new Promise((resolve) => {
            DB.set(promocode.name, promocode)
            resolve({ id: promocode._id })
        })
    },
}

export const promocodeValidator = async (
    restrictions: RestrictionsValues[],
    conditions: Conditions,
) => {
    const verifiedRestrictions = []
    for await (const restriction of restrictions) {
        const { results } = await deepVerify(restriction, conditions)
        verifiedRestrictions.push(results)
    }
    return verifiedRestrictions.flat()
}
