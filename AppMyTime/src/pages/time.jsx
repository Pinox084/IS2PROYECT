import React, { useState, useEffect } from 'react';
import { 
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HorizontalWeekCalendar from '../components/timeComponents/WeekCalendar';
import DayWeatherDetails from '../components/timeComponents/DayWeatherDetails';
import { getWeeklyForecast } from '../services/weatherservice';

const TimePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [currentCity, setCurrentCity] = useState('Concepcion');

  const loadWeatherData = async (city = 'Concepcion') => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getWeeklyForecast(city);
      setForecast(weatherData);
      setCurrentCity(weatherData.location.city);
      setSelectedDay(null); // Resetear selección al cambiar ciudad
    } catch (err) {
      setError(err.message || 'Error al cargar el pronóstico');
      // Mantener datos anteriores si hay error
      if (!forecast) setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    loadWeatherData();
  }, []);

  const handleSearch = () => {
    if (searchCity.trim()) {
      loadWeatherData(searchCity.trim());
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(prev => prev?.dt_day === day.dt_day ? null : day);
  };

  if (loading && !forecast) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error && !forecast) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* Barra de búsqueda */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4,
        justifyContent: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center'
      }}>
        <TextField
          label="Buscar ciudad"
          variant="outlined"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ 
            width: isMobile ? '100%' : '400px',
            backgroundColor: 'background.paper'
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ 
            height: '56px',
            px: 4,
            width: isMobile ? '100%' : 'auto'
          }}
          disabled={!searchCity.trim()}
        >
          Buscar Clima
        </Button>
      </Box>

      {/* Manejo de errores (cuando hay datos previos) */}
      {error && forecast && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error} - Solo se permiten ubicaciones dentro de Chile - Mostrando datos de {currentCity}
        </Alert>
      )}

      {/* Contenido principal */}
      {forecast && (
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          {/* Calendario Semanal */}
          <Box sx={{ 
            flex: 1,
            minWidth: isMobile ? '100%' : '70%'
          }}>
            <HorizontalWeekCalendar 
              onDaySelect={handleDaySelect} 
              selectedCard={selectedDay?.dt_day}
              forecast={forecast}
            />
          </Box>

          {/* Panel de Detalles del Día */}
          {selectedDay && (
            <Box sx={{ 
              flex: 1,
              width: isMobile ? '100%' : '30%',
              position: isMobile ? 'static' : 'sticky',
              top: 20
            }}>
              <DayWeatherDetails
                dayWeather={selectedDay}
                currentCity={currentCity}
                onClose={() => setSelectedDay(null)}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TimePage;