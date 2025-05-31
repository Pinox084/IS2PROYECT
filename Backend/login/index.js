// Backend/index.js (Extracto, asumiendo que ya tienes las importaciones y la configuración básica de Express)

// Asegúrate de tener estas importaciones al inicio de tu Backend/index.js:
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Para cargar variables de entorno
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Para hashear y comparar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const prisma = new PrismaClient(); // Inicializa Prisma Client

// Asegúrate de definir tu JWT_SECRET en el archivo .env en la raíz de tu backend
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET no está definido en el archivo .env. Por favor, configúralo.');
  process.exit(1); // Sale de la aplicación si el secreto no está configurado
}


// --- Middlewares (ya los tienes probablemente) ---
app.use(cors()); // Habilita CORS
app.use(express.json()); // Habilita el parsing de JSON


// --- RUTA DE LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios.' });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Correo electrónico no registrado o credenciales inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Generar JWT
    const token = jwt.sign(
      { rut: user.rut, email: user.email }, // Payload del token
      JWT_SECRET,                          // Tu secreto JWT
      { expiresIn: '1h' }                  // El token expirará en 1 hora
    );

    // Preparar los datos del usuario para enviar al frontend (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: userWithoutPassword,
      token: token,
    });

  } catch (error) {
    console.error('Error en el proceso de inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
  }
});

// --- RUTA DE REGISTRO (Asegúrate de que use bcrypt para hashear la contraseña) ---
app.post('login/', async (req, res) => {
    const { rut, email, nombres, apellidos, telefono, password } = req.body;

    // Validación básica de campos
    if (!rut || !email || !nombres || !apellidos || !telefono || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificar si el RUT o el email ya están registrados
        const existingUser = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { rut: rut },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.rut === rut) {
                return res.status(409).json({ error: 'El RUT ya está registrado.' });
            }
            if (existingUser.email === email) {
                return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
            }
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del salt (factor de fuerza del hash)

        const newUser = await prisma.usuario.create({
            data: {
                rut,
                email,
                nombres,
                apellidos,
                telefono,
                password: hashedPassword, // Guarda la contraseña hasheada
            },
        });

        // Generar token para el nuevo usuario (opcional, podrías solo redirigir al login)
        const token = jwt.sign(
            { rut: newUser.rut, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            user: userWithoutPassword,
            token,
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
    }
});


// --- Middleware para verificar el JWT (Ya lo tienes en tu index.js) ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // No hay token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      // Un 403 Forbidden es más apropiado si el token existe pero no es válido
      return res.sendStatus(403);
    }
    req.user = user; // Guarda la información del usuario del token en req.user
    next();
  });
};

// --- Ruta para actualizar los datos del usuario (requiere autenticación) ---
// Asegúrate de que tu `app.put('/api/users/:rut', authenticateToken, ...)`
// esté usando este middleware y la lógica de actualización.
// Tu `index.js` ya lo tiene bien implementado.

// --- Ruta para obtener los datos del usuario logueado (útil si necesitas recargar desde DB) ---
// Tu `index.js` ya lo tiene bien implementado.


// --- Iniciar el servidor (EDITAR CON EL SERVIDOR CORRECTO) ---
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});