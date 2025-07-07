// Backend/api/auth/login/index.js (o el archivo que maneje el endpoint /api/auth/login)

// Importa Prisma Client y otras librerías necesarias
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Para comparar contraseñas
const jwt = require('jsonwebtoken'); // Para generar JSON Web Tokens

const prisma = new PrismaClient(); // Inicializa Prisma Client

// Función del controlador para el endpoint de inicio de sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validar que se enviaron email y password
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios.' });
  }

  try {
    // 2. Buscar el usuario en la base de datos por email
    const user = await prisma.usuario.findUnique({
      where: { email: email },
    });

    // 3. Verificar si el usuario existe
    if (!user) {
      // Importante: No indicar si es el email o la contraseña lo que falla por seguridad.
      // Un mensaje genérico evita enumeración de usuarios.
      return res.status(401).json({ error: 'Correo electrónico no registrado o credenciales inválidas.' });
    }

    // 4. Comparar la contraseña ingresada con la contraseña hasheada almacenada
    // Asume que la contraseña en la BD (`user.password`) ya está hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 5. Si las credenciales son válidas, generar un JSON Web Token (JWT)
    // El payload del token contendrá información que el frontend puede usar para identificar al usuario
    const token = jwt.sign(
      { rut: user.rut, email: user.email }, // Payload del token
      process.env.JWT_SECRET,             // Tu secreto JWT (debe estar en tus variables de entorno)
      { expiresIn: '1h' }                  // El token expirará en 1 hora
    );

    // 6. Preparar los datos del usuario para enviar al frontend (sin la contraseña)
    // Destructuring para excluir la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    // 7. Enviar respuesta exitosa con el token y los datos del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: userWithoutPassword,
      token: token,
    });

  } catch (error) {
    console.error('Error en el proceso de inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
  }
};

// Exporta la función para poder usarla en tu archivo de rutas de Express
module.exports = {
  loginUser,
};