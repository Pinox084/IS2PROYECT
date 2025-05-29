// src/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Container, Paper, Link } from "@mui/material";
import Background from "../components/Background";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const BACKEND_URL = 'http://localhost:3001';

  const handleLogin = async () => {
    setError("");

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
        setUserData({
          ...data.user,
          token: data.token,
        });
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        navigate("/time");
      } else {
        setError(data.error || 'Error al iniciar sesión.');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
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
              {/* No se necesita el error condicional aquí si el helperText ya lo muestra */}
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