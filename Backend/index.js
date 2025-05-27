// src/server/index.js
const express = require('express');
const cors = require('cors');
const { obtenerActividades, crearActividad } = require('./controlActividades.js');

const app = express();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

// Endpoint para obtener todas las actividades
app.get('/api/actividades', async (req, res) => {
  try {
    const actividades = await obtenerActividades();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

// Endpoint para crear una nueva actividad
app.post('/api/actividades', async (req, res) => {
  try {
    const { nombre } = req.body;
    const nueva = await crearActividad(nombre);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear actividad' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

