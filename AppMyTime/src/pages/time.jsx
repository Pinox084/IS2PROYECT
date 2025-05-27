import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import HorizontalWeekCalendar from '../components/timeComponents/WeekCalendar';
import DayWeatherDetails from '../components/timeComponents/DayWeatherDetails';

const TimePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDaySelect = (day) => {
    // Toggle selection - si se hace clic en el día ya seleccionado, se deselecciona
    setSelectedDay(prev => prev && prev.day === day.day ? null : day);
  };

  return (
    <Box
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', 
        gap: 4, 
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      {/* Calendario Semanal Horizontal */}
      <Box sx={{ flex: 1, minHeight: '400px' }}> 
        <HorizontalWeekCalendar 
          onDaySelect={handleDaySelect} 
          selectedDay={selectedDay}
        />
      </Box>

      {/* Panel de Detalles del Día (solo se muestra si hay día seleccionado) */}
      {selectedDay && (
        <Box sx={{ flex: 1, minHeight: '400px' }}>
          <DayWeatherDetails
            day={selectedDay.day}
            month={selectedDay.month}
            year={selectedDay.year}
            weather={selectedDay.weather}
            activity={selectedDay.activity}
            recommendation={selectedDay.recommendation}
            onClose={() => setSelectedDay(null)}
          />
        </Box>
      )}
    </Box>
  );
};

export default TimePage;