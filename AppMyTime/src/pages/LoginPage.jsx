// src/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Container, Paper, Link } from "@mui/material";
import Background from "../components/Background";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { UserContext } from "../context/UserContext"; // Asegúrate de que UserContext puede manejar 'isGuest'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext); // Asumiendo que setUserData puede actualizar el estado isGuest

  const BACKEND_URL = 'http://localhost:5173';

  const handleLogin = async () => {
    setError(""); // Limpiar errores anteriores

    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Almacenar datos del usuario y el token, y establecer isGuest en false
        setUserData({
          ...data.user,
          token: data.token,
          isGuest: false, // No es un invitado
        });
        navigate("/time"); // Navegar a la página principal
      } else {
        // Mostrar el error que viene del backend (ej. "Correo no registrado")
        setError(data.error || 'Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  // MODIFICADO: Función para manejar el inicio de sesión como invitado
  const handleGuestLogin = () => {
    setUserData({
      isGuest: true,
      // Puedes añadir datos dummy o null para invitados, según lo que necesites
      token: null, // No hay token para invitados
      rut: null,
      email: "guest@example.com", // Un email dummy o null para invitados
      nombres: "Invitado",
      apellidos: "",
      telefono: null
    });
    navigate("/time"); // Navegar a la página principal directamente
  };

  return (
    <Background>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-40px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#1976d2",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <AccountCircleIcon sx={{ color: "white", fontSize: "50px" }} />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                color: "#1976d2",
                marginTop: "50px",
                fontSize: "2rem",
              }}
            >
              INICIAR SESIÓN
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon sx={{ color: "#1976d2" }} />
                <TextField
                  label="Correo Electrónico"
                  variant="filled"
                  fullWidth
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
                <LockIcon sx={{ color: "#1976d2" }} />
                <TextField
                  label="Contraseña"
                  variant="filled"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  helperText={error}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 5,
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                }}
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>
              {}
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    borderColor: "#1565c0",
                    color: "#1565c0"
                  },
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                }}
                onClick={handleGuestLogin}
              >
                Ingresar como Invitado
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleRegisterRedirect}
                  sx={{ color: "#1976d2", fontWeight: "bold", mt:3 }}
                >
                  Registrarse
                </Link>
                <Link
                  component="button"
                  variant="body2"
                  sx={{ color: "#1976d2", fontWeight: "bold", mt:3 }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Background>
  );
}