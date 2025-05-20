import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import HorizontalWeekCalendar from '../components/timeComponents/WeekCalendar';
import DayWeatherDetails from '../components/timeComponents/DayWeatherDetails';

const TimePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);

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

      <Box sx={{ flex: 1, minHeight: '400px' }}> 
        <HorizontalWeekCalendar onDaySelect={setSelectedDay} />
      </Box>

    
      {selectedDay && (
        <Box sx={{ flex: 1, minHeight: '400px' }}> 
          <DayWeatherDetails
            day={selectedDay.day}
            month={selectedDay.month}
            year={selectedDay.year}
            weather={selectedDay.weather}
            activity={selectedDay.activity}
            recommendation={selectedDay.recommendation}
          />
        </Box>
      )}
    </Box>
  );
};

export default TimePage;