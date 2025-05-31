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

// Eliminar actividades
async function eliminarActividadesUsuario(rut_usuario) {
  await prisma.Usuario_Actividad.deleteMany({
    where: {
      rut_usuario
    }
  });
}

// Asociar actividad a usuario (solo si no existe ya la relación)
async function asociarActividadUsuario(rut_usuario, id_actividad) {
  // Validar existencia del usuario
  const usuario = await prisma.usuario.findUnique({
    where: { rut: rut_usuario }
  });
  if (!usuario) {
    throw new Error(`Usuario con rut ${rut_usuario} no encontrado`);
  }

  // Validar existencia de la actividad
  const actividad = await prisma.actividad.findUnique({
    where: { id_actividad }
  });
  if (!actividad) {
    throw new Error(`Actividad con id ${id_actividad} no encontrada`);
  }

  // Verificar si la relación ya existe
  const existerelacion = await prisma.Usuario_Actividad.findUnique({
    where: {
      rut_usuario_id_actividad: {
        rut_usuario,
        id_actividad
      }
    }
  });

  if (existerelacion) {
    return existerelacion; // Ya existe
  }

  // Crear la relación vacía
  return await prisma.Usuario_Actividad.create({
    data: {
      rut_usuario,
      id_actividad,
      dias: [] // Sin días asignados
    }
  });
}

// Eliminar relación usuario-actividad
async function eliminarActividadUsuario(rut_usuario, id_actividad) {
  return await prisma.Usuario_Actividad.delete({
    where: {
      rut_usuario_id_actividad: {
        rut_usuario,
        id_actividad
      }
    }
  });
}

// Obtener actividades asociadas a un usuario usando la relación de modelo Usuario
async function obtenerActividadesUsuario(rut_usuario) {
  const usuario = await prisma.usuario.findUnique({
    where: { rut: rut_usuario },
    include: {
      actividades: {
        include: {
          actividad: true
        }
      }
    }
  });

  if (!usuario) {
    throw new Error(`Usuario con rut ${rut_usuario} no encontrado`);
  }

  return usuario.actividades;
}

// Modificar el día de una actividad asociada a un usuario
async function modifDiaActividadUsuario(rut_usuario, id_actividad, nuevoDia) {
  // Validar existencia de usuario
  const usuario = await prisma.usuario.findUnique({
    where: { rut: rut_usuario }
  });
  if (!usuario) {
    throw new Error(`Usuario con rut ${rut_usuario} no encontrado`);
  }

  // 1. Buscar todas las relaciones del usuario
  const relaciones = await prisma.Usuario_Actividad.findMany({
    where: { rut_usuario }
  });

  // 2. Quitar el día de cualquier otra relación que lo tenga (excepto la actual)
  for (const rel of relaciones) {
    if (
      rel.id_actividad !== id_actividad &&
      rel.dias.includes(nuevoDia)
    ) {
      const nuevosDias = rel.dias.filter((dia) => dia !== nuevoDia);
      await prisma.Usuario_Actividad.update({
        where: {
          rut_usuario_id_actividad: {
            rut_usuario,
            id_actividad: rel.id_actividad
          }
        },
        data: { dias: nuevosDias }
      });
    }
  }

  // 3. Agregar el día a la relación actual si no lo tiene aún
  const relacionActual = relaciones.find(
    (rel) => rel.id_actividad === id_actividad
  );

  if (relacionActual && !relacionActual.dias.includes(nuevoDia)) {
    const nuevosDias = [...relacionActual.dias, nuevoDia];
    await prisma.Usuario_Actividad.update({
      where: {
        rut_usuario_id_actividad: {
          rut_usuario,
          id_actividad
        }
      },
      data: { dias: nuevosDias }
    });
  }

  // 4. Devolver todas las relaciones actualizadas del usuario con actividad incluida
  return await prisma.Usuario_Actividad.findMany({
    where: { rut_usuario },
    include: { actividad: true }
  });
}

module.exports = {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividadesUsuario,
  asociarActividadUsuario,
  eliminarActividadUsuario,
  obtenerActividadesUsuario,
  modifDiaActividadUsuario
};
