// Archivo renombrado a controlActividades.js (JavaScript)

import prisma from './prismaClient.js';

// Obtener todas las actividades
export async function obtenerActividades() {
  return await prisma.actividad.findMany();
}

// Crear una nueva actividad
export async function crearActividad(nombre) {
  return await prisma.actividad.create({ data: { nombre } });
}

// Actualizar una actividad por id
export async function actualizarActividad(id_actividad, nuevoNombre) {
  return await prisma.actividad.update({
    where: { id_actividad },
    data: { nombre: nuevoNombre }
  });
}

// Eliminar una actividad por id
export async function eliminarActividad(id_actividad) {
  return await prisma.actividad.delete({ where: { id_actividad } });
}
