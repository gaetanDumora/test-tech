import axios from 'axios'

const WEATHER_API_DOMAIN = 'http://api.openweathermap.org'
const TOKEN = 'd0562f476913da692a065c608d0539f6'

type CityResponseType = {
    name: string
    local_names: Record<string, string>
    lat: number
    lon: number
    country: string
    state: string
}

type WeatherResponseType = {
    main: {
        temp: number
    }
    weather: { id: number; main: string; description: string }[]
}

export const getCityCoordinates = async (city: string) => {
    const queryURL = `${WEATHER_API_DOMAIN}/geo/1.0/direct?q=${city}&limit=1&appid=${TOKEN}`
    const { data, status } = await axios.get<CityResponseType[]>(queryURL)
    if (status === 200 && data.length) {
        const { lat, lon } = data[0]
        return { lat, lon }
    } else {
        throw new Error(`unknow city: ${city}`)
    }
}

export const getWeatherAtCity = async (city: string) => {
    const { lat, lon } = await getCityCoordinates(city)
    const queryURL = `${WEATHER_API_DOMAIN}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${TOKEN}`
    const { data } = await axios.get<WeatherResponseType>(queryURL)
    const { main, weather } = data
    return {
        temp: main.temp,
        is: weather[0].main,
    }
}
