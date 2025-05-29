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

  // Función de recomendaciones con emojis
  const getWeatherRecommendation = (condition, hasRain, tempAvg) => {
  const conditionLower = condition?.toLowerCase() || '';
  tempAvg = tempAvg ? parseInt(tempAvg) : null;

  // Recomendaciones basadas en lluvia/tormenta
  if (hasRain) {
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

  // Recomendaciones basadas en nieve/hielo
  if (conditionLower.includes('nieve') || conditionLower.includes('nevadas')) {
    if (tempAvg < -5) {
      return '🧊Ropa térmica completa y calzado antideslizante';
    }
    return '⛄Abrigo grueso, guantes y gorro térmico';
  }

  // Recomendaciones basadas en temperatura
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

  // Recomendaciones basadas en condiciones específicas
  if (conditionLower.includes('despejado') || conditionLower.includes('cielo despejado')) {
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

  // Recomendación por defecto
  return '✨Disfruta de las condiciones';
};

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

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getWeeklyForecast();
        setForecast(data);
      } catch (err) {
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

  return (
    <Box sx={{ p: 4, overflowX: 'auto', mt: -2 }}>
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
          🌤️ PRONÓSTICO - CONCEPCIÓN, CHILE
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: 3,
        pb: 4,
      }}>
        {forecast.map((day, index) => {
          const recommendation = getWeatherRecommendation(day?.weather?.condition, day?.weather?.hasRain, day?.weather?.temp);
          const chipColors = getWeatherChipColor(day?.weather?.condition, day?.weather?.hasRain);
          
          return (
            <Card 
              key={index}
              sx={{ 
                width: isMobile ? 160 : 200,
                height: 490,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                borderRadius: 3,
                background: 'linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%)',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: theme.shadows[8],
                }
              }}
            >
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
                    color: day?.isToday ? theme.palette.primary.main : theme.palette.primary.dark,
                    fontSize: '1.2rem',
                  }}>
                    {day?.day || '--'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {day?.date || ''}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>

                {/* Icono del clima */}
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
                    src={getWeatherIconUrl(day?.weather?.icon, day?.isToday)} 
                    alt={day?.weather?.description} 
                    style={{ width: 80, height: 80 }}
                    onError={(e) => {
                      e.target.src = getWeatherIconUrl('01d', day?.isToday);
                    }} 
                  />
                </Box>

                {/* Temperatura */}
                <Typography variant="h5" sx={{ 
                  textAlign: 'center',
                  fontWeight: 700, 
                  color: theme.palette.primary.dark,
                  mb: 1,
                  flexShrink: 0
                }}>
                  {day?.weather?.temp || '--°C'}
                </Typography>
                
                {/* Rango térmico */}
                <Typography variant="caption" sx={{ 
                  textAlign: 'center',
                  display: 'block',
                  color: theme.palette.text.secondary,
                  mb: 2,
                  flexShrink: 0
                }}>
                  {day?.weather?.temp_range || '--'}
                </Typography>

                {/* Chip del clima */}
                <Chip
                  label={day?.weather?.condition || '--'}
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

                {/* Recomendación - Ahora con estilo consistente para todos los casos */}
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

                {/* Botón */}
                <Box sx={{ mt: 'auto', flexShrink: 0 }}>
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
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                      }
                    }}
                    onClick={() => onDaySelect?.({
                      ...day,
                      recommendation: recommendation
                    })}
                  >
                    Ver Detalles
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default HorizontalWeekCalendar;