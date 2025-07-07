// src/pages/UserInfoPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  InputAdornment,
  CircularProgress // Asegúrate de importar CircularProgress si lo usas
} from "@mui/material";
import { AccountCircle, Email, Phone, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserInfoPage = () => {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);
  const [localUserData, setLocalUserData] = useState(userData);
  const [message, setMessage] = useState(''); // Para mensajes de éxito
  const [error, setError] = useState(null); // <-- ¡¡¡Esta línea debe estar para el setError!!!
  const [loading, setLoading] = useState(false); // Para el estado de carga

  const BACKEND_URL = 'http://localhost:4000'; // Correcto, apunta a tu backend

  // Redirigir si es invitado o no hay userData válido para perfil
  useEffect(() => {
    if (!userData || userData.isGuest) {
      navigate('/time');
      return;
    }
    setLocalUserData(userData);
  }, [userData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditable(true);
    setMessage(''); // Limpiar mensajes al entrar en modo edición
    setError(null); // Limpiar errores al entrar en modo edición
  };

  const handleSave = async () => {
    setLoading(true); // Iniciar carga
    setMessage('');   // Limpiar mensajes anteriores
    setError(null);   // Limpiar errores anteriores

    try {
      if (!localUserData?.rut) {
        throw new Error('RUT del usuario no disponible para la actualización.');
      }

      const userToken = localStorage.getItem('userToken'); // Obtener el token
      if (!userToken) {
        throw new Error('No se encontró token de autenticación. Por favor, inicia sesión de nuevo.');
      }

      const dataToUpdate = {
        rut_usuario: localUserData.rut,
        nombres: localUserData.nombres,
        apellidos: localUserData.apellidos,
        email: localUserData.email,
        telefono: localUserData.telefono,
        ubicacion_texto: localUserData.ubicacion_texto,
      };

      // --- AÑADE ESTOS CONSOLE.LOGS EN EL FRONTEND ---
      console.log('🔵 [FRONTEND] Token enviado:', userToken ? 'TOKEN_PRESENTE' : 'NO_TOKEN');
      console.log('🔵 [FRONTEND] Longitud del Token:', userToken ? userToken.length : 'N/A');
      console.log('🔵 [FRONTEND] Datos de usuario para actualizar:', dataToUpdate);
      // ------------------------------------------------

      const response = await fetch(`${BACKEND_URL}/api/usuario`, { // Endpoint PUT para usuario
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      const result = await response.json(); // Intentar parsear la respuesta

      if (response.ok) {
        setUserData(localUserData);
        localStorage.setItem('userData', JSON.stringify(localUserData));
        setMessage('¡Información actualizada exitosamente!');
        setIsEditable(false);
      } else {
        setError(result.error || 'Error al guardar los cambios.');
      }
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError(err.message || 'Error desconocido al guardar los cambios.');
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  if (loading && !localUserData) {
    return (
      <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando perfil...</Typography>
      </Container>
    );
  }

  if (!localUserData) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">Cargando datos del usuario...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
          Información de Perfil
        </Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="RUT"
            name="rut"
            variant="filled"
            fullWidth
            value={localUserData.rut || ''}
            disabled
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Nombres"
            name="nombres"
            variant="filled"
            fullWidth
            value={localUserData.nombres || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Apellidos"
            name="apellidos"
            variant="filled"
            fullWidth
            value={localUserData.apellidos || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Correo Electrónico"
            name="email"
            variant="filled"
            fullWidth
            value={localUserData.email || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>), }}
          />
          <TextField
            label="Teléfono"
            name="telefono"
            variant="filled"
            fullWidth
            value={localUserData.telefono || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Phone /></InputAdornment>), }}
          />
          <TextField
            label="Ubicación"
            name="ubicacion_texto"
            variant="filled"
            fullWidth
            value={localUserData.ubicacion_texto || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOn /></InputAdornment>), }}
          />

          {message && (
            <Typography color="primary" variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}>
              {message}
            </Typography>
          )}
          {error && ( // Muestra el mensaje de error si existe
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}>
              {error}
            </Typography>
          )}

          {!isEditable ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleEdit}
              sx={{
                mt: 2, py: 1.3, fontWeight: "bold", fontSize: "1rem",
                background: "linear-gradient(to right, #1976d2, #42a5f5)",
                "&:hover": { background: "linear-gradient(to right, #1565c0, #2196f3)", },
              }}
            >
              Editar
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              sx={{
                mt: 2, py: 1.3, fontWeight: "bold", fontSize: "1rem",
                background: "linear-gradient(to right, #1976d2, #42a5f5)",
                "&:hover": { background: "linear-gradient(to right, #1565c0, #2196f3)", },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserInfoPage;