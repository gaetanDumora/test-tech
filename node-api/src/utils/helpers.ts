import {
    AgeRestrictionsType,
    DateRestrictionsType,
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
