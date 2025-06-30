import { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { getWeeklyForecast, getWeatherIconUrl } from '../../services/weatherservice';

const HorizontalWeekCalendar = ({ onDaySelect, forecast, selectedCard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState(null);

  // Color del chip según clima
  const getWeatherChipColor = (condition, hasRain) => {
    if (!condition) return { bg: '#E8F5E9', text: '#2E7D32' };
    const cond = condition.toLowerCase();
    
    if (hasRain) return { bg: '#E3F2FD', text: '#0D47A1' };
    if (cond.includes('tormenta')) return { bg: '#EDE7F6', text: '#5E35B1' };
    if (cond.includes('nieve')) return { bg: '#E1F5FE', text: '#0277BD' };
    if (cond.includes('despejado')) return { bg: '#FFF8E1', text: '#FF6F00' };
    if (cond.includes('nublado')) return { bg: '#EEEEEE', text: '#424242' };
    if (cond.includes('niebla')) return { bg: '#F5F5F5', text: '#616161' };
    if (cond.includes('viento')) return { bg: '#E0F7FA', text: '#00838F' };
    return { bg: '#E8F5E9', text: '#2E7D32' };
  };
  
  if (error) return (
    <Alert severity="error" sx={{ m: 2 }}>
      {error}
    </Alert>
  );

  return (
    <Box sx={{ p: 4, overflowX: 'flex', mt: -2 }}>
      <Box sx={{ 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        borderRadius: 4, 
        p: 3,
        textAlign: 'center', 
        boxShadow: 3,
        mb: 4,
        background: 'white',
      }}>
      <Typography variant="h4" sx={{ 
        color: '#2c5a8a', 
        fontSize: '2rem',
        fontWeight: 'bold',
      }}>
        {forecast?.location ? 
          `🌤️ PRONÓSTICO - ${forecast.location.city.toUpperCase()}, ${forecast.location.country}` : 
          '🌤️ PRONÓSTICO'
        }
      </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        pb: 4,
      }}>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {Object.keys(forecast.forecastData).sort((a, b) => {
            const [da, ma, ya] = a.split('/').map(Number);
            const [db, mb, yb] = b.split('/').map(Number);
            const dateA = new Date(ya, ma - 1, da);
            const dateB = new Date(yb, mb - 1, db);
            return dateA - dateB;
          }).map((dateDay) => {
            // Usa la lectura actual para el dia actual, si no usa el forecast
            const day = dateDay === forecast.currentWeather.dt_day ? forecast.currentWeather : forecast.forecastData[dateDay];
            const hasRain = day.condition === 'Lluvia';
            const recommendation = day.recommendation;
            const chipColors = getWeatherChipColor(day.condition, hasRain);
            
            return (
              <Card 
                key={dateDay}
                sx={{ 
                  width: isMobile ? 160 : 200,
                  height: 490,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  background: selectedCard === dateDay ? 'linear-gradient(to bottom, #ffffff 0%,rgb(135, 192, 241) 100%)' : 'linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%)',
                  '&:hover': { 
                    transform: 'translateY(-8px)', 
                    boxShadow: theme.shadows[8],
                    background: 'linear-gradient(to bottom, #ffffff 0%,rgb(135, 192, 241) 100%)',
                    cursor: 'pointer',
                  },
                  transform: selectedCard === dateDay ? 'translateY(-8px)' : 'none'
                }}
                onClick={() => {onDaySelect?.(forecast.forecastData[dateDay])}}
              >
                <CardContent sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                }}>
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: dateDay === forecast.currentWeather.dt_txt ? theme.palette.primary.main : theme.palette.primary.dark,
                      fontSize: '1.2rem',
                    }}>
                      {day.day_txt || '--'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {day.dt_day_formatted || ''}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </Box>

                  <Box sx={{ 
                    textAlign: 'center', 
                    my: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 80,
                    flexShrink: 0
                  }}>
                    <img 
                      src={getWeatherIconUrl(day.icon, dateDay === forecast.currentWeather.dt_day)} 
                      alt={'TODO'} 
                      style={{ width: 80, height: 80 }}
                      onError={(e) => {
                        e.target.src = getWeatherIconUrl('01d', day?.isToday);
                      }} 
                    />
                  </Box>

                  <Typography variant="h5" sx={{ 
                    textAlign: 'center',
                    fontWeight: 700, 
                    color: theme.palette.primary.dark,
                    mb: 1,
                    flexShrink: 0
                  }}>
                    {day.temp + '°C' || '--'}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ 
                    textAlign: 'center',
                    display: 'block',
                    color: theme.palette.text.secondary,
                    mb: 2,
                    flexShrink: 0
                  }}>
                    {'Min: ' + forecast.forecastData[dateDay].temp_min + '°/ Max: ' + forecast.forecastData[dateDay].temp_max  + '°' || '--'}
                  </Typography>

                  <Chip
                    label={day.condition || '--'}
                    size="small"
                    sx={{
                      mb: 2,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      width: '100%',
                      height: 32,
                      backgroundColor: chipColors.bg,
                      color: chipColors.text,
                      boxShadow: theme.shadows[1],
                      flexShrink: 0
                    }}
                  />

                  <Box sx={{ 
                    bgcolor: 'rgba(245, 245, 245, 0.7)',
                    borderRadius: 2,
                    p: 1.5,
                    mb: 2,
                    textAlign: 'center',
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: theme.shadows[1]
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      color: theme.palette.text.primary,
                      lineHeight: 1.3
                    }}>
                      {recommendation}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default HorizontalWeekCalendar;