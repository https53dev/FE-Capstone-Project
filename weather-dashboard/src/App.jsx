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

  useEffect(() => {
    if (autoRefresh && city.trim()) {
      const interval = setInterval(() => {
        fetchWeatherData(city)
      }, 5 * 60 * 1000) // 5 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefresh, city, unit])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-weather-primary mb-8">
        Weather Dashboard
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-weather-primary focus:border-transparent"
            placeholder="Enter city name..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-weather-primary hover:bg-weather-secondary text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Unit Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-weather-primary"></div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              Auto Refresh (5 min)
            </span>
          </label>
        </div>
        <button
          onClick={toggleUnit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-full transition-colors duration-300"
        >
          °{unit === 'metric' ? 'C' : 'F'}
        </button>
      </div>

       {/* Error Message */}
       {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-red-500" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-weather-primary"></div>
        </div>
      )}

      {/* Weather Data */}
      {weatherData && !loading && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FiMapPin className="text-weather-primary" />
                  {weatherData.name}, {weatherData.sys.country}
                </h2>
                <p className="text-gray-600">{formatDate(weatherData.dt)}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="text-weather-primary hover:text-weather-secondary transition-colors duration-300"
                title="Refresh"
              >
                <FiRefreshCw className="text-xl" />
              </button>
            </div>
}
export default WeatherDashboard