// src/pages/user.jsx (RegistroForm)
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  Paper,
} from "@mui/material";
import { AccountCircle, Email, Lock, LockOutlined, Phone, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { validateRut } from '@fdograph/rut-utilities';


const RegistroForm = () => {
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [rut, setRut] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState(""); // Usaremos esto para el campo 'ubicacion_texto' si lo agregaste a Usuario

  const [rutError, setRutError] = useState("");
  const [nombresError, setNombresError] = useState("");
  const [apellidosError, setApellidosError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  const BACKEND_URL = 'http://localhost:3001';

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    setApiError("");

    // Resetear todos los errores
    setRutError("");
    setNombresError("");
    setApellidosError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validaciones frontend
    if (!rut) { setRutError("El RUT es obligatorio."); isValid = false; }
    else if (!validateRut(rut)) { setRutError("Ingrese un rut válido."); isValid = false}
    if (!nombres) { setNombresError("Los nombres son obligatorios."); isValid = false }
    else if (/[0-9]/.test(nombres)) { setNombresError("Ingrese un nombre sin caracteres especiales."); isValid = false }
    else if (!/^[a-zA-Z0-9\s]+$/.test(nombres)) { setNombresError("Ingrese un nombre sin caracteres especiales."); isValid = false }
    if (!apellidos) { setApellidosError("Los apellidos son obligatorios."); isValid = false; }
    else if (/[0-9]/.test(apellidos)) { setApellidosError("Ingrese un apellido sin caracteres especiales."); isValid = false }
    else if (!/^[a-zA-Z0-9\s]+$/.test(apellidos)) { setApellidosError("Ingrese un apellido sin caracteres especiales."); isValid = false }
    if (!email) { setEmailError("El email es obligatorio."); isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Ingresa un email válido."); isValid = false; }

    if (!password) { setPasswordError("La contraseña es obligatoria."); isValid = false; }
    else if (password.length < 6) { setPasswordError("La contraseña debe tener al menos 6 caracteres."); isValid = false; }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rut,
            email,
            password,
            nombres,
            apellidos,
            telefono,
            ubicacion_texto: ubicacion, // Si el backend espera un campo de texto para la ubicación
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Usuario registrado correctamente");
          setUserData({
            ...data.user,
            token: data.token,
          });
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
          navigate("/time");
        } else {
          setApiError(data.error || 'Error desconocido al registrar.');
        }
      } catch (error) {
        console.error('Error de conexión:', error);
        setApiError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
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
          REGISTRO DE USUARIO
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="RUT"
            variant="filled"
            fullWidth
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            error={!!rutError}
            helperText={rutError}
            placeholder="111111111-1"
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Nombres"
            variant="filled"
            fullWidth
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            error={!!nombresError}
            helperText={nombresError}
            placeholder="Roberto"
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Apellidos"
            variant="filled"
            fullWidth
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            error={!!apellidosError}
            helperText={apellidosError}
            placeholder="Fuentes"
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>), }}
          />
          <TextField
            label="Correo Electrónico"
            variant="filled"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            placeholder="correo@electrónico.com"
            InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>), }}
          />
          <TextField
            label="Teléfono"
            variant="filled"
            fullWidth
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="912345678"
            InputProps={{ startAdornment: (<InputAdornment position="start"><Phone /></InputAdornment>), }}
          />
          <TextField
            label="Ubicación"
            variant="filled"
            fullWidth
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOn /></InputAdornment>), }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="filled"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>), }}
          />
          <TextField
            label="Confirmar Contraseña"
            type="password"
            variant="filled"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlined /></InputAdornment>), }}
          />

          {apiError && (
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {apiError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2, py: 1.5, fontWeight: "bold", fontSize: "1rem",
              background: "linear-gradient(to right, #1976d2, #42a5f5)",
              color: "white",
              "&:hover": { background: "linear-gradient(to right, #1565c0, #2196f3)", },
            }}
          >
            Registrarse
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistroForm;