const express = require('express');
const cors = require('cors');
const weatherRouter = require('./weatherRouter');
const { logger } = require('./middleware');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./smsProgramado'); // importa el programador automático
const {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  eliminarActividadesUsuario,
  asociarActividadUsuario,
  eliminarActividadUsuario,
  obtenerActividadesUsuario,
  modifDiaActividadUsuario,
  obtenerClimas, // Asegúrate de que esto está definido en controlActividades.js si lo usas
  obtenerPerfilesUsuario,
  eliminarPerfilUsuario,
  editarPerfilUsuario
} = require('./controlActividades.js');
// twilio será utlizado pera el envío de sms, tiene créditos limitados
const twilioRouter = require('./twilioRouter');
//const { user } = require('pg/lib/defaults.js');

dotenv.config();
const app = express();
const prisma = new PrismaClient(); // Inicializa Prisma Client aquí
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto'; // Define tu secreto JWT

// Middlewares
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones JSON
app.use(express.static('dist')); // Para servir archivos estáticos de React
app.use(logger); // Tu logger personalizado
app.use('/api/weather', weatherRouter); // Rutas de clima

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🟢 [BACKEND - verifyToken] Headers de autorización recibidos:', authHeader);
  console.log('🟢 [BACKEND - verifyToken] Token extraído:', token ? token.substring(0, 30) + '...' : 'NO_TOKEN');

  if (!token) {
    console.warn('🔴 [BACKEND - verifyToken] No se proporcionó token.');
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Usa JWT_SECRET
    req.user = decoded; // Adjunta el payload decodificado a la solicitud
    console.log('🟢 [BACKEND - verifyToken] Token decodificado (req.user):', req.user);
    next();
  } catch (error) {
    console.error('🔴 [BACKEND - verifyToken] Error al verificar token:', error.message);
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};


// --- RUTAS DE AUTENTICACIÓN Y USUARIO ---

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('POST /api/auth/login', req.query, req.body); // Log de la petición de login

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios.' });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { rut: user.rut, email: user.email },
      JWT_SECRET, // Usa JWT_SECRET aquí también
      { expiresIn: '1h' }
    );

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


// REGISTRO DE USUARIO
app.post('/api/auth/register', async (req, res) => {
  const { rut, nombres, apellidos, email, password, telefono, ubicacion_texto } = req.body;

  if (!rut || !nombres || !apellidos || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para el registro.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.usuario.create({
      data: {
        rut,
        nombres,
        apellidos,
        email,
        password: hashedPassword,
        telefono: telefono || null,
        ubicacion_texto: ubicacion_texto || null,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === 'P2002') { // Código de error de Prisma para campos únicos duplicados
      return res.status(409).json({ error: 'El RUT o el correo electrónico ya están registrados.' });
    }
    res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
  }
});


// OBTENER INFORMACIÓN DEL USUARIO (Protegida)
app.get('/api/usuario', verifyToken, async (req, res) => {
  // El RUT del usuario autenticado viene del token decodificado
  const authenticatedRut = req.user.rut;
  console.log('GET /api/usuario - RUT autenticado:', authenticatedRut);

  if (!authenticatedRut) {
    return res.status(400).json({ error: 'RUT de usuario no encontrado en el token.' });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { rut: authenticatedRut },
      select: { // Seleccionar los campos a devolver (sin la contraseña)
        rut: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        ubicacion_texto: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el usuario.', detalles: error.message });
  }
});


// ACTUALIZAR INFORMACIÓN COMPLETA DEL USUARIO (Protegida)
app.put('/api/usuario', verifyToken, async (req, res) => {
  console.log('🟢 [BACKEND - PUT /api/usuario] Petición recibida para actualizar usuario.');
  const { rut_usuario, nombres, apellidos, email, telefono, ubicacion_texto } = req.body;
  const authenticatedRut = req.user.rut; // Esto viene del token decodificado por verifyToken

  // 1. Validar que el RUT en el cuerpo coincide con el RUT del token autenticado
  if (!rut_usuario || rut_usuario !== authenticatedRut) {
    console.warn('🟠 [BACKEND - PUT /api/usuario] Mismatch o falta de RUT: el rut_usuario en el body debe coincidir con el autenticado.');
    return res.status(403).json({ error: 'No tienes permiso para actualizar este perfil o el RUT es inconsistente.' });
  }

  try {
    // 2. Construir el objeto de datos para la actualización dinámicamente
    // Esto permite actualizar solo los campos que se envían y no sobrescribir otros con 'undefined'
    const dataToUpdate = {};
    if (nombres !== undefined) dataToUpdate.nombres = nombres;
    if (apellidos !== undefined) dataToUpdate.apellidos = apellidos;
    if (email !== undefined) dataToUpdate.email = email;
    if (telefono !== undefined) dataToUpdate.telefono = telefono;
    if (ubicacion_texto !== undefined) dataToUpdate.ubicacion_texto = ubicacion_texto;

    // Si no hay campos para actualizar, devolver un error 400
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
    }

    // 3. Actualizar el usuario en la base de datos usando Prisma
    const updatedUser = await prisma.usuario.update({
      where: { rut: rut_usuario },
      data: dataToUpdate,
      select: { // Selecciona solo los campos que quieres devolver (excluyendo la contraseña)
        rut: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        ubicacion_texto: true,
      }
    });

    // 4. Enviar respuesta exitosa al frontend
    res.status(200).json({
      message: 'Perfil actualizado exitosamente.',
      user: updatedUser, // Devuelve los datos actualizados del usuario (sin contraseña)
    });
    console.log('🟢 [BACKEND - PUT /api/usuario] Perfil actualizado con éxito para RUT:', rut_usuario);

  } catch (error) {
    console.error('🔴 [BACKEND - PUT /api/usuario] Error al actualizar perfil:', error);
    // Manejo específico para errores de Prisma, ej. si el RUT no existe
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Usuario no encontrado.' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor al actualizar perfil.', detalles: error.message });
    }
  }
});


