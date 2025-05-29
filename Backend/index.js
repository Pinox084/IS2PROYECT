// server/index.js (añadir después de las rutas de login/register)

// Middleware para verificar el JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // No hay token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.sendStatus(403); // Token inválido o expirado
    }
    req.user = user; // Guarda la información del usuario del token en req.user
    next();
  });
};

// Ruta para actualizar los datos del usuario (requiere autenticación)
app.put('/api/users/:rut', authenticateToken, async (req, res) => {
  try {
    const { rut } = req.params; // RUT del usuario a actualizar desde la URL
    const { email, nombres, apellidos, telefono } = req.body; // Datos a actualizar

    // Opcional: Asegurarse de que el usuario que intenta actualizar es el mismo que está logueado
    if (req.user.rut !== rut) {
      return res.status(403).json({ error: "No tienes permiso para actualizar este perfil." });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { rut: rut },
      data: {
        email,
        nombres,
        apellidos,
        telefono,
        // No permitir que el usuario cambie su contraseña o RUT desde esta ruta directamente
      },
    });

    res.status(200).json({
      message: 'Perfil actualizado con éxito',
      user: {
        rut: usuarioActualizado.rut,
        email: usuarioActualizado.email,
        nombres: usuarioActualizado.nombres,
        apellidos: usuarioActualizado.apellidos,
        telefono: usuarioActualizado.telefono,
      },
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    if (error.code === 'P2025') { // No se encontró el registro para actualizar
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.status(500).json({ error: 'Error interno del servidor al actualizar perfil.' });
  }
});

// Ruta para obtener los datos del usuario logueado (útil si necesitas recargar desde DB)
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { rut: req.user.rut },
      select: {
        rut: true,
        email: true,
        nombres: true,
        apellidos: true,
        telefono: true,
        // No incluyas la contraseña
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});