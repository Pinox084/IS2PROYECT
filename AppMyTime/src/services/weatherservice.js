import axios from 'axios';




const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;


export const getWeeklyForecast = async (city = 'Concepcion', country = 'CL') => {
  try {
    // 1. Obtener coordenadas
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.data[0]) throw new Error('Ubicación no encontrada');
    const { lat, lon } = geoResponse.data[0];

    // 2. Obtener pronóstico
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );

    // 3. Procesar datos para 5 días
    return processForecastData(weatherResponse.data);
  } catch (error) {
    throw new Error(`Error al obtener clima: ${error.response?.data?.message || error.message}`);
  }
};

const processForecastData = (data) => {
  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar fecha

  // Agrupar predicciones por día
  const allPredictionsByDay = data.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    date.setHours(0, 0, 0, 0);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(item);
    return acc;
  }, {});

  // Generar los próximos 5 días (hoy + 4)
  const dailyData = Array.from({ length: 5 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const dayKey = date.toISOString().split('T')[0];
    const dayPredictions = allPredictionsByDay[dayKey] || [];
    const isToday = index === 0;

    // Encontrar primera lluvia diurna (8am-10pm)
    let firstDaytimeRain = null;
    for (const pred of dayPredictions) {
      const predDate = new Date(pred.dt * 1000);
      const hour = predDate.getHours();
      if (hour >= 8 && hour <= 22 && isRainCondition(pred.weather[0].id)) {
        firstDaytimeRain = pred;
        break;
      }
    }

    const representativePred = firstDaytimeRain || 
                             (dayPredictions[Math.floor(dayPredictions.length / 2)] || 
                              dayPredictions[0]);

    // Si no hay datos para ese día, usar valores por defecto
    if (!representativePred) {
      return {
        day: daysOfWeek[date.getDay()],
        date: formatSpanishDate(date),
        isToday,
        dateObj: date,
        weather: {
          condition: 'Datos no disponibles',
          description: '',
          icon: '01d',
          temp: '--°C',
          temp_min: '--',
          temp_max: '--',
          humidity: '--%',
          wind: '-- km/h',
          hasRain: false,
          isImportant: false
        }
      };
    }

    return {
      day: daysOfWeek[date.getDay()],
      date: formatSpanishDate(date),
      isToday,
      dateObj: date,
      weather: {
        condition: translateWeather(representativePred.weather[0].main),
        description: representativePred.weather[0].description,
        icon: representativePred.weather[0].icon,
        temp: isToday ? Math.round(representativePred.main.temp) : null,
        temp_min: dayPredictions.length > 0 
          ? Math.min(...dayPredictions.map(p => p.main.temp_min)) 
          : '--',
        temp_max: dayPredictions.length > 0 
          ? Math.max(...dayPredictions.map(p => p.main.temp_max)) 
          : '--',
        humidity: `${representativePred.main.humidity}%`,
        wind: `${(representativePred.wind.speed * 3.6).toFixed(1)} km/h`,
        hasRain: !!firstDaytimeRain,
        isImportant: !!firstDaytimeRain && !isToday
      }
    };
  });

  // Calcular promedios y formatear
  dailyData.forEach(day => {
    if (day.weather.temp !== null) {
      day.weather.temp = `${day.weather.temp}°C`;
    } else {
      const avg = (Number(day.weather.temp_min) + Number(day.weather.temp_max)) / 2;
      day.weather.temp = !isNaN(avg) ? `${Math.round(avg)}°C` : '--°C';
    }
    
    if (day.weather.temp_min !== '--' && day.weather.temp_max !== '--') {
      day.weather.temp_range = `Min: ${Math.round(day.weather.temp_min)}° / Max: ${Math.round(day.weather.temp_max)}°`;
    } else {
      day.weather.temp_range = 'Datos no disponibles';
    }
  });

  return dailyData;
};

const isRainCondition = (weatherId) => {
  return weatherId >= 200 && weatherId < 600;
};

const formatSpanishDate = (date) => {
  return date.toLocaleDateString('es-CL', { 
    day: 'numeric', 
    month: 'long' 
  }).replace(/^(\d+)\sde\s/, '$1 de ');
};

const translateWeather = (condition) => {
  const translations = {
    'Clear': 'Despejado',
    'Clouds': 'Nublado',
    'Rain': 'Lluvia',
    'Thunderstorm': 'Tormenta',
    'Snow': 'Nieve',
    'Drizzle': 'Llovizna',
    'Mist': 'Neblina',
    'Fog': 'Niebla',
    'Haze': 'Bruma'
  };
  return translations[condition] || condition;
};


// Función para obtener la URL del icono y que salga siempre con final d para que salga el icono de día (exportada para usar en componentes)
export const getWeatherIconUrl = (iconCode) => {
  const daytimeIconCode = iconCode?.endsWith('n') ? iconCode.slice(0, -1) + "d" : iconCode;
  return `https://openweathermap.org/img/wn/${daytimeIconCode || '01d'}@4x.png`;
};