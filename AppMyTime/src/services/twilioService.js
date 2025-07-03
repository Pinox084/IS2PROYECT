// const BACKEND_URL = 'http://localhost:4000'; // o la URL de producción si aplica

const BACKEND_URL = 'http://localhost:4000';

export const sendSms = async (to, message) => {
  try {
    const response = await fetch(`${BACKEND_URL}/twilio/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, message })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error desconocido al enviar el SMS');
    }

    return { success: response.ok, sid: data.sid };
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    return { success: false, error: error.message };
  }
};