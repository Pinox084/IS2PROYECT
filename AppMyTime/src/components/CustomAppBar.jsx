// src/components/CustomAppBar.jsx
import React, { useContext } from 'react';
import { AppBar, Typography, Button, Box, IconButton, Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { UserContext } from '../context/UserContext'; // Importar el UserContext

const CustomAppBar = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext); // Obtener userData y setUserData del contexto

  const handleLogout = () => {
    setUserData(null); // Limpia el contexto (establece userData a null)
    navigate('/'); // Redirige a la página de login
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
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 'bold',
              color: '#fff',
              marginLeft: '10px',
              fontSize: '1.8rem',
            }}
          >
            ClimaApp
          </Typography>
        </Box>

        {/* Sección de navegación y usuario */}
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Nombre de usuario o mensaje de bienvenida */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#fff',
              marginRight: 2,
            }}
          >
            {userData && userData.isGuest ? (
              // Mensaje para invitados
              'Bienvenido, Invitado'
            ) : userData && userData.nombres ? (
              // Nombre para usuarios logueados
              `Hola, ${userData.nombres}`
            ) : (
              // Mensaje por defecto si no hay userData o es indefinido
              'Cargando...'
            )}
          </Typography>

          {/* Botones de navegación (condicionales para invitado) */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {userData && !userData.isGuest && ( // Mostrar estos botones solo si NO es un invitado
              <>
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
                  Mi Perfil
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
              </>
            )}
          </Box>

          {/* Botón de salir (visible para ambos, pero la acción es la misma: limpiar sesión) */}
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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CustomAppBar;