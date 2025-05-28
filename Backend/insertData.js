
import prisma from './prismaClient.js';


export async function insertarUsuario({ rut, email, nombres, apellidos, telefono }) {
  return await prisma.usuario.create({
    data: { rut, email, nombres, apellidos, telefono }
  });
}


export async function insertarActividad({ nombre }) {
  return await prisma.actividad.create({
    data: { nombre }
  });
}

