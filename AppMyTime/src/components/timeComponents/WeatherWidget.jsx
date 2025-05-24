import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress,
  Alert,
  Typography,
  Chip
} from '@mui/material';
import { getWeeklyForecast, getWeatherIconUrl } from '../../services/weatherservice';

const WeatherWidget = ({ onDaySelect, city = 'Concepcion', country = 'CL' }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeeklyForecast(city, country);
        setForecast(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, country]);

  const getRecommendation = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('lluvia') || conditionLower.includes('tormenta') || conditionLower.includes('llovizna')) {
      return '☔ Lleva paraguas';
    }
    if (conditionLower.includes('despejado')) return '☀️ Protector solar';
    if (conditionLower.includes('nublado')) return '⛅ Ideal para exteriores';
    if (conditionLower.includes('viento')) return '🌬️ Abrígate bien';
    return '😊 Buen día';
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 2 }}>
      {forecast.map((day, index) => (
        <Box 
          key={index}
          sx={{
            minWidth: 140, // Un poco más ancho para iconos más grandes
            p: 2,
            borderRadius: 2,
            bgcolor: day.weather.isImportant ? '#e3f2fd' : 'background.paper',
            boxShadow: 1,
            textAlign: 'center',
            border: day.weather.isImportant ? '2px solid #1976d2' : 'none',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s'
            }
          }}
          onClick={() => onDaySelect?.({
            ...day,
            recommendation: getRecommendation(day.weather.condition)
          })}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: day.isToday ? 'bold' : 'normal' }}>
            {day.day}
            {day.isToday && <Chip label="Hoy" size="small" sx={{ ml: 1 }} />}
          </Typography>
          <Typography variant="caption" display="block">
            {day.date}
          </Typography>
          
          <img 
            src={getWeatherIconUrl(day.weather.icon)} 
            alt={day.weather.description} 
            style={{ width: 70, height: 70 }} // Iconos más grandes
          />
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {day.weather.temp}
          </Typography>
          
          <Typography variant="caption" display="block" sx={{ 
            fontWeight: day.weather.isImportant ? 'bold' : 'normal',
            color: day.weather.isImportant ? '#1976d2' : 'inherit'
          }}>
            {day.weather.condition}
            {day.weather.isImportant && ' ⚠️'}
          </Typography>
          
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {day.weather.temp_range}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WeatherWidget;