import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Checkbox,
  List,
  ListItem,
  Box,
  Button
} from '@mui/material';

const diasSemana = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

const rutUsuario = '12345678-9'; // Reemplaza con el rut del usuario autenticado

const PaginaActividades = () => {
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [actividadesGuardadas, setActividadesGuardadas] = useState([]);
  const [actividadesbd, setActividadesbd] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resActividades = await axios.get('http://localhost:4000/api/actividades');
        setActividadesbd(resActividades.data);

        const resGuardadas = await axios.get('http://localhost:4000/api/usuario_actividad', {
          params: { rut_usuario: rutUsuario }
        });

        const actividadesUsuario = resGuardadas.data.map((a) => ({
          nombre: a.nombre,
          dia: a.dias || []
        }));

        setActividadesGuardadas(actividadesUsuario);
      } catch (err) {
        console.error('Error al obtener datos:', err);
      }
    };

    obtenerDatos();
  }, []);

  const manejarSeleccion = (actividad) => {
    setActividadesSeleccionadas((prev) =>
      prev.includes(actividad)
        ? prev.filter((a) => a !== actividad)
        : [...prev, actividad]
    );
  };

  const borrarSeleccion = () => setActividadesSeleccionadas([]);

  const guardarActividades = async () => {
    const nuevas = actividadesSeleccionadas
      .filter((a) => !actividadesGuardadas.some((item) => item.nombre === a))
      .map((actividad) => ({ nombre: actividad, dia: [] }));

    for (const act of nuevas) {
      const actividadBD = actividadesbd.find((a) => a.nombre === act.nombre);
      if (actividadBD) {
        try {
          await axios.post('http://localhost:4000/api/usuario_actividad', {
            rut_usuario: rutUsuario,
            id_actividad: actividadBD.id_actividad
          });
        } catch (err) {
          console.error('Error al asociar actividad:', err);
        }
      }
    }

    setActividadesGuardadas((prev) => [...prev, ...nuevas]);
  };

  const borrarGuardadas = async () => {
    try {
      await axios.delete('http://localhost:4000/api/usuario_actividad', {
        data: { rut_usuario: rutUsuario }
      });
      setActividadesGuardadas([]);
    } catch (error) {
      console.error('Error al borrar actividades del usuario:', error);
    }
  };

  const cambiarDiaActividad = async (index, nuevosDias) => {
    const nuevasActividades = [...actividadesGuardadas];
    const actividad = nuevasActividades[index];
    actividad.dia = nuevosDias;
    setActividadesGuardadas(nuevasActividades);

    const actividadBD = actividadesbd.find((a) => a.nombre === actividad.nombre);
    if (!actividadBD) return;

    try {
      await axios.post('http://localhost:4000/api/usuario_actividad_dia', {
        rut_usuario: rutUsuario,
        id_actividad: actividadBD.id_actividad,
        dias: nuevosDias
      });
    } catch (error) {
      console.error('Error al guardar días de actividad:', error);
    }
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
          mt: 4
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#223c6a', fontWeight: 700, letterSpacing: 1, mt: -3 }}>
          TUS ACTIVIDADES
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ color: '#575757', fontSize: '0.9rem', lineHeight: 1.6, mt: -2, textAlign: 'justify' }}
        >
          Selecciona las actividades de tu preferencia. Puedes elegir varias y guardarlas para futuras recomendaciones.
        </Typography>
      </Box>

      {/* Botones */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: -3 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap' }}>
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
            '&::-webkit-scrollbar': { width: '10px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#10487f', borderRadius: '10px' }
          }}
        >
          <List>
            {actividadesbd.map((actividad, i) => {
              const nombreActividad = actividad.nombre || actividad;
              const seleccionada = actividadesSeleccionadas.includes(nombreActividad);
              return (
                <ListItem
                  key={i}
                  onClick={() => manejarSeleccion(nombreActividad)}
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
                    onChange={() => manejarSeleccion(nombreActividad)}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      color: '#10487f',
                      '&.Mui-checked': { color: '#1976d2' }
                    }}
                  />
                  <Typography sx={{ fontWeight: 700, color: '#575757', fontSize: '1.1rem' }}>
                    {nombreActividad}
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
            width: '700px',
            minHeight: '400px',
            maxHeight: '400px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#223c6a' }}>
            Tus Actividades Guardadas
          </Typography>
          {actividadesGuardadas.length === 0 ? (
            <Typography variant="body2" color="#575757">
              No has guardado actividades.
            </Typography>
          ) : (
            <Box
              component="div"
              sx={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: '300px',
                mt: 2
              }}
            >
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 8, color: '#223c6a' }}>Actividad</th>
                    {diasSemana.map((dia) => (
                      <th key={dia} style={{ textAlign: 'center', padding: 8, color: '#223c6a' }}>{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actividadesGuardadas.map((actividad, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 700, color: '#10487f', padding: 8 }}>{actividad.nombre}</td>
                      {diasSemana.map((dia) => (
                        <td key={dia} style={{ textAlign: 'center', padding: 8 }}>
                          <Checkbox
                            checked={Array.isArray(actividad.dia) ? actividad.dia.includes(dia) : false}
                            onChange={() => {
                              const nuevosDias = Array.isArray(actividad.dia)
                                ? (actividad.dia.includes(dia)
                                  ? actividad.dia.filter((d) => d !== dia)
                                  : [...actividad.dia, dia])
                                : [dia];
                              cambiarDiaActividad(index, nuevosDias);
                            }}
                            sx={{
                              color: '#10487f',
                              '&.Mui-checked': { color: '#1976d2' }
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          )}
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
