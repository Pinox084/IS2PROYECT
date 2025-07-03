require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
  .create({
    body: '¡Hola! Esto es una prueba desde Node.js con Twilio.',
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    to: '+56944307129'
  })
  .then(message => console.log('Mensaje enviado con SID:', message.sid))
  .catch(error => console.error('Error al enviar:', error));