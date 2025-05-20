import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';

const DayWeatherDetails = ({ day, month, year, weather, activity, recommendation }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5', 
        borderRadius: 2, 
        padding: 3, 
        boxShadow: 3, 
        maxWidth: '400px', 
        margin: '0 auto', 
        textAlign: 'center', 
      
      }}
    >
    <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center', color: "#2c5a8a", fontSize: '2rem', fontWeight:"bold" }}> DETALLES DEL DÍA</Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2c5a8a'}}>
        {day}, {month} {year}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color:"black" }}>
        Actividad: {activity}
      </Typography>
      <Chip
        label={weather.condition}
        size="medium"
        sx={{
          mb: 2,
          fontSize: '1rem',
          fontWeight: 500,
          backgroundColor:
            weather.condition === 'Soleado'
              ? '#ffeb3b'
              : weather.condition === 'Lluvia'
              ? '#2196f3'
              : '#9e9e9e',
          color: '#fff',
        }}
      />
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color:"black" }}>
        Temperatura: {weather.temp}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2, color:"black" }}>
        Recomendación: {recommendation}
      </Typography>
    </Box>
  );
};

export default DayWeatherDetails;