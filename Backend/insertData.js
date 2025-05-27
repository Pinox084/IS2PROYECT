// src/server/insertData.js
import prisma from './prismaClient.js';

// Ejemplo: insertar un usuario
export async function insertarUsuario({ rut, email, nombres, apellidos, telefono }) {
  return await prisma.usuario.create({
    data: { rut, email, nombres, apellidos, telefono }
  });
}

// Ejemplo: insertar una actividad
export async function insertarActividad({ nombre }) {
  return await prisma.actividad.create({
    data: { nombre }
  });
}

// Puedes agregar más funciones según tus necesidades para otros modelos

// Para probar desde Node.js:
// (async () => {
//   await insertarUsuario({ rut: '12345678-9', email: 'test@mail.com', nombres: 'Juan', apellidos: 'Pérez', telefono: '123456789' });
//   await insertarActividad({ nombre: 'Correr' });
//   await prisma.$disconnect();
// })();
