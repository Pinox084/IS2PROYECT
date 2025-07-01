import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

import {
  Typography,
  List,
  ListItem,
  Box,
  Checkbox,
} from '@mui/material';

const campos = ["Temperatura Minima (°C)", "Temperatura Máxima (°C)", "Viento Maximo (Km/h)", "Visibilidad", "Maxima Humedad", "Maximas Precipitaciones (mm/h)"];
const climas = ["Despejado", "Nublado", "Lluvia", "Niebla"];

const PerfilActividades = () => {
  const { userData } = useUser();
  const rutUsuario = userData?.rut;
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/usuario_actividad', {
          params: { rut_usuario: rutUsuario }
        });
        console.log("Actividades recibidas:", res.data);
        const actividadesOrdenadas = res.data.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
        setActividades(actividadesOrdenadas);

      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    if (rutUsuario) {
      obtenerDatos();
    }
  }, [rutUsuario]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 4,
        mt: 4,
        width: '100%',
        maxWidth: 1300,
        margin: '40px auto',
      }}
    >
      {/* Actividades Box */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#f5f7fb',
          borderRadius: 4,
          padding: 4,
          minWidth: 320,
          maxWidth: 500,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: '#223c6a', fontWeight: 700, textAlign: 'center' }}
        >
          Mis Actividades
        </Typography>

        {actividades.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ color: '#777', textAlign: 'center', marginTop: 2 }}
          >
            No tienes actividades guardadas.
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: 7 * 56,
              overflowY: actividades.length > 7 ? 'auto' : 'visible',
              overflowX: 'hidden',
              width: '100%',
              backgroundColor: '#f5f7fb',
              borderRadius: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
                background: '#f5f7fb',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#f5f7fb',
                borderRadius: 8,
              },
              scrollbarColor: '#f5f7fb #f5f7fb',
              scrollbarWidth: 'thin',
            }}
          >
            <List>
              {actividades.slice(0, 7).map((actividad) => (
                <ListItem
                  key={actividad.id || actividad.nombre}
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    marginBottom: 1,
                    padding: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: '#e0f0ff',
                      transform: 'scale(1.01)',
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: '#10487f' }}
                  >
                    {actividad.nombre}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Climas y Campos Box */}
      <Box
        sx={{
          flex: 2,
          backgroundColor: '#f5f7fb',
          borderRadius: 4,
          padding: 4,
          minWidth: 320,
          maxWidth: 1200,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e0e0e0',
        }}
      >
        {/* Campos numéricos */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {campos.map((nombre, idx) => (
            <Box
              key={nombre}
              sx={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 2,
                p: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 1, color: '#223c6a', fontWeight: 600 }}
              >
                {nombre}
              </Typography>
              <input
                type="number"
                style={{
                  width: '80px',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Checkboxes de Climas */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          {climas.map((clima, idx) => (
            <Box
              key={clima + idx}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#223c6a', fontWeight: 600, mb: 1 }}
              >
                {clima}
              </Typography>
              <Checkbox
                sx={{
                  transform: 'scale(1.4)',
                  color: '#10487f',
                  '&.Mui-checked': {
                    color: '#1976d2',
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PerfilActividades;
