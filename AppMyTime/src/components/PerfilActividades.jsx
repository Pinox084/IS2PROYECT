import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import {
  Typography,
  List,
  ListItem,
  Box,
  Checkbox,
  ListItemButton,
  TextField,
  Button,
  Alert,
  Snackbar
} from '@mui/material';

const climas_disponibles = ["Despejado", "Nublado", "Lluvia", "Niebla"];

const camposDef = [
  { label: "Temperatura Minima (°C)", key: "temp_min" },
  { label: "Temperatura Máxima (°C)", key: "temp_max" },
  { label: "Viento Maximo (Km/h)", key: "viento_max" },
  { label: "Maxima Humedad", key: "sense_max" },
  { label: "Maximas Precipitaciones (mm/h)", key: "max_precipitaciones" }
];

const PerfilActividades = () => {
  const { userData } = useUser();
  const rutUsuario = userData?.rut;
  const [perfiles, setPerfiles] = useState([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});
  const [climasSeleccionados, setClimasSeleccionados] = useState([]);
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    const obtenerPerfiles = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/perfiles', {
          params: { rut_usuario: rutUsuario }
        });
        setPerfiles(res.data);
      } catch (error) {
        console.error('Error al obtener perfiles:', error);
      }
    };
    console.log("📌 RUT que se envía:", rutUsuario);
    if (rutUsuario) obtenerPerfiles();
  }, [rutUsuario]);

  const handleModificarClick = () => {
    const { id_perfil, actividad, recomendaciones, alertas, ...editableFields } = perfilSeleccionado;
    setDatosEditados(editableFields);
    setClimasSeleccionados(perfilSeleccionado.climas?.map(c => c.nombre_clima) || []);
    setModoEdicion(true);
  };
  
  const mostrarAlerta = (mensaje, tipo = 'success') => {
  setAlerta({ open: true, mensaje, tipo });
  };


  const handleGuardar = async () => {
    if (!rutUsuario || !perfilSeleccionado?.id_actividad) {
      console.error("Faltan datos para guardar");
      return;
    }

    try {
      const payload = {
        ...datosEditados,
        rut_usuario: rutUsuario,
        id_actividad: perfilSeleccionado.id_actividad,
        climas: climasSeleccionados
      };
      if (datosEditados.temp_min < -50) {
        mostrarAlerta('La temperatura mínima no puede ser menor a -50°C', 'error');
        return;
      }
      if (datosEditados.temp_max < -50) {
        mostrarAlerta('La temperatura máxima no puede ser menor a -50°C', 'error');
        return;
      }
      if (datosEditados.temp_min > 50) {
        mostrarAlerta('La temperatura mínima no puede ser mayor a 50°C', 'error');
        return;
      }
      if (datosEditados.temp_max > 50) {
        mostrarAlerta('La temperatura máxima no puede ser mayor a 50°C', 'error');
        return;
      }
      if (datosEditados.temp_max <= datosEditados.temp_min) {
        mostrarAlerta('La temperatura máxima debe ser mayor que la mínima', 'error');
        return;
      }
      if (datosEditados.viento_max < 0) {
        mostrarAlerta('El viento máximo debe ser mayor a 0 Km/h', 'error');
        return;
      }
      if (datosEditados.viento_max > 80) {
        mostrarAlerta('El viento máximo no puede ser mayor a 80 Km/h', 'error');
        return;
      }
      if (datosEditados.visibilidad < 0) {
        mostrarAlerta('La visibilidad debe ser mayor a 0', 'error');
        return;
      }
      if (datosEditados.visibilidad > 5) {
        mostrarAlerta('La visibilidad debe ser menor a 5', 'error');
        return;
      }
      if (datosEditados.sense_max < 0) {
        mostrarAlerta('La humedad máxima debe ser mayor a 0', 'error');
        return;
      }
      if (datosEditados.sense_max > 100) {
        mostrarAlerta('La humedad máxima no puede ser mayor a 100', 'error');
        return;
      }
      if (datosEditados.max_precipitaciones < 0) {
        mostrarAlerta('Las precipitaciones máximas deben ser mayores a 0 mm/h', 'error');
        return;
      }
      await axios.put('http://localhost:4000/api/perfiles', payload);

      const res = await axios.get('http://localhost:4000/api/perfiles', {
        params: { rut_usuario: rutUsuario }
      });
      setPerfiles(res.data);
      setPerfilSeleccionado(res.data.find(p => p.id_actividad === perfilSeleccionado.id_actividad));
      setModoEdicion(false);
      mostrarAlerta('Perfil guardado correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      mostrarAlerta('Error al guardar el perfil', 'error');
    }
  };

  const handleEliminar = async () => {
    try {
      await axios.delete('http://localhost:4000/api/perfiles', {
        data: {
          rut_usuario: rutUsuario,
          id_actividad: perfilSeleccionado.id_actividad,
          id_perfil: perfilSeleccionado.id_perfil
        }
      });

      const res = await axios.get('http://localhost:4000/api/perfiles', {
        params: { rut_usuario: rutUsuario }
      });

      const nuevo = res.data.find(p => p.id_actividad === perfilSeleccionado.id_actividad);
      setPerfiles(res.data);
      setPerfilSeleccionado(nuevo);
      setModoEdicion(false);
      mostrarAlerta('Perfil Eliminado', 'success');
    } catch (error) {
      console.error('Error al eliminar el perfil:', error);
      mostrarAlerta('Error al eliminar el perfil', 'error');
    }
  };

  const toggleClima = (clima) => {
    setClimasSeleccionados(prev =>
      prev.includes(clima) ? prev.filter(c => c !== clima) : [...prev, clima]
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', gap: 4, mt: 4, maxWidth: 1300, margin: '40px auto' }}>
      <Box sx={{ flex: 1, backgroundColor: '#223c6a', borderRadius: 4, padding: 4 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', color: '#fff' }}>Mis Actividades</Typography>
        <List>
          {perfiles.map((perfil) => (
            <ListItem key={perfil.id_perfil} disablePadding>
              <ListItemButton onClick={() => { setPerfilSeleccionado(perfil); setModoEdicion(false); }}>
                <Typography sx={{ color: '#fff' }}>{perfil.actividad?.nombre}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flex: 2, backgroundColor: '#f5f7fb', borderRadius: 4, padding: 4 }}>
        {perfilSeleccionado ? (
          <>
            <Typography variant="h6" sx={{ color: '#575757' }}>
              Parámetros de: {perfilSeleccionado.actividad?.nombre}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {camposDef.map(({ label, key }) => (
                <Box key={key} sx={{ flex: '1 1 150px', backgroundColor: '#fff', p: 2, borderRadius: 2 }}>
                  <Typography sx={{ color: '#575757' }}>{label}</Typography>
                  {modoEdicion ? (
                    <TextField
                      type="number"
                      value={datosEditados[key] ?? ''}
                      onChange={e =>
                        setDatosEditados({ ...datosEditados, [key]: parseFloat(e.target.value) })
                      }
                      fullWidth
                    />
                  ) : (
                    <Typography sx={{ color: '#575757' }}>{perfilSeleccionado[key]}</Typography>
                  )}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              {climas_disponibles.map((clima) => {
                const checked = modoEdicion
                  ? climasSeleccionados.includes(clima)
                  : (perfilSeleccionado.climas || []).some(c => c.nombre_clima === clima);

                return (
                  <Box key={clima} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ color: '#575757' }}>{clima}</Typography>
                    {modoEdicion ? (
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleClima(clima)}
                        sx={{ transform: 'scale(1.4)', color: '#10487f' }}
                      />
                    ) : (
                      <Checkbox checked={checked} disabled />
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              {modoEdicion ? (
                <>
                <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
                <Button variant= "outlined" onClick={() => {
                  setModoEdicion(false);
                  setDatosEditados({});
                  setClimasSeleccionados(perfilSeleccionado.climas?.map(c => c.nombre_clima) || []);
                }}>Cancelar</Button>
                </> 
              ) : (
                <Button variant="contained" onClick={handleModificarClick}>Modificar Perfil</Button>
              )}
              <Button variant="outlined" color="error" onClick={handleEliminar}>Eliminar Perfil</Button>
            </Box>
          </>
        ) : (
          <Typography textAlign="center">Selecciona una actividad para ver su perfil</Typography>
        )}
      </Box>
      <Snackbar 
        open={alerta.open}
        autoHideDuration={4000}
      onClose={() => setAlerta({ ...alerta, open: false })}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
      <Alert onClose={() => setAlerta({ ...alerta, open: false })} severity={alerta.tipo} sx={{ width: '100%' }}>
        {alerta.mensaje}
      </Alert>
      </Snackbar>
    
    </Box>
     
  );
};

export default PerfilActividades;
