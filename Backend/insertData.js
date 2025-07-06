const prisma = require('./prismaClient');


async function insertarUsuario({ rut, email, nombres, apellidos, telefono }) {
  return await prisma.usuario.create({
    data: { rut, email, nombres, apellidos, telefono }
  });
}


async function insertarActividad({ nombre, categoria_id }) {
  return await prisma.actividad.create({
    data: {
      nombre,
      categoria_id
    }
  });
}


module.exports = {
  insertarUsuario,
  insertarActividad,
};

