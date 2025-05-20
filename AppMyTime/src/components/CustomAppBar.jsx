import React from 'react';
import { AppBar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CustomAppBar = () => {
  const navigate = useNavigate(); // Hook para redirección

  const handleLogout = () => {
    navigate('/'); // Redirige al login
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#4982ef', padding: 0 }}>
        {/* Sección del título */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3a6fb0',
            padding: '1rem',
            borderBottom: '2px solid #2c5a8a',
          }}
        >
          {/* Imagen */}
          <img
            src="clima3.png"
            alt="Logo"
            style={{ width: '60px', height: '60px' }}
          />
          {/* Texto */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#fff',
              marginLeft: '1rem',
            }}
          >
            App MyTime
          </Typography>
        </Box>

        {/* Sección de botones */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2c5a8a',
            padding: '0.5rem 1rem',
          }}
        >
          {/* Botones de navegación */}
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Button
              color="inherit"
              component={Link}
              to="/user"
              startIcon={<AccountCircleIcon />}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              Información Usuario
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/activities"
              startIcon={<EventIcon />}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              Actividades
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/time"
              startIcon={<CalendarMonthIcon />}
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              Calendario
            </Button>
          </Box>

          {/* Botón de salir */}
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </AppBar>
    </Box>
  );
};

export default CustomAppBar;