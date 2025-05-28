const { insertarActividad } = require('./insertData');
const prisma = require('./prismaClient');


const actividades = [
    'Correr',
    'Lectura al Aire Libre',
    'Yoga',
    'Caminar',
    'Shopping',
    'Pescar',
    'Ciclismo',
    'Futbol',
    'Fotografía',
    'Natación'
];
async function main() {
    try {
        for (const nombre of actividades) {
            try {
                const actividad = await insertarActividad({ nombre });
                console.log('Actividad insertada:', actividad);
            } catch (error) {
                console.error(`Error al insertar la actividad "${nombre}":`, error);
            }
        }
    } catch (error) {
        console.error('Error en la inserción de actividades:', error);
    } finally {
        await prisma.$disconnect();
    }
}


main();