// --- RUTAS DE ACTIVIDADES ---

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
    const nuevaActividad = await crearActividad(req.body);
    res.status(201).json(nuevaActividad);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear actividad', detalles: error.message });
  }
});

app.put('/api/actividades', async (req, res) => {
  const { id, ...data } = req.body;
  try {
    const actividadActualizada = await actualizarActividad(id, data);
    res.json(actividadActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar actividad', detalles: error.message });
  }
});

app.delete('/api/actividades', async (req, res) => {
  const { id } = req.body;
  try {
    await eliminarActividad(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar actividad', detalles: error.message });
  }
});

app.delete('/api/usuario_actividades', async (req, res) => {
  const { rut_usuario } = req.body;
  if (!rut_usuario) {
    return res.status(400).json({ error: 'rut_usuario es requerido' });
  }
  try {
    await eliminarActividadesUsuario(rut_usuario);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar actividades del usuario', detalles: error.message });
  }
});

app.post('/api/asociar_actividad', async (req, res) => {
  const { rut_usuario, id_actividad, id_perfil } = req.body;
  try {
    const resultado = await asociarActividadUsuario(rut_usuario, id_actividad, id_perfil);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("❌ ERROR DETECTADO EN BACKEND (asociar_actividad):", error);
    res.status(500).json({ error: 'Error al asociar actividad al usuario', detalles: error.message });
  }
});

app.delete('/api/usuario_actividad', async (req, res) => {
  const { rut_usuario, id_actividad } = req.body;
  if (!rut_usuario || !id_actividad) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para eliminar actividad del usuario' });
  }
  try {
    await eliminarActividadUsuario(rut_usuario, id_actividad);
    res.status(204).send();
  } catch (error) {
    console.error("❌ ERROR DETECTADO EN BACKEND (eliminar_actividad_usuario):", error);
    res.status(500).json({ error: 'Error al eliminar actividad del usuario', detalles: error.message });
  }
});

app.get('/api/usuario_actividad', async (req, res) => {
  const { rut_usuario } = req.query;
  try {
    const actividades = await obtenerActividadesUsuario(rut_usuario);
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades del usuario', detalles: error.message });
  }
});

// MODIFICAR DÍA DE ACTIVIDAD
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

// Rutas para Perfiles
app.get('/api/perfiles', async (req, res) => {
  const { rut_usuario } = req.query;
  if (!rut_usuario) {
    return res.status(400).json({ error: 'rut_usuario es requerido' });
  }

  try {
    const perfiles = await obtenerPerfilesUsuario(rut_usuario);
    res.json(perfiles);
  } catch (error) {
     console.error("❌ ERROR DETECTADO EN BACKEND:", error);
    res.status(500).json({ error: 'Error al obtener perfiles', detalles: error.message });
  }
});

app.delete('/api/perfiles', async (req, res) => {
  const { rut_usuario, id_actividad, id_perfil } = req.body;
  if (!rut_usuario || !id_actividad || !id_perfil) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    await eliminarPerfilUsuario(rut_usuario, id_actividad, id_perfil);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar perfil',
      detalles: error.message
    });
  }
});

app.put('/api/perfiles', async (req, res) => {
  const { rut_usuario, id_actividad,id_perfil, ...perfilData } = req.body;

  if (!rut_usuario || !id_actividad) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    await editarPerfilUsuario(rut_usuario, id_actividad, perfilData);
    res.status(200).json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al editar perfil', detalles: error.message });
  }
});


// INICIAR SERVIDOR
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});