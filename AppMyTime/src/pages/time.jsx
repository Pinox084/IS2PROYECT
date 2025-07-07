// src/pages/time.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Typography,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HorizontalWeekCalendar from '../components/timeComponents/WeekCalendar';
import DayWeatherDetails from '../components/timeComponents/DayWeatherDetails';
import { getWeeklyForecast } from '../services/weatherservice';
import { getActividadesUsuario } from '../services/actividadService'; // <-- ¡CORREGIDO AQUÍ!
import { UserContext } from '../context/UserContext';

const TimePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [actividades, setActividades] = useState([]);
  const [loadingActividades, setLoadingActividades] = useState(false);

  const { userData } = useContext(UserContext);

  const loadWeatherData = async (city = 'Concepcion') => {
    setLoading(true);
    setError(null);
    try {
      const cityToFetch = city && city.trim() !== '' ? city : 'Concepcion';
      const weatherData = await getWeeklyForecast(cityToFetch);
      setForecast(weatherData);
      setCurrentCity(weatherData.location.city);
      setSelectedDay(null);
    } catch (err) {
      console.error("Error al cargar datos del clima:", err);
      setError("No se pudo cargar el clima para la ubicación. Intenta de nuevo.");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let initialCity = 'Concepcion';

    if (userData && userData.ubicacion_texto && userData.ubicacion_texto.trim() !== '') {
      initialCity = userData.ubicacion_texto;
      console.log('🟢 [TimePage] Usando ubicación del usuario:', initialCity);
    } else {
      console.log('🟡 [TimePage] No hay ubicación de usuario o está vacía. Usando ubicación predeterminada:', initialCity);
    }

    loadWeatherData(initialCity);

    if (userData && !userData.isGuest && userData.rut) {
      setLoadingActividades(true);
      getActividadesUsuario(userData.rut)
        .then(data => {
          setActividades(data);
        })
        .catch(err => {
          console.error("Error al obtener actividades del usuario:", err);
        })
        .finally(() => {
          setLoadingActividades(false);
        });
    } else {
      setActividades([]);
    }
  }, [userData]);

  const handleSearch = () => {
    if (searchCity.trim()) {
      loadWeatherData(searchCity);
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, pt: 5, maxWidth: 'lg', mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#3f51b5' }}>
        Clima y Actividades
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        <TextField
          label="Buscar Ciudad"
          variant="outlined"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          sx={{ width: isMobile ? '100%' : '300px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
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

      {error && forecast && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error} - Mostrando datos de {currentCity}
        </Alert>
      )}

      {loading && !forecast ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Cargando datos del clima...</Typography>
        </Box>
      ) : forecast ? (
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : '70%' }}>
            <HorizontalWeekCalendar
              onDaySelect={handleDaySelect}
              selectedCard={selectedDay?.dt_day}
              forecast={forecast}
              actividades={actividades}
              loadingActividades={loadingActividades}
            />
          </Box>

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
      ) : (
        !loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No se pudo cargar el pronóstico del clima. Por favor, intenta buscar una ciudad.
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
};

export default TimePage;