import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Container, Paper, Link } from "@mui/material";
import Background from "../components/Background"; // Importa el componente de fondo
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // Estado para el correo
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const navigate = useNavigate(); // Hook para redirección

  const handleLogin = () => {
    // Validación básica.
    if (email && password) {
      console.log("Usuario:", email, "Contraseña:", password); // Solo para pruebas
      navigate("/time"); // Redirige a la página principal
    } else {
      alert("Por favor, ingresa tus datos.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Redirige a la página de registro
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