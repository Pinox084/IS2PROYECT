const { insertarActividad } = require('./insertData');
const prisma = require('./prismaClient');

// Asume que Indoor tiene id_categoria = 1 y Outdoor = 2
const CATEGORIA_INDOOR = 1;
const CATEGORIA_OUTDOOR = 2;

const actividades = [
    { nombre: 'Correr', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Lectura al Aire Libre', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Yoga', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Caminar', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Shopping', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Pescar', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Ciclismo', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Futbol', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Fotografía', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Natación', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Surf', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Senderismo', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Jardinería', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Picnic', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Meditación', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Dibujo al Aire Libre', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Cine', categoria_id: CATEGORIA_OUTDOOR },
    { nombre: 'Estudio', categoria_id: CATEGORIA_INDOOR },
    { nombre: 'Trabajo en Casa', categoria_id: CATEGORIA_INDOOR },
    { nombre: 'Descanso', categoria_id: CATEGORIA_INDOOR },
    { nombre: 'Limpieza', categoria_id: CATEGORIA_INDOOR },
    { nombre: 'Lectura en Casa', categoria_id: CATEGORIA_INDOOR },
    { nombre: 'Pelicula en Casa', categoria_id: CATEGORIA_INDOOR },
    { nombre: 'Clases', categoria_id: CATEGORIA_INDOOR }
];

async function main() {
    try {
        for (const { nombre, categoria_id } of actividades) {
            try {
                const actividad = await insertarActividad({ nombre, categoria_id });
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

//CREATE USER franco WITH PASSWORD 'jotatongo1745';
//GRANT CONNECT ON DATABASE time_db2 TO franco;
//GRANT USAGE ON SCHEMA public TO franco;
//GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO franco;
//ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO franco;