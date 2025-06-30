const express = require('express');
const cors = require('cors');
const weatherRouter = require('./weatherRouter');
const {logger} = require('./middleware')
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  eliminarActividadesUsuario,
  asociarActividadUsuario,
  eliminarActividadUsuario,
  obtenerActividadesUsuario,
  modifDiaActividadUsuario
} = require('./controlActividades.js');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(logger);
app.use('/api/weather', weatherRouter);
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// --- LOGIN ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios.' });
  }
  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Correo electrónico no registrado o credenciales inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    const token = jwt.sign(
      { rut: user.rut, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.' });
  }
});

// --- REGISTRO ---
app.post('/api/auth/register', async (req, res) => {
  const { rut, email, nombres, apellidos, telefono, password } = req.body;
  if (!rut || !email || !nombres || !apellidos || !telefono || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  try {
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.usuario.create({
      data: {
        rut,
        email,
        nombres,
        apellidos,
        telefono,
        password: hashedPassword,
      },
    });
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

// --- MIDDLEWARE JWT ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- CRUD ACTIVIDADES ---
app.get('/api/actividades', async (req, res) => {
  try {
    const actividades = await obtenerActividades();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades', detalles: error.message });
  }
});

app.post('/api/actividades', async (req, res) => {
  try {
    const { nombre } = req.body;
    const nueva = await crearActividad(nombre);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear actividad', detalles: error.message });
  }
});

app.put('/api/actividades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const actualizada = await actualizarActividad(Number(id), nombre);
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar actividad', detalles: error.message });
  }
});

app.delete('/api/actividades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarActividad(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar actividad', detalles: error.message });
  }
});

// --- USUARIO ACTIVIDAD ---
app.post('/api/usuario_actividad', async (req, res) => {
  const { rut_usuario, id_actividad } = req.body;
  if (!rut_usuario || !id_actividad) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    const resultado = await asociarActividadUsuario(rut_usuario, id_actividad);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({
      error: 'Error al asociar actividad a usuario',
      detalles: error.message
    });
  }
});

app.delete('/api/usuario_actividad', async (req, res) => {
  try {
    const { rut_usuario } = req.body;
    if (!rut_usuario) {
      return res.status(400).json({ error: 'rut_usuario es requerido' });
    }
    await eliminarActividadesUsuario(rut_usuario);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar actividades del usuario', detalles: error.message });
  }
});

app.get('/api/usuario_actividad', async (req, res) => {
  const { rut_usuario } = req.query;
  try {
    const actividades = await obtenerActividadesUsuario(rut_usuario);
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades del usuario' });
  }
});

// --- MODIFICAR DÍA DE ACTIVIDAD ---
app.put('/api/usuario/dia', async (req, res) => {
  console.log('🟢 Recibida petición PUT /api/usuario/dia', req.body);
  const { rut_usuario, id_actividad, nuevoDia } = req.body;
  if (!rut_usuario || !id_actividad || !nuevoDia) {
    return res.status(400).json({ error: 'Faltan datos para modificar día' });
  }
  try {
    const resultado = await modifDiaActividadUsuario(rut_usuario, id_actividad, nuevoDia);
    res.json({ mensaje: 'Día modificado', actividades: resultado });
  } catch (err) {
    console.error('❌ Error en modificar-dia:', err);
    res.status(500).json({ error: 'Error en servidor', detalles: err.message });
  }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[Servidor] Escuchando en http://localhost:${PORT}`);
});
