// Backend/twilioRouter.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();

// Carga tus credenciales desde .env
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Ruta para enviar SMS
router.post('/send', async (req, res) => {
  const { to, message } = req.body;

  try {
    const result = await client.messages.create({
      body: message,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: to,
    });

    res.status(200).json({ success: true, sid: result.sid });
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;