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
  const [unit, setUnit] = useState('metric')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    const iconSize = isMobile ? 'text-5xl' : 'text-6xl'
    switch (condition) {
      case 'Clear':
        return <WiDaySunny className={`text-yellow-400 ${iconSize}`} />
      case 'Clouds':
        return <WiCloudy className={`text-gray-400 ${iconSize}`} />
      case 'Rain':
      case 'Drizzle':
        return <WiRain className={`text-blue-400 ${iconSize}`} />
      case 'Snow':
        return <WiSnow className={`text-blue-200 ${iconSize}`} />
      case 'Thunderstorm':
        return <WiThunderstorm className={`text-purple-500 ${iconSize}`} />
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
        return <WiFog className={`text-gray-300 ${iconSize}`} />
      default:
        return <WiDaySunny className={`text-yellow-400 ${iconSize}`} />
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return isMobile 
      ? date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : date.toLocaleDateString('en-US', {
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
      }, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, city, unit])

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-weather-primary mb-4 sm:mb-8">
        Weather Dashboard
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-weather-primary focus:border-transparent text-sm sm:text-base"
            placeholder="Enter city name..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-weather-primary hover:bg-weather-secondary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <FiSearch className="sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>
      </form>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-weather-primary"></div>
            <span className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">
              Auto Refresh
            </span>
          </label>
        </div>
        <button
          onClick={toggleUnit}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-full transition-colors duration-300 text-sm sm:text-base w-full sm:w-auto"
        >
          Switch to °{unit === 'metric' ? 'F' : 'C'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !weatherData && (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-weather-primary"></div>
        </div>
      )}

      {/* Weather Data */}
      {weatherData && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FiMapPin className="text-weather-primary flex-shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-none">
                    {weatherData.name}, {weatherData.sys.country}
                  </span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {formatDate(weatherData.dt)}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="text-weather-primary hover:text-weather-secondary transition-colors duration-300 p-1"
                title="Refresh"
                aria-label="Refresh weather data"
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''} text-lg sm:text-xl`} />
              </button>
            </div>

            {/* Main Weather Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div>
                  {getWeatherIcon(weatherData.weather[0].main)}
                </div>
                <div>
                  <p className="text-4xl sm:text-5xl font-bold text-gray-800">
                    {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                  </p>
                  <p className="text-gray-600 capitalize text-sm sm:text-base">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 sm:p-4 w-full sm:w-auto">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <FiDroplet className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Humidity</p>
                      <p className="font-semibold text-sm sm:text-base">
                        {weatherData.main.humidity}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiWind className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Wind</p>
                      <p className="font-semibold text-sm sm:text-base">
                        {weatherData.wind.speed} {unit === 'metric' ? 'km/h' : 'mph'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDroplet className="text-blue-300 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Feels Like</p>
                      <p className="font-semibold text-sm sm:text-base">
                        {Math.round(weatherData.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Pressure</p>
                      <p className="font-semibold text-sm sm:text-base">
                        {weatherData.main.pressure} hPa
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-weather-primary bg-opacity-10 p-2 sm:p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Sunrise</p>
                <p className="font-semibold text-sm sm:text-base">
                  {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="bg-weather-primary bg-opacity-10 p-2 sm:p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Sunset</p>
                <p className="font-semibold text-sm sm:text-base">
                  {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="bg-weather-primary bg-opacity-10 p-2 sm:p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Visibility</p>
                <p className="font-semibold text-sm sm:text-base">
                  {(weatherData.visibility / 1000).toFixed(1)} km
                </p>
              </div>
              <div className="bg-weather-primary bg-opacity-10 p-2 sm:p-3 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Coordinates</p>
                <p className="font-semibold text-sm sm:text-base">
                  {weatherData.coord.lat.toFixed(2)}, {weatherData.coord.lon.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Powered by Dev Yussuf53
      </div>
    </div>
  )
}

export default WeatherDashboard