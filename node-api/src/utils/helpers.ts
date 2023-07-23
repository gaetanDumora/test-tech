import {
    AgeRestrictionsType,
    DateRestrictionsType,
} from '../plugins/promocodes/promocodes.schema'

export const verifyDateRange = (dateRestrictions: DateRestrictionsType) => {
    const now = new Date()
    const { after, before } = dateRestrictions
    if (after && before) {
        const afterDate = new Date(after)
        const beforeDate = new Date(before)

        if (beforeDate < afterDate) {
            throw new Error(
                `${before} date can not be supperior to ${afterDate}`,
            )
        }

        return now > afterDate && now < beforeDate
    }
    if (after) {
        return now > new Date(after)
    }
    return before && now < new Date(before)
}
export const verifyAgeRange = (
    ageRestriction: AgeRestrictionsType,
    age: number,
) => {
    const { eq, gt, lt } = ageRestriction

    if ((eq && gt && lt) || (eq && (gt || lt))) {
        throw new Error('wrong age condition provided')
    }

    const isGreater = gt && age > gt
    const isFewer = lt && age < lt

    if (gt && lt) return isGreater && isFewer
    if (gt) return isGreater
    if (lt) return isFewer

    return age === eq
}
