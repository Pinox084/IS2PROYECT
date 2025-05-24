import React, { useState, useEffect } from 'react';
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
  Alert
} from '@mui/material';
import { getWeeklyForecast, getWeatherIconUrl } from '../../services/weatherservice';

const HorizontalWeekCalendar = ({ onDaySelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función de recomendaciones
  const getWeatherRecommendation = (condition) => {
    if (!condition) return '😊 Buen día';
    const cond = condition.toLowerCase();
    if (cond.includes('lluvia') || cond.includes('tormenta') || cond.includes('llovizna')) {
      return '☔ Lleva paraguas';
    }
    if (cond.includes('despejado')) return '☀️ Protector solar';
    if (cond.includes('nublado')) return '⛅ Ideal para exteriores';
    if (cond.includes('viento')) return '🌬️ Abrígate bien';
    return '😊 Buen día';
  };

  // Color del chip según clima
  const getWeatherChipColor = (condition) => {
    if (!condition) return { bg: '#E8F5E9', text: '#2E7D32' };
    const cond = condition.toLowerCase();
    if (cond.includes('lluvia') || cond.includes('llovizna')) {
      return { bg: '#E3F2FD', text: '#0D47A1' };
    } else if (cond.includes('despejado') || cond.includes('soleado')) {
      return { bg: '#FFF8E1', text: '#FF6F00' };
    } else if (cond.includes('nublado')) {
      return { bg: '#EEEEEE', text: '#424242' };
    } else if (cond.includes('tormenta')) {
      return { bg: '#EDE7F6', text: '#5E35B1' };
    } else if (cond.includes('nieve')) {
      return { bg: '#E1F5FE', text: '#0277BD' };
    }
    return { bg: '#E8F5E9', text: '#2E7D32' };
  };

  // Carga de datos con manejo de errores mejorado
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getWeeklyForecast();
        if (!Array.isArray(data)) {
          throw new Error('Formato de datos inválido');
        }
        setForecast(data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(err.message || 'Error al cargar el pronóstico');
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress size={60} />
    </Box>
  );
  
  if (error) return (
    <Alert severity="error" sx={{ m: 2 }}>
      {error}
    </Alert>
  );

  if (!forecast || forecast.length === 0) return (
    <Alert severity="warning" sx={{ m: 2 }}>
      No hay datos climáticos disponibles
    </Alert>
  );

  return (
    <Box sx={{ p: 4, overflowX: 'auto', mt: -2 }}>
      {/* Encabezado */}
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
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        }}>
          🌤️ PRONÓSTICO - CONCEPCIÓN, CHILE
        </Typography>
      </Box>

      {/* Tarjetas del clima con protección contra errores */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: 3,
        pb: 4,
      }}>
        {forecast.map((day, index) => {
          // Validación completa del objeto day
          if (!day || !day.weather) return null;
          
          const safeDay = {
            day: day.day || '--',
            date: day.date || '',
            weather: {
              condition: day.weather.condition || 'Desconocido',
              icon: day.weather.icon || '01d',
              temp: day.weather.temp || '--°C',
              temp_range: day.weather.temp_range || '--',
              description: day.weather.description || ''
            }
          };

          const chipColors = getWeatherChipColor(safeDay.weather.condition);
          
          return (
            <Card key={index} sx={{ 
              width: isMobile ? '160px' : '200px',
              height: '480px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              borderRadius: 3,
              background: 'linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%)',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: theme.shadows[8],
              }
            }}>
              <CardContent sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 3,
              }}>
                {/* Encabezado */}
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: theme.palette.primary.dark,
                    fontSize: '1.2rem',
                  }}>
                    {safeDay.day}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {safeDay.date}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>

                {/* Icono del clima con protección */}
                <Box sx={{ 
                  textAlign: 'center', 
                  my: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 80
                }}>
                  <img 
                    src={getWeatherIconUrl(safeDay.weather.icon)} 
                    alt={safeDay.weather.description} 
                    style={{ width: 80, height: 80 }}
                    onError={(e) => {
                      e.target.src = getWeatherIconUrl('01d'); // Fallback a icono por defecto
                    }} 
                  />
                </Box>

                {/* Temperatura */}
                <Typography variant="h5" sx={{ 
                  textAlign: 'center',
                  fontWeight: 700, 
                  color: theme.palette.primary.dark,
                  mb: 1
                }}>
                  {safeDay.weather.temp}
                </Typography>
                
                {/* Rango térmico */}
                <Typography variant="caption" sx={{ 
                  textAlign: 'center',
                  display: 'block',
                  color: theme.palette.text.secondary,
                  mb: 2
                }}>
                  {safeDay.weather.temp_range}
                </Typography>

                {/* Chip del clima con protección */}
                <Chip
                  label={safeDay.weather.condition}
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
                  }}
                />

                {/* Recomendación */}
                <Box sx={{ 
                  bgcolor: 'rgba(245, 245, 245, 0.7)',
                  borderRadius: 2,
                  p: 1.5,
                  mb: 2,
                  textAlign: 'center',
                }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.9rem',
                  }}>
                    {getWeatherRecommendation(safeDay.weather.condition)}
                  </Typography>
                </Box>

                {/* Botón */}
                <Button
                  variant="contained"
                  size="small"
                  sx={{ 
                    width: '100%', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: theme.shadows[2],
                    mt: 'auto',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    }
                  }}
                  onClick={() => onDaySelect?.(safeDay)}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default HorizontalWeekCalendar;