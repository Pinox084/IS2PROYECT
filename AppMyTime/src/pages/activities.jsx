import React, { useState } from 'react';
import {
  Typography,
  Checkbox,
  List,
  ListItem,
  Box,
  Button,
  MenuItem,
  Select
} from '@mui/material';

const actividadesPredeterminadas = [
  'Correr',
  'Lectura al Aire Libre',
  'Yoga',
  'Turismo',
  'Caminar',
  'Shopping',
  'Pescar',
  'Ciclismo',
  'Futbol',
  'Fotografía'
];

const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

const PaginaActividades = () => {
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [actividadesGuardadas, setActividadesGuardadas] = useState([]);

  const manejarSeleccion = (actividad) => {
    setActividadesSeleccionadas((prev) =>
      prev.includes(actividad)
        ? prev.filter((a) => a !== actividad)
        : [...prev, actividad]
    );
  };

  const borrarSeleccion = () => setActividadesSeleccionadas([]);

  const guardarActividades = () => {
    setActividadesGuardadas((prev) => {
      const nuevas = actividadesSeleccionadas
        .filter((a) => !prev.some((item) => item.nombre === a))
        .map((actividad) => ({ nombre: actividad, dia: '' }));
      return [...prev, ...nuevas];
    });
  };

  const borrarGuardadas = () => setActividadesGuardadas([]);

  const cambiarDiaActividad = (index, nuevoDia) => {
    const nuevasActividades = [...actividadesGuardadas];
    nuevasActividades[index].dia = nuevoDia;
    setActividadesGuardadas(nuevasActividades);
  };

  return (
    <Box>
      {/* Encabezado */}
      <Box
        sx={{
          backgroundColor: '#f5f7fb',
          borderRadius: 4,
          padding: 4,
          textAlign: 'center',
          maxWidth: 700,
          maxHeight: 100,
          mx: 'auto',
          mb: 5,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e0e0e0',
          ml: 5,
          mt: 4
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: '#223c6a',
            fontWeight: 700,
            letterSpacing: 1,
            mt: -3
          }}
        >
          TUS ACTIVIDADES
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            color: '#575757',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            mt: -2,
            textAlign: 'justify'
          }}
        >
          Selecciona las actividades de tu preferencia. Puedes elegir varias y guardarlas para futuras recomendaciones.
        </Typography>
      </Box>

      {/* Botones */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', ml: -136, mt: -3 }}>
        <Button
          variant="contained"
          onClick={borrarSeleccion}
          sx={{
            mt: 2,
            borderRadius: '20px',
            backgroundColor: '#1976d2',
            color: '#fff',
            boxShadow: 3,
            '&:hover': { backgroundColor: '#10487f' }
          }}
        >
          Borrar Selección
        </Button>

        <Button
          variant="contained"
          onClick={guardarActividades}
          sx={{
            mt: 2,
            borderRadius: '20px',
            backgroundColor: '#10487f',
            color: '#fff',
            boxShadow: 3,
            '&:hover': { backgroundColor: '#1976d2' }
          }}
        >
          Guardar Actividades
        </Button>
      </Box>

      {/* Sección de actividades */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap', ml: -136 }}>
        {/* Lista de selección */}
        <Box
          sx={{
            backgroundColor: '#223c6a',
            padding: 4,
            borderRadius: 4,
            width: '360px',
            height: '400px',
            overflowY: 'auto',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            '&::-webkit-scrollbar': {
              width: '10px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#10487f',
              borderRadius: '10px'
            }
          }}
        >
          <List>
            {actividadesPredeterminadas.map((actividad, i) => {
              const seleccionada = actividadesSeleccionadas.includes(actividad);
              return (
                <ListItem
                  key={i}
                  onClick={() => manejarSeleccion(actividad)}
                  sx={{
                    backgroundColor: seleccionada ? '#F6F6F7' : '#fff',
                    borderRadius: 2,
                    mb: 1,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: '0.2s',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                      transform: 'scale(1.02)',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Checkbox
                    checked={seleccionada}
                    onChange={() => manejarSeleccion(actividad)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: '#10487f',
                      '&.Mui-checked': { color: '#1976d2' }
                    }}
                  />
                  <Typography sx={{ fontWeight: 700, color: '#575757', fontSize: '1.1rem' }}>
                    {actividad}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Actividades guardadas */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: 4,
            padding: 3,
            width: '360px',
            height: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#223c6a' }}>
              Tus Actividades Guardadas
            </Typography>
            {actividadesGuardadas.length === 0 ? (
              <Typography variant="body2" color="#575757">
                No has guardado actividades.
              </Typography>
            ) : (
              <List>
                {actividadesGuardadas.map((actividad, index) => (
                  <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography variant="body2" sx={{ color: '#10487f', mb: 1 }}>
                      {actividad.nombre}
                    </Typography>
                    <Select
                      value={actividad.dia}
                      onChange={(e) => cambiarDiaActividad(index, e.target.value)}
                      displayEmpty
                      size="small"
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value="">Seleccionar día</MenuItem>
                      {diasSemana.map((dia) => (
                        <MenuItem key={dia} value={dia}>
                          {dia}
                        </MenuItem>
                      ))}
                    </Select>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Button
            variant="outlined"
            onClick={borrarGuardadas}
            sx={{
              mt: 2,
              borderRadius: '20px',
              color: '#575757',
              borderColor: '#575757',
              '&:hover': {
                borderColor: '#10487f',
                color: '#10487f'
              }
            }}
          >
            Borrar Guardadas
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaginaActividades;
