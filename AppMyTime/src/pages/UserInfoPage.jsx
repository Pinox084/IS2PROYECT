import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext"; // Importa el contexto
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

const UserInfoPage = () => {
  const { userData, setUserData } = useContext(UserContext); // Obtén los datos del contexto
  const [isEditable, setIsEditable] = useState(false); // Estado para controlar si los campos son editables

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditable(true); // Permite editar los campos
  };

  const handleSave = () => {
    setIsEditable(false); // Desactiva la edición
    alert("Datos guardados correctamente");
  };

  return (
    <Container maxWidth="sm"
    sx={{
        display: "flex",
        justifyContent: "flex-start", // Alinea el contenido a la izquierda
        alignItems: "flex-start", // Alinea el contenido en la parte superior
      }}>
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          width: "100%", // Asegúrate de que el Paper ocupe todo el ancho disponible
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
          INFORMACIÓN DEL USUARIO
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
        >
          <TextField
            label="Nombre"
            variant="filled"
            fullWidth
            name="name"
            value={userData.name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            disabled={!isEditable} // Desactiva el campo si no está en modo edición
          />
          <TextField
            label="Correo Electrónico"
            variant="filled"
            fullWidth
            name="email"
            value={userData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            disabled={!isEditable} // Desactiva el campo si no está en modo edición
          />
          <TextField
            label="Teléfono"
            variant="filled"
            fullWidth
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
            disabled={!isEditable} // Desactiva el campo si no está en modo edición
          />
          <TextField
            label="Ubicación"
            variant="filled"
            fullWidth
            name="location"
            value={userData.location}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
            disabled={!isEditable} // Desactiva el campo si no está en modo edición
          />

          {/* Botones de Editar y Guardar Cambios */}
          {!isEditable ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleEdit}
              sx={{
                mt: 2,
                py: 1.3,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(to right, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(to right, #1565c0, #2196f3)",
                },
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
                mt: 2,
                py: 1.3,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(to right, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(to right, #1565c0, #2196f3)",
                },
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