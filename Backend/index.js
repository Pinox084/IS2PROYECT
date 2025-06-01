const express = require('express');
const cors = require('cors');
const {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividadesUsuario,
  asociarActividadUsuario,
  eliminarActividadUsuario,
  obtenerActividadesUsuario,
  modifDiaActividadUsuario
} = require('./controlActividades.js');

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static('dist'));


// Obtener todas las actividades
app.get('/api/actividades', async (req, res) => {
  try {
    const actividades = await obtenerActividades();
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades', detalles: error.message });
  }
});

// Crear una nueva actividad
app.post('/api/actividades', async (req, res) => {
  try {
    const { nombre } = req.body;
    const nueva = await crearActividad(nombre);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear actividad', detalles: error.message });
  }
});

// Actualizar una actividad
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

// Eliminar una actividad
app.delete('/api/actividades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarActividad(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar actividad', detalles: error.message });
  }
});

// Asociar actividad a usuario
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

// Eliminar relación usuario-actividad
// routes/usuarioActividad.js o donde tengas tu API
app.delete('/api/usuario_actividad', async (req, res) => {
  try {
    const { rut_usuario } = req.body;

    if (!rut_usuario) {
      return res.status(400).json({ error: 'rut_usuario es requerido' });
    }

    await eliminarActividadesUsuario(rut_usuario);
    res.status(204).send(); // Sin contenido, pero con éxito
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar actividades del usuario', detalles: error.message });
  }
});

// Obtener actividades asociadas a un usuario
app.get('/api/usuario_actividad', async (req, res) => {
  const { rut_usuario } = req.query;
  console.log('🟢 Recibida petición PUT /api/actividades/actividades', req.body);
  try {
    const actividades = await obtenerActividadesUsuario(rut_usuario);
    res.json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades del usuario' });
  }
});


app.put('/api/usuario/dia' , async (req, res) =>{

  console.log('🟢 Recibida petición PUT /api/actividades/modificar-dia', req.body);
  console.log('Mondongo')
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
  
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[Servidor] Escuchando en http://localhost:${PORT}`);
});
