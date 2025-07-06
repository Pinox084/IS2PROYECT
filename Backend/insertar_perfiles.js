
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const perfiles = require('./perfiles_generados');

async function main() {
  for (const perfil of perfiles) {
    await prisma.perfil_Actividad.create({
      data: perfil
    });
  }
  console.log("Perfiles insertados correctamente.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
