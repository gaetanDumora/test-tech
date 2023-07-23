import {
    AgeRestrictionsType,
    BinaryKeys,
    DateRestrictionsType,
    DeepRestrictionsType,
    RestrictionsKeys,
    RestrictionsValues,
    ValidatePromocodeType,
    WeatherRestrictionsType,
} from '../plugins/promocodes/promocodes.schema'
import { getWeatherAtCity } from '../plugins/weather/weather.service'

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
export const verifyWeather = async (
    weatherRestriction: WeatherRestrictionsType,
    city: string,
) => {
    const {
        temp: { eq, gt, lt },
    } = weatherRestriction

    const { is, temp } = await getWeatherAtCity(city)

    if ((eq && gt && lt) || (eq && (gt || lt))) {
        throw new Error('wrong weather condition provided')
    }

    const isGreater = gt && temp > parseInt(gt, 10)
    const isFewer = lt && temp < parseInt(lt, 10)
    const isSameDescription = weatherRestriction.is === is

    if (gt && lt) return isGreater && isFewer && isSameDescription
    if (gt) return isGreater && isSameDescription
    if (lt) return isFewer && isSameDescription
    if (eq) return temp === parseInt(eq, 10) && isSameDescription
}

type CachedResult = {
    context?: BinaryKeys
    results: { key: string; result: boolean }[]
}
type Conditions = Pick<ValidatePromocodeType, 'arguments'>

const addToCache = (
    cachedResults: CachedResult[],
    resultToAdd: { key: string; result: boolean },
    context?: BinaryKeys,
) => {
    const last = cachedResults.at(-1)

    last && context === last.context
        ? last.results.push(resultToAdd)
        : cachedResults.push({ context, results: [resultToAdd] })

    return cachedResults
}
export const deepVerify = (
    restriction: DeepRestrictionsType | RestrictionsValues,
    conditions: Conditions,
) => {
    const results: CachedResult[] = []
    const actionsByKey: { [key in RestrictionsKeys]?: any } = {
        '@age': verifyAgeRange,
        '@date': verifyDateRange,
        '@meteo': verifyWeather,
    }

    const deepTraverse = (
        restriction: DeepRestrictionsType | RestrictionsValues,
        conditions: Conditions,
        context?: BinaryKeys,
    ) => {
        for (const [key, value] of Object.entries(restriction)) {
            // Simply an object, let get and store its result
            if (!Array.isArray(value)) {
                const result = actionsByKey[key as RestrictionsKeys](
                    value,
                    conditions,
                )
                addToCache(results, { key, result }, context)
            }
            // If not, group the rest to be ready for the next loop
            else {
                const nextRestriction = value.reduce((acc, curr) => {
                    return { ...acc, ...curr }
                })
                // Continue until we can verify the next object
                deepTraverse(nextRestriction, conditions, key as BinaryKeys)
            }
        }
    }

    deepTraverse(restriction, conditions)
    return { results }
}
