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
  await prisma.perfil_Actividad.deleteMany({
    where: {
      rut_usuario,
    }
  });
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

  if (!usuario) return [];

  return usuario.actividades.map((relacion) => ({
    nombre: relacion.actividad.nombre,
    dia: relacion.dias || []
  }));
}

// Modificar el día de una actividad asociada a un usuario
//CHECAR PORQUE NO FUNCIONA EL QUE QUITAR UN DIA DE LA ACTIVIDAD FUNCIONE 
async function modifDiaActividadUsuario(rut_usuario, id_actividad, nuevoDia) {
  try {
    id_actividad = parseInt(id_actividad);

    const usuario = await prisma.usuario.findUnique({ where: { rut: rut_usuario } });
    if (!usuario) throw new Error(`Usuario con rut ${rut_usuario} no encontrado`);

    const relaciones = await prisma.Usuario_Actividad.findMany({ where: { rut_usuario } });

    for (const rel of relaciones) {
      const yaTieneDia = Array.isArray(rel.dias) && rel.dias.includes(nuevoDia);
      const esLaRelacionActual = rel.id_actividad === id_actividad;

      if (yaTieneDia && !esLaRelacionActual) {
        // Quitar el día de otras actividades si ya lo tienen
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

    const relacionActual = await prisma.Usuario_Actividad.findUnique({
      where: {
        rut_usuario_id_actividad: {
          rut_usuario,
          id_actividad
        }
      }
    });

    if (!relacionActual) throw new Error('La relación usuario-actividad no existe');

    if (Array.isArray(relacionActual.dias) && relacionActual.dias.includes(nuevoDia)) {
      // Si la actividad ya tiene el día, se lo quitamos
      const nuevosDias = relacionActual.dias.filter((dia) => dia !== nuevoDia);
      await prisma.Usuario_Actividad.update({
        where: {
          rut_usuario_id_actividad: {
            rut_usuario,
            id_actividad
          }
        },
        data: { dias: nuevosDias }
      });
    } else {
      // Si no lo tiene, se lo agregamos
      const nuevosDias = [...(relacionActual.dias || []), nuevoDia];
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

    return await prisma.Usuario_Actividad.findMany({
      where: { rut_usuario },
      include: { actividad: true }
    });

  } catch (error) {
    console.error("Error en modifDiaActividadUsuario:", error);
    throw error;
  }
}
async function obtenerClimas() {

  return await prisma.Clima.findMany();
}

async function obtenerPerfilesUsuario(rut_usuario) {
  // Paso 1: obtener todas las actividades del usuario
  const actividadesUsuario = await prisma.usuario_Actividad.findMany({
    where: { rut_usuario },
    select: { id_actividad: true }
  });

  const perfiles = [];

  for (const { id_actividad } of actividadesUsuario) {
    // Paso 2: intentar obtener perfil personalizado
    let perfil = await prisma.perfil_Actividad.findFirst({
      where: {
        rut_usuario,
        id_actividad
      },
      include: {
        actividad: true,
        climas: true,
        recomendaciones: true,
        alertas: true
      }
    });

    // Paso 3: si no tiene perfil personal, usar el predeterminado
    if (!perfil) {
      perfil = await prisma.perfil_Actividad.findFirst({
        where: {
          rut_usuario: null,
          id_actividad
        },
        include: {
          actividad: true,
          climas: true,
          recomendaciones: true,
          alertas: true
        }
      });
    }

    if (perfil) {
      perfiles.push(perfil);
    }
  }

  return perfiles;
}

async function eliminarPerfilUsuario(rut_usuario, id_actividad, id_perfil){
  
  const perfil = await prisma.perfil_Actividad.findUnique({
    where: { id_perfil }
  });

  if (!perfil) {
    throw new Error('Perfil no encontrado');
  }

  if (perfil.rut_usuario === null) {
    // Es un perfil predeterminado, no se elimina
    return;
  }

  if (perfil.rut_usuario === rut_usuario) {
    await prisma.perfil_Actividad.delete({
      where: { id_perfil }
    });
  }
}


async function editarPerfilUsuario(rut_usuario, id_actividad, perfilData) {
  const perfil_Existente = await prisma.perfil_Actividad.findFirst({
    where: {
      rut_usuario,
      id_actividad
    }
  });

  // Manejar relación con climas
  const climasNombres = perfilData.climas || [];
  const climasConnect = [];

  for (let i = 0; i < climasNombres.length; i++) {
    const nombre = climasNombres[i];
    const climaExistente = await prisma.clima.findFirst({
      where: { nombre_clima: nombre }
    });

    if (!climaExistente) {
      throw new Error(`Clima '${nombre}' no encontrado`);
    }

    climasConnect.push({ id_clim: climaExistente.id_clim });
  }

  // Remueve el arreglo de climas del objeto principal
  delete perfilData.climas;

  if (perfil_Existente) {
    // Primero desvincula climas antiguos
    await prisma.perfil_Actividad.update({
      where: {
        id_perfil: perfil_Existente.id_perfil
      },
      data: {
        climas: { set: [] } // limpia la relación actual
      }
    });

    // Luego actualiza perfil y reasocia climas
    await prisma.perfil_Actividad.update({
      where: {
        id_perfil: perfil_Existente.id_perfil
      },
      data: {
        ...perfilData,
        climas: {
          connect: climasConnect
        }
      }
    });

  } else {
    // Crear nuevo perfil con asociación a climas
    await prisma.perfil_Actividad.create({
      data: {
        rut_usuario,
        id_actividad,
        ...perfilData,
        climas: {
          connect: climasConnect
        }
      }
    });
  }
}

module.exports = {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividadesUsuario,
  asociarActividadUsuario,
  eliminarActividadUsuario,
  obtenerActividadesUsuario,
  modifDiaActividadUsuario,
  obtenerClimas,
  obtenerPerfilesUsuario,
  eliminarPerfilUsuario,
  editarPerfilUsuario
};
