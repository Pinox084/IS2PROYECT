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
  Alert,
  IconButton
} from '@mui/material';
import HorizontalWeekCalendar from '../components/timeComponents/WeekCalendar';
import DayWeatherDetails from '../components/timeComponents/DayWeatherDetails';
import { getWeeklyForecast, getWeatherIconUrl } from '../services/weatherservice';

const TimePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData(){
      try {
        const { currentWeather, forecastData } = await getWeeklyForecast();
        setForecast({ currentWeather, forecastData });
      } catch (err) {
        setError(err.message || 'Error al cargar el pronóstico');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDaySelect = (day) => {
    // Toggle selection - si se hace clic en el día ya seleccionado, se deselecciona
    console.log(day)
    setSelectedDay(prev => prev && prev.day_txt === day.day_txt ? null : day);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress size={60} />
    </Box>
  );

  return (
    <Box
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', 
        gap: 4, 
        justifyContent: 'center',
        alignItems: 'stretch',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Calendario Semanal Horizontal */}
      <Box sx={{ flex: 1, minHeight: '400px' }}> 
        <HorizontalWeekCalendar 
          onDaySelect={handleDaySelect} 
          selectedCard={selectedDay?.dt_day}
          forecast={forecast}
        />
      </Box>

      {/* Panel de Detalles del Día (solo se muestra si hay día seleccionado) */}
      {selectedDay && (
        <Box sx={{ flex: 1, minHeight: '400px' }}>
          <DayWeatherDetails
            dayWeather={selectedDay}
            onClose={() => {console.log(selectedDay); setSelectedDay(null)}}
          />
        </Box>
      )}
    </Box>
  );
};

export default TimePage;