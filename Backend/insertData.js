const prisma = require('./prismaClient');


async function insertarUsuario({ rut, email, nombres, apellidos, telefono }) {
  return await prisma.usuario.create({
    data: { rut, email, nombres, apellidos, telefono }
  });
}


async function insertarActividad({ nombre }) {
  return await prisma.actividad.create({
    data: { nombre }
  });
}


module.exports = {
  insertarUsuario,
  insertarActividad
};

