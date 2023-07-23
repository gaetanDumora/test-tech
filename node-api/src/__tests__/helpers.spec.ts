import {
    AgeRestrictionsType,
    DateRestrictionsType,
} from '../plugins/promocodes/promocodes.schema'
import {
    getCityCoordinates,
    getWeatherAtCity,
} from '../plugins/weather/weather.service'
import { verifyDateRange, verifyAgeRange } from '../utils/helpers'

const mock = {
    date: new Date(),
    age: 30,
    meteo: {
        is: 'clear',
        temp: 22,
        town: 'Lyon',
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
        expect(() => verifyAgeRange(ageRestriction, mock.age)).toThrow()
    })
    it('should validate the age', () => {
        const ageRestriction: AgeRestrictionsType = {
            eq: 30,
        }
        expect(verifyAgeRange(ageRestriction, mock.age)).toBe(true)
    })
    it('should validate the age range', () => {
        const ageRestriction: AgeRestrictionsType = {
            lt: 32,
            gt: 28,
        }
        expect(verifyAgeRange(ageRestriction, mock.age)).toBe(true)
    })
    it('should validate the age, because it is younger', () => {
        const ageRestriction: AgeRestrictionsType = {
            gt: 22,
        }
        expect(verifyAgeRange(ageRestriction, mock.age)).toBe(true)
    })
    it('should not validate the age, because it is too old', () => {
        const ageRestriction: AgeRestrictionsType = {
            lt: 29,
        }
        expect(verifyAgeRange(ageRestriction, mock.age)).toBe(false)
    })
})

describe('weather service', () => {
    it('should return Lyon coordinates', async () => {
        const { lat, lon } = await getCityCoordinates(mock.meteo.town)
        expect({ lat, lon }).toStrictEqual({ lat: 45.7578137, lon: 4.8320114 })
    })
    it.only('should return an error if the city is unknown', async () => {
        await expect(() => getWeatherAtCity('unknowCity')).rejects.toThrowError(
            `unknow city: unknowCity`,
        )
    })
})
