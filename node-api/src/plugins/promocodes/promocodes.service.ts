import { PromocodeType } from './promocodes.schema'

const DB: Map<string | number, PromocodeType> = new Map()

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
