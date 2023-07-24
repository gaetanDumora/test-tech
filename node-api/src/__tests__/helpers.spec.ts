import {
    AgeRestrictionsType,
    DateRestrictionsType,
    RestrictionsValues,
} from '../plugins/promocodes/promocodes.schema'
import { promocodeValidator } from '../plugins/promocodes/promocodes.service'
import {
    getCityCoordinates,
    getWeatherAtCity,
} from '../plugins/weather/weather.service'
import {
    verifyDateRange,
    verifyAgeRange,
    shouldApprove,
    Conditions,
} from '../utils/helpers'

const mock = {
    age: 30,
    meteo: { town: 'Lyon' },
    restrictions: [
        {
            '@date': {
                after: '2023-01-01',
                before: '2024-06-30',
            },
        },
        {
            '@or': [
                {
                    '@age': {
                        eq: 30,
                    },
                },
                {
                    '@and': [
                        {
                            '@age': {
                                lt: 31,
                                gt: 15,
                            },
                        },
                    ],
                },
            ],
        },
    ],
    conditions: {
        promocode_name: 'WeatherCode',
        arguments: {
            age: 25,
        },
    },
}

describe('verifyDateRange', () => {
    it('should return an error because range is not coherent', () => {
        const dateRestriction: DateRestrictionsType = {
            after: '2025-02-21T00:00:00Z',
            before: '2020-02-21T00:00:00Z',
        }
        expect(() => verifyDateRange(dateRestriction)).toThrow()
    })
    it('should validate the date range', () => {
        const dateRestriction: DateRestrictionsType = {
            after: '2020-02-21T00:00:00Z',
            before: '2025-02-21T00:00:00Z',
        }
        expect(verifyDateRange(dateRestriction)).toBe(true)
    })
    it('should validate the date', () => {
        const dateRestriction: DateRestrictionsType = {
            after: '2020-02-21T00:00:00Z',
        }
        expect(verifyDateRange(dateRestriction)).toBe(true)
    })
    it('should not validate the date', () => {
        const dateRestriction: DateRestrictionsType = {
            before: '2020-02-21T00:00:00Z',
        }
        expect(verifyDateRange(dateRestriction)).toBe(false)
    })
})

describe('verifyAgeRange', () => {
    it('should return an error because range is not coherent', () => {
        const ageRestriction: AgeRestrictionsType = {
            lt: 30,
            eq: 30,
            gt: 30,
        }
        expect(() => verifyAgeRange(ageRestriction, mock)).toThrow()
    })
    it('should validate the age', () => {
        const ageRestriction: AgeRestrictionsType = {
            eq: 30,
        }
        expect(verifyAgeRange(ageRestriction, mock)).toBe(true)
    })
    it('should validate the age range', () => {
        const ageRestriction: AgeRestrictionsType = {
            lt: 32,
            gt: 28,
        }
        expect(verifyAgeRange(ageRestriction, mock)).toBe(true)
    })
    it('should validate the age, because it is younger', () => {
        const ageRestriction: AgeRestrictionsType = {
            gt: 22,
        }
        expect(verifyAgeRange(ageRestriction, mock)).toBe(true)
    })
    it('should not validate the age, because it is too old', () => {
        const ageRestriction: AgeRestrictionsType = {
            lt: 29,
        }
        expect(verifyAgeRange(ageRestriction, mock)).toBe(false)
    })
})

describe('weather service', () => {
    it('should return Lyon coordinates', async () => {
        const { lat, lon } = await getCityCoordinates(mock.meteo?.town!)
        expect({ lat, lon }).toStrictEqual({ lat: 45.7578137, lon: 4.8320114 })
    })
    it('should return an error if the city is unknown', async () => {
        await expect(() => getWeatherAtCity('unknowCity')).rejects.toThrowError(
            `unknow city: unknowCity`,
        )
    })
})

describe('promocodeValidator', () => {
    it('should approve this restriction', async () => {
        const result = await promocodeValidator(
            mock.restrictions as RestrictionsValues[],
            mock.conditions as Conditions,
        )
        const { valid } = shouldApprove(result)
        expect(valid).toBe(true)
    })
})
