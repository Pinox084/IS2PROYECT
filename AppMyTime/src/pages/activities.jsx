import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ActividadesUser from '../components/actividadesUser';
import PerfilActividades from '../components/PerfilActividades';

const PaginaActividades = () => {
  const [tab, setTab] = useState('actividades'); // 'actividades' o 'perfil'

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button
          variant={tab === 'actividades' ? 'contained' : 'outlined'}
          onClick={() => setTab('actividades')}
        >
          Mis Actividades
        </Button>
        <Button
          variant={tab === 'perfil' ? 'contained' : 'outlined'}
          onClick={() => setTab('perfil')}
        >
          Perfil Actividades
        </Button>
      </Box>

      {tab === 'actividades' && <ActividadesUser />}
      {tab === 'perfil' && <PerfilActividades />}
    </Box>
  );
};

export default PaginaActividades;