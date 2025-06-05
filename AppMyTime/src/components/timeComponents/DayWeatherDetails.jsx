import { 
  Box, 
  Typography, 
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import { useState, useEffect } from 'react';
import { getWeatherIconUrl } from '../../services/weatherservice';

const DayWeatherDetails = ({ dayWeather }) => {
  const [selectedWeather, setSelectedWeather] = useState(dayWeather.weathers[0]);
  const theme = useTheme();

  useEffect(() => {
    setSelectedWeather(dayWeather.weathers[0]);
  }, [dayWeather]);

  const changeWeather = (dt) => {
    setSelectedWeather(dayWeather.weathers.find(weather => weather.dt === dt));
  }

  return (
    <Paper sx={{ 
      background: 'white',
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: theme.shadows[2]
    }}>
      {/* Encabezado */}
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(to right, #1a73e8, #4285f4)',
        color: 'white'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {dayWeather.dt_day_formatted_long}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 3 }}>
          <img 
            src={getWeatherIconUrl(selectedWeather.icon)} 
            alt={selectedWeather.condition}
            style={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 300, lineHeight: 1 }}>
              {selectedWeather.temp + '°C'}
            </Typography>
            <Typography variant="body1">
              {selectedWeather.description[0].toUpperCase() + selectedWeather.description.slice(1)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Scroll horario */}
      <Box sx={{ 
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        '&::-webkit-scrollbar': {
          height: '8px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[400],
          borderRadius: '3px'
        }
      }}>
        {dayWeather.weathers.sort((a, b) => a.dt_hour.localeCompare(b.dt_hour)).map((weather) => (
          <Box 
            key={weather.dt} 
            sx={{ 
              minWidth: 60,
              textAlign: 'center',
              p: 1,
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: selectedWeather.dt === weather.dt ? '#e8f0fe' : 'transparent',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }} 
            onClick={() => changeWeather(weather.dt)}
          >
            <Typography variant="body2">{weather.dt_hour}</Typography>
            <Avatar 
              src={getWeatherIconUrl(weather.icon)} 
              sx={{ width: 36, height: 36, mx: 'auto', my: 1 }} 
            />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {weather.temp + '°'}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Datos extendidos */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
        p: 3
      }}>
        <DetailItem icon="💧" title="Humedad" value={selectedWeather.humidity + '%'} />
        <DetailItem icon="🌬️" title="Viento" value={(selectedWeather.wind * 3.6).toFixed(0) + ' km/h'} />
        <DetailItem 
          icon="☔" 
          title="Precipitaciones" 
          value={`${selectedWeather.precipitation.toFixed(1)} mm/h`} 
        />
        <DetailItem icon="🌡️" title="Sensación" value={`${parseInt(selectedWeather.feels_like)}°C`} />
      </Box>

      {/* Recomendación */}
      <Box sx={{ 
        p: 2,
        bgcolor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0'
      }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {selectedWeather.recommendation}
        </Typography>
      </Box>
    </Paper>
  );
};

// Componente auxiliar
const DetailItem = ({ icon, title, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  </Box>
);

export default DayWeatherDetails;