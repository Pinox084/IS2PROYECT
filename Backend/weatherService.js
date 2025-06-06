const axios = require('axios')
require('dotenv').config()

const API_KEY = process.env.OPENWEATHER_KEY;

const MIN_PRIORITY = 98;

const WEATHER_PRIORITIES = {
  'Tormenta': 1,
  'Nieve': 2,
  'Lluvia': 3,
  'Llovizna': 4,
  'default': 98 
};

const getWeatherPriority = (condition) => 
  WEATHER_PRIORITIES[condition] || WEATHER_PRIORITIES.default;

const getPriorityWeather = (dayWeathers) => {
  let priorityWeather = dayWeathers[0];
  let weather12 = null;
  for(const weather of dayWeathers){
    const hora = weather.dt_txt.split(" ")[1];
    if(hora < "09:00:00" || hora > "21:00:00") continue;
    if(hora === "11:00:00") weather12 = weather;
    priorityWeather = getWeatherPriority(weather.condition) < getWeatherPriority(priorityWeather.condition) ? weather : priorityWeather;
  }
  return (getWeatherPriority(priorityWeather.condition) === MIN_PRIORITY && weather12 !== null) ? weather12 : priorityWeather;
}

const getWeeklyForecast = async (city = 'Concepcion', country = '') => {
  try {
    // 1. Obtener coordenadas y datos de ubicación
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    const geoResponse = await axios.get(geoUrl);

    if (!geoResponse.data[0]) throw new Error('Ubicación no encontrada');
    
    const { lat, lon, name, country: countryCode } = geoResponse.data[0];
    if (countryCode !== 'CL') throw new Error('Solo se permiten ubicaciones dentro de Chile');
    const timezone = 'America/Santiago'; // Mantenemos zona horaria de Chile para consistencia
    
    // 2. Obtener datos actuales y pronóstico
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`)
    ]);

    // 3. Procesar datos para el calendario
    const timestamp = new Date(currentWeatherResponse.data.dt * 1000);
    const localDateString = timestamp.toLocaleString("es-ES", { timeZone: timezone });
    const day_txt = timestamp.toLocaleDateString('es-ES', { timeZone: timezone, weekday: "short" });
    const dt_day_formatted_long = timestamp.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      timeZone: timezone 
    });

    const currentWeather = {
      dt: currentWeatherResponse.data.dt,
      day_txt: day_txt.toUpperCase(),
      dt_day: localDateString.split(', ')[0],
      dt_day_formatted: timestamp.toLocaleDateString('es-ES', {
        day: 'numeric', 
        month: 'long', 
        timeZone: timezone
      }),
      dt_day_formatted_long: dt_day_formatted_long[0].toUpperCase() + dt_day_formatted_long.slice(1),
      dt_hour: timestamp.toLocaleTimeString('es-ES', {
        timeZone: timezone,
        hour: '2-digit', 
        minute: '2-digit'
      }),
      dt_txt: localDateString,
      temp: currentWeatherResponse.data.main.temp.toFixed(0),
      icon: currentWeatherResponse.data.weather[0].icon,
      temp_min: currentWeatherResponse.data.main.temp_min.toFixed(0),
      temp_max: currentWeatherResponse.data.main.temp_max.toFixed(0),
      pressure: currentWeatherResponse.data.main.pressure,
      humidity: currentWeatherResponse.data.main.humidity,
      feels_like: currentWeatherResponse.data.main.feels_like.toFixed(0),
      wind: currentWeatherResponse.data.wind.speed,
      description: currentWeatherResponse.data.weather[0].description,
      condition: translateWeather(currentWeatherResponse.data.weather[0].main),
      rain: getPrecipitationValue(currentWeatherResponse.data.rain),
      precipitation: getPrecipitationValue(currentWeatherResponse.data.rain),
      pop: currentWeatherResponse.data.pop || 0,
      recommendation: getWeatherRecommendation(
        translateWeather(currentWeatherResponse.data.weather[0].main),
        currentWeatherResponse.data.main.temp.toFixed(0)
      ),
      isCurrent: true,
      city: name, // Nombre oficial de la ciudad
      country: countryCode // Código del país
    };

    // Agrupar por día
    let forecastData = {};
    forecastData[currentWeather.dt_day] = {
      dt_day: currentWeather.dt_day,
      day_txt: currentWeather.day_txt,
      icon: currentWeather.icon,
      temp: currentWeather.temp,
      condition: currentWeather.condition,
      weathers: [currentWeather],
      temp_min: currentWeather.temp_min,
      temp_max: currentWeather.temp_max,
    };

    // Procesar pronóstico
    for(const item of forecastResponse.data.list){
      const timestamp = new Date(item.dt * 1000);
      const localDateString = timestamp.toLocaleString("es-ES", { timeZone: timezone });
      const date = localDateString.split(", ")[0];

      if(!forecastData[date]){
        if(Object.keys(forecastData).length === 5) break;
        const day_txt = timestamp.toLocaleDateString('es-ES', {
          weekday: "short", 
          timeZone: timezone 
        });
        forecastData[date] = {
          day_txt: day_txt.toUpperCase(),
          weathers: [],
          temp_min: 9999,
          temp_max: -273.15,
        };
      }

      forecastData[date].temp_min = Math.min(forecastData[date].temp_min, item.main.temp_min.toFixed(0));
      forecastData[date].temp_max = Math.max(forecastData[date].temp_max, item.main.temp_max.toFixed(0));

      forecastData[date].weathers.push({
        dt: item.dt,
        dt_day: localDateString.split(', ')[0],
        dt_hour: timestamp.toLocaleTimeString('es-ES', {
          timeZone: timezone,
          hour: '2-digit', 
          minute: '2-digit'
        }),
        dt_txt: localDateString,
        temp: item.main.temp.toFixed(0),
        icon: item.weather[0].icon,
        temp_min: item.main.temp_min.toFixed(0),
        temp_max: item.main.temp_max.toFixed(0),
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        wind: item.wind.speed,
        feels_like: item.main.feels_like.toFixed(0),
        condition: translateWeather(item.weather[0].main),
        description: item.weather[0].description,
        rain: getPrecipitationValue(item.rain),
        precipitation: getPrecipitationValue(item.rain),
        pop: item.pop || 0,
        recommendation: getWeatherRecommendation(
          translateWeather(item.weather[0].main),
          item.main.temp.toFixed(0)
        ),
        isCurrent: false
      });
    }

    // Procesar datos por día
    for(const day in forecastData){
      forecastData[day].weathers.sort((a, b) => a.dt - b.dt);
      const priorityWeather = getPriorityWeather(forecastData[day].weathers);
      
      forecastData[day].condition = priorityWeather.condition;
      forecastData[day].temp = ((Number(forecastData[day].temp_min) + Number(forecastData[day].temp_max)) / 2).toFixed(0);
      forecastData[day].icon = priorityWeather.icon;
      forecastData[day].dt_day = day;
      
      const [_day, _month, _year] = day.split('/');
      forecastData[day].dt_day_formatted = new Date(`${_year}-${_month}-${_day}`)
        .toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        
      const dt_day_formatted_long = new Date(`${_year}-${_month}-${_day}`)
        .toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
        
      forecastData[day].dt_day_formatted_long = dt_day_formatted_long[0].toUpperCase() + dt_day_formatted_long.slice(1);
      forecastData[day].recommendation = getWeatherRecommendation(
        forecastData[day].condition, 
        forecastData[day].temp
      );
    }

    return {
      currentWeather,
      forecastData,
      location: {
        city: name,
        country: countryCode
      }
    };

  } catch (error) {
    console.error('Error fetching weather:', error);
    throw new Error(`Error al obtener clima: ${error.message}`);
  }
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
    'Fog': 'Niebla'
  };
  return translations[condition] || condition;
};

const getPrecipitationValue = (precipData) => {
  if (!precipData) return 0;
  // La API puede devolver 1h o 3h, tomamos el primero que exista
  return precipData['1h'] || precipData['3h'] || 0;
};

const getWeatherRecommendation = (condition, tempAvg) => {
    const hasPrecipitation = condition === 'Lluvia'
    const conditionLower = condition?.toLowerCase() || '';
    if (hasPrecipitation) {
      if (conditionLower.includes('tormenta')) {
        return '⚡Evita áreas abiertas y busca refugio';
      }
      if (conditionLower.includes('lluvia intensa')) {
        return '🌧️Usa impermeable y botas de agua';
      }
      if (tempAvg < 10) {
        return '❄️Abrigo impermeable';
      }
      return '☔Lleva paraguas';
    }

    if (conditionLower.includes('nieve') || conditionLower.includes('nevadas')) {
      if (tempAvg < -5) {
        return '🧊Ropa térmica completa y calzado antideslizante';
      }
      return '⛄Abrigo grueso, guantes y gorro térmico';
    }

    if (tempAvg !== null) {
      if (tempAvg > 25) {
        if (conditionLower.includes('despejado')) {
          return '🔥Protector solar FPS 50+';
        }
        return '🥵Ropa ligera e hidrátate';
      }
      if (tempAvg > 15) {
        return '☀️Gafas y protector solar';
      }
      if (tempAvg <4) {
        return '🧤Abrigo y bufanda';
      }
      if (tempAvg < 8) {
        return '🧣Chaqueta gruesa';
      }
    }

    if (conditionLower.includes('despejado') || conditionLower.includes('cielo despejado')) {
      if (tempAvg < 13){
        return '🧤Abrigate';
      }
      return '😎Gafas y protector solar';
    }

    if (conditionLower.includes('viento')) {
      return '🍃Chaqueta cortavientos';
    }

    if (conditionLower.includes('niebla') || conditionLower.includes('neblina')) {
      return '🌫️Conduce con precaución';
    }

    if (conditionLower.includes('nublado') || conditionLower.includes('nubes')) {
      if (tempAvg > 15) {
        return '⛅Capa ligera';
      }
      return '☁️Lleva una chaqueta';
    }

    return '✨Disfruta de las condiciones';
};

module.exports = {getWeeklyForecast, getWeatherRecommendation}