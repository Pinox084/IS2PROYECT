import axios from 'axios';

export const getWeeklyForecast = async (city = 'concepcion', country = 'CL') => {
  console.log(city,country)
  const response = await axios.get('/api/weather', {params: {city, country}});
  return response.data;
}

export const getWeatherIconUrl = (iconCode, isToday = false) => {
  if (isToday) {
    return `https://openweathermap.org/img/wn/${iconCode || '01d'}@4x.png`;
  }
  const daytimeIconCode = iconCode?.endsWith('n') ? iconCode.slice(0, -1) + "d" : iconCode;
  return `https://openweathermap.org/img/wn/${daytimeIconCode || '01d'}@4x.png`;
};