// src/server/index.js
import express from 'express';
import cors from 'cors';
import prisma from './prismaClient.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obtener todas las actividades
app.get('/api/actividades', async (req, res) => {
  try {
    const actividades = await prisma.actividad.findMany();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
