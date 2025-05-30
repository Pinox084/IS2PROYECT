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
} from "@mui/material";
import { AccountCircle, Email, Phone, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const UserInfoPage = () => {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate(); // Hook para navegación
  const [isEditable, setIsEditable] = useState(false);
  const [localUserData, setLocalUserData] = useState(userData); // Estado local para edición
  const [message, setMessage] = useState(''); // Para mensajes de éxito/error

  const BACKEND_URL = 'http://localhost:3001';

  // Redirigir si es invitado o no hay userData válido para perfil
  useEffect(() => {
    // Si no hay userData (ej. recién cargado y no hay sesión) O es un invitado
    if (!userData || userData.isGuest) {
      // Redirige a la página principal. Los invitados no tienen un perfil para editar.
      navigate('/time');
      return;
    }
    // Sincroniza el estado local con userData del contexto cuando cambie
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
    setMessage(''); // Limpiar mensajes al editar
  };

  const handleSave = async () => {
    setMessage('');
    // Validación básica antes de enviar
    if (!localUserData.nombres || !localUserData.apellidos || !localUserData.email || !localUserData.rut) {
      setMessage("Todos los campos requeridos deben ser completados.");
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage('Error: No hay token de autenticación.');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/users/${localUserData.rut}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Envía el token JWT
        },
        body: JSON.stringify({
          email: localUserData.email,
          nombres: localUserData.nombres,
          apellidos: localUserData.apellidos,
          telefono: localUserData.telefono,
          // No enviar ubicacion_texto si no se agregó al modelo Usuario
          // Si ubicacion es una relación, el manejo es más complejo y no es directo aquí.
          // Si es un campo de texto simple: ubicacion: localUserData.ubicacion
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Datos guardados correctamente.");
        setIsEditable(false);
        setUserData(prevData => ({ // Actualiza el contexto con los nuevos datos
          ...prevData,
          ...data.user, // Recibe los datos actualizados del backend
          isGuest: false // Asegúrate de que no es invitado
        }));
      } else {
        setMessage(`Error al guardar: ${data.error || 'Algo salió mal.'}`);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage('Error de conexión con el servidor al guardar datos.');
    }
  };

  // No renderizar el formulario si es invitado o si userData aún no está cargado correctamente (y no es invitado)
  if (!userData || userData.isGuest) {
    // Si llegamos aquí, es porque la redirección aún no ha ocurrido o se está procesando
    return <Typography>Cargando información del usuario o redirigiendo...</Typography>;
  }

  return (
    <Container maxWidth="sm"
    sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}>
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          mt: 4, // Margen superior para separarlo
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            color: "#1976d2",
            fontSize: "2rem",
          }}
        >
          Información del Usuario
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="RUT"
            variant="filled"
            fullWidth
            name="rut"
            value={localUserData.rut || ''}
            InputProps={{
              readOnly: true, // El RUT no debería ser editable
              startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>),
            }}
          />
          <TextField
            label="Nombres"
            variant="filled"
            fullWidth
            name="nombres"
            value={localUserData.nombres || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Apellidos"
            variant="filled"
            fullWidth
            name="apellidos"
            value={localUserData.apellidos || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Correo Electrónico"
            variant="filled"
            fullWidth
            name="email"
            value={localUserData.email || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>), }}
          />
          <TextField
            label="Teléfono"
            variant="filled"
            fullWidth
            name="telefono"
            value={localUserData.telefono || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Phone /></InputAdornment>), }}
          />
          {/* Si ubicacion es un campo de texto simple en Usuario, descomentar */}
          {/*
          <TextField
            label="Ubicación"
            variant="filled"
            fullWidth
            name="ubicacion_texto" // O el nombre de tu campo
            value={localUserData.ubicacion_texto || ''}
            onChange={handleChange}
            disabled={!isEditable}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOn /></InputAdornment>), }}
          />
          */}

          {message && (
            <Typography color={message.includes('Error') ? 'error' : 'primary'} variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {message}
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
            >
              Guardar Cambios
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserInfoPage;