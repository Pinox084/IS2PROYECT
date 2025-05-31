

const prisma = require('./prismaClient.js');

// Obtener todas las actividades
async function obtenerActividades() {
  return await prisma.actividad.findMany();
}

// Crear una nueva actividad
async function crearActividad(nombre) {
  return await prisma.actividad.create({ data: { nombre } });
}

// Actualizar una actividad por id
async function actualizarActividad(id_actividad, nuevoNombre) {
  return await prisma.actividad.update({
    where: { id_actividad },
    data: { nombre: nuevoNombre }
  });
}

// Eliminar una actividad por id
async function eliminarActividad(id_actividad) {
  return await prisma.actividad.delete({ where: { id_actividad } });
}

module.exports = {obtenerActividades, crearActividad, actualizarActividad, eliminarActividad}