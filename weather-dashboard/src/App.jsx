import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiSearch, FiRefreshCw, FiMapPin, FiDroplet, FiWind, FiAlertCircle } from 'react-icons/fi'
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export default WeatherDashboard