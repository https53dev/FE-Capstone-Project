import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiSearch, FiRefreshCw, FiMapPin, FiDroplet, FiWind, FiAlertCircle } from 'react-icons/fi'
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const WeatherDashboard = () => {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('metric') // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchWeatherData = async (cityName) => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`
      )
      setWeatherData(response.data)
      setError('')
    } catch (err) {
      setError('City not found. Please try again.')
      setWeatherData(null)
      console.error('Error fetching weather data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeatherData(city)
    }
  }

  const handleRefresh = () => {
    if (city.trim()) {
      fetchWeatherData(city)
    }
  }

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric')
    if (city.trim()) {
      fetchWeatherData(city)
    }
  }

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <WiDaySunny className="text-yellow-400 text-6xl" />
      case 'Clouds':
        return <WiCloudy className="text-gray-400 text-6xl" />
      case 'Rain':
      case 'Drizzle':
        return <WiRain className="text-blue-400 text-6xl" />
      case 'Snow':
        return <WiSnow className="text-blue-200 text-6xl" />
      case 'Thunderstorm':
        return <WiThunderstorm className="text-purple-500 text-6xl" />
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
        return <WiFog className="text-gray-300 text-6xl" />
      default:
        return <WiDaySunny className="text-yellow-400 text-6xl" />
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
export default WeatherDashboard