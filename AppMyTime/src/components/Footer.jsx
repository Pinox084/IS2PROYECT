import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#2c5a8a', 
        color: '#fff',
        padding: '1rem', 
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Contacto Ficticio
      </Typography>
      <Typography variant="body2">
        Teléfono: +1 (555) 123-4567
      </Typography>
      <Typography variant="body2">
        Correo: contacto@ficticio.com
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
        © 2025 App MyTime. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;