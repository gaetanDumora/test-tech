import { PromocodeType } from './promocodes.schema'

const DB: Map<string | number, PromocodeType> = new Map()

export const promocodeDB = {
    get: (id: number): Promise<PromocodeType | undefined> => {
        return new Promise((resolve, reject) => {
            if (DB.has(id)) {
                const promocode = DB.get(id)
                resolve(promocode)
            } else {
                reject(`promocode ${id} doesn't exist`)
            }
        })
    },
    insert: (promocode: PromocodeType): Promise<{ id: string }> => {
        return new Promise((resolve) => {
            DB.set(promocode._id, promocode)
            resolve({ id: promocode._id })
        })
    },
}
