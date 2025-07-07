const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const BACKEND_URL = 'http://localhost:4000'; // Ajusta según entorno

// Cron para las 7 AM todos los días
cron.schedule('0 9 * * *', async () => {
  console.log('Enviando SMS programado a las 7 AM...');

  try {
    const usuarios = await prisma.usuario.findMany(); // TODOS los usuarios

    for (const usuario of usuarios) {
      const message = `Hola ${usuario.nombres}, recuerda revisar si puedes realizar tus actividades hoy.`;

      await axios.post(`${BACKEND_URL}/twilio/send`, {
        to: `+56${usuario.telefono}`, // Asegúrate que el teléfono está bien almacenado
        message,
      });

      console.log(`SMS enviado a ${usuario.telefono}`);
    }
  } catch (error) {
    console.error('Error al enviar SMS programado:', error.message);
  }
});