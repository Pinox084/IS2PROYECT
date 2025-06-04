const { insertarUsuario } = require('./insertData');
const prisma = require('./prismaClient');

async function main() {
    try {
        const usuario = await insertarUsuario({
            rut: '12345678-9',
            email: 'prueba@correo.com',
            nombres: 'Usuario',
            apellidos: 'Prueba',
            telefono: '123456789'
        });
        console.log('Usuario insertado:', usuario);
    } catch (error) {
        console.error('Error al insertar usuario:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();