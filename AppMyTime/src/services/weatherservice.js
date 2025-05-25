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

    // 2. Obtener clima actual
    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );

    // 3. Obtener pronóstico 5 días
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`
    );

    // 4. Procesar datos
    return processForecastData(forecastResponse.data, currentWeatherResponse.data);
  } catch (error) {
    throw new Error(`Error al obtener clima: ${error.response?.data?.message || error.message}`);
  }
};

const processForecastData = (forecastData, currentWeather) => {
  const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Agrupar pronóstico por día
  const predictionsByDay = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString().split('T')[0];

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const dailyData = Array.from({ length: 5 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const key = date.toISOString().split('T')[0];
    const isToday = index === 0;
    const dayPredictions = predictionsByDay[key] || [];

    let representativePred;
    let temps = { min: undefined, max: undefined, avg: undefined };
    let hasRain = false;
    let isImportant = false;

    if (isToday) {
      // Datos para el día actual (se mantiene igual)
      representativePred = {
        dt: currentWeather.dt,
        main: currentWeather.main,
        weather: currentWeather.weather,
        wind: currentWeather.wind
      };
      
      temps.min = Math.round(currentWeather.main.temp_min);
      temps.max = Math.round(currentWeather.main.temp_max);
      temps.avg = Math.round(currentWeather.main.temp);
      hasRain = isRainCondition(currentWeather.weather[0].id);
    } else {
      // ==============================================
      // NUEVA LÓGICA PARA DÍAS FUTUROS (PRÓXIMOS 4 DÍAS)
      // ==============================================
      
      // 1. Filtrar predicciones diurnas (8AM - 10PM)
      const daytimePredictions = dayPredictions.filter(pred => {
        const hour = new Date(pred.dt * 1000).getHours();
        return hour >= 8 && hour <= 22;
      });

      // 2. Prioridad 1: Condiciones extremas (cualquier hora)
      const extremeCondition = dayPredictions.find(pred => 
        pred.weather[0].id >= 200 && pred.weather[0].id < 300 || // Tormentas
        pred.weather[0].id === 771 ||                             // Turbonada
        pred.weather[0].id === 781                                 // Tornado
      );

      // 3. Prioridad 2: Lluvia en horario diurno
      const rainPrediction = daytimePredictions.find(pred => 
        isRainCondition(pred.weather[0].id)
      );

      // 4. Prioridad 3: Cielo muy nublado (diurno)
      const cloudySky = daytimePredictions.find(pred => 
        pred.weather[0].id === 804 ||  // Nublado
        pred.weather[0].id === 803     // Muy nublado
      );

      // 5. Prioridad 4: Cambios bruscos de tiempo
      const hasWeatherChange = dayPredictions.some((pred, i, arr) => 
        i > 0 && pred.weather[0].id !== arr[i-1].weather[0].id
      );

      // Selección final del ícono representativo
      representativePred = extremeCondition || 
                          rainPrediction || 
                          (hasWeatherChange ? daytimePredictions.find(pred => pred.weather[0].id === 804) : null) ||
                          cloudySky || 
                          daytimePredictions.find(pred => {
                            const hour = new Date(pred.dt * 1000).getHours();
                            return hour >= 12 && hour <= 15; // Hora peak (mediodía)
                          }) || 
                          dayPredictions[Math.floor(dayPredictions.length / 2)]; // Predicción del medio

      hasRain = !!rainPrediction;
      isImportant = !!extremeCondition || hasRain;
    }

    // Manejo cuando no hay datos
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
          temp_range: '--',
          humidity: '--%',
          wind: '-- km/h',
          hasRain: false,
          isImportant: false
        }
      };
    }

    // Calcular temperaturas (para todos los días)
    if (dayPredictions.length > 0) {
      const allTemps = dayPredictions.map(p => p.main.temp);
      const allMins = dayPredictions.map(p => p.main.temp_min);
      const allMaxs = dayPredictions.map(p => p.main.temp_max);
      
      temps.min = Math.round(Math.min(...allMins));
      temps.max = Math.round(Math.max(...allMaxs));
      temps.avg = Math.round((temps.min + temps.max) / 2);
    } else if (representativePred) {
      temps.min = Math.round(representativePred.main.temp_min);
      temps.max = Math.round(representativePred.main.temp_max);
      temps.avg = Math.round((temps.min + temps.max) / 2);
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
        temp: `${temps.avg}°C`,
        temp_min: temps.min ?? '--',
        temp_max: temps.max ?? '--',
        temp_range: (temps.min !== undefined && temps.max !== undefined)
          ? `Min: ${temps.min}° / Max: ${temps.max}°`
          : 'Datos no disponibles',
        humidity: `${representativePred.main.humidity}%`,
        wind: `${(representativePred.wind.speed * 3.6).toFixed(1)} km/h`,
        hasRain,
        isImportant
      }
    };
  });

  return dailyData;
};

const isRainCondition = (weatherId) => {
  return (weatherId >= 200 && weatherId < 600) && 
         !(weatherId >= 700 && weatherId < 800);
};

const formatSpanishDate = (date) => {
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' }).replace(/^(\d+)\sde\s/, '$1 de ');
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

export const getWeatherIconUrl = (iconCode, isToday = false) => {
  // Si es hoy, mantenemos el icono original (puede terminar en 'd' o 'n')
  if (isToday) {
    return `https://openweathermap.org/img/wn/${iconCode || '01d'}@4x.png`;
  }
  // Para días futuros, forzamos el icono de día
  const daytimeIconCode = iconCode?.endsWith('n') ? iconCode.slice(0, -1) + "d" : iconCode;
  return `https://openweathermap.org/img/wn/${daytimeIconCode || '01d'}@4x.png`;
};