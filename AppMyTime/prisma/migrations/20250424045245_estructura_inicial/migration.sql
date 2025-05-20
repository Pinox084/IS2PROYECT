-- CreateTable
CREATE TABLE "Usuario" (
    "rut" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("rut")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id_ubi" SERIAL NOT NULL,
    "ciudad" VARCHAR(50) NOT NULL,
    "region" VARCHAR(50),
    "pais" VARCHAR(50) NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id_ubi")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id_actividad" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "Perfil_Actividad" (
    "id_perfil" SERIAL NOT NULL,
    "rut_usuario" TEXT NOT NULL,
    "id_actividad" INTEGER NOT NULL,
    "temp_min" DOUBLE PRECISION NOT NULL,
    "temp_max" DOUBLE PRECISION NOT NULL,
    "viento_max" DOUBLE PRECISION NOT NULL,
    "rayo_uv_max" DOUBLE PRECISION NOT NULL,
    "lluvia" BOOLEAN NOT NULL,
    "max_precipitaciones" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Perfil_Actividad_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "Condiciones_Climaticas" (
    "id_condicion" SERIAL NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "viento" DOUBLE PRECISION NOT NULL,
    "rayo_uv" DOUBLE PRECISION NOT NULL,
    "lluvia" DOUBLE PRECISION NOT NULL,
    "id_ubi" INTEGER NOT NULL,

    CONSTRAINT "Condiciones_Climaticas_pkey" PRIMARY KEY ("id_condicion")
);

-- CreateTable
CREATE TABLE "Fecha" (
    "id_fecha" SERIAL NOT NULL,
    "dia" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,

    CONSTRAINT "Fecha_pkey" PRIMARY KEY ("id_fecha")
);

-- CreateTable
CREATE TABLE "Recomendacion" (
    "id_recomendacion" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "id_perfil" INTEGER NOT NULL,
    "id_condicion" INTEGER NOT NULL,
    "id_fecha" INTEGER NOT NULL,

    CONSTRAINT "Recomendacion_pkey" PRIMARY KEY ("id_recomendacion")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id_alerta" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,
    "id_perfil" INTEGER NOT NULL,
    "id_condicion" INTEGER NOT NULL,
    "id_fecha" INTEGER NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id_alerta")
);

-- CreateTable
CREATE TABLE "Relacion_PerfilCondicion" (
    "id_perfil" INTEGER NOT NULL,
    "id_condicion" INTEGER NOT NULL,

    CONSTRAINT "Relacion_PerfilCondicion_pkey" PRIMARY KEY ("id_perfil","id_condicion")
);

-- CreateTable
CREATE TABLE "Usuario_Actividad" (
    "rut_usuario" TEXT NOT NULL,
    "id_actividad" INTEGER NOT NULL,

    CONSTRAINT "Usuario_Actividad_pkey" PRIMARY KEY ("rut_usuario","id_actividad")
);

-- CreateTable
CREATE TABLE "Usuario_Ubicacion" (
    "rut_usuario" TEXT NOT NULL,
    "id_ubi" INTEGER NOT NULL,

    CONSTRAINT "Usuario_Ubicacion_pkey" PRIMARY KEY ("rut_usuario")
);

-- AddForeignKey
ALTER TABLE "Perfil_Actividad" ADD CONSTRAINT "Perfil_Actividad_rut_usuario_fkey" FOREIGN KEY ("rut_usuario") REFERENCES "Usuario"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfil_Actividad" ADD CONSTRAINT "Perfil_Actividad_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "Actividad"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condiciones_Climaticas" ADD CONSTRAINT "Condiciones_Climaticas_id_ubi_fkey" FOREIGN KEY ("id_ubi") REFERENCES "Ubicacion"("id_ubi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recomendacion" ADD CONSTRAINT "Recomendacion_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfil_Actividad"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recomendacion" ADD CONSTRAINT "Recomendacion_id_condicion_fkey" FOREIGN KEY ("id_condicion") REFERENCES "Condiciones_Climaticas"("id_condicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recomendacion" ADD CONSTRAINT "Recomendacion_id_fecha_fkey" FOREIGN KEY ("id_fecha") REFERENCES "Fecha"("id_fecha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfil_Actividad"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_id_condicion_fkey" FOREIGN KEY ("id_condicion") REFERENCES "Condiciones_Climaticas"("id_condicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_id_fecha_fkey" FOREIGN KEY ("id_fecha") REFERENCES "Fecha"("id_fecha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relacion_PerfilCondicion" ADD CONSTRAINT "Relacion_PerfilCondicion_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfil_Actividad"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relacion_PerfilCondicion" ADD CONSTRAINT "Relacion_PerfilCondicion_id_condicion_fkey" FOREIGN KEY ("id_condicion") REFERENCES "Condiciones_Climaticas"("id_condicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Actividad" ADD CONSTRAINT "Usuario_Actividad_rut_usuario_fkey" FOREIGN KEY ("rut_usuario") REFERENCES "Usuario"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Actividad" ADD CONSTRAINT "Usuario_Actividad_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "Actividad"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Ubicacion" ADD CONSTRAINT "Usuario_Ubicacion_rut_usuario_fkey" FOREIGN KEY ("rut_usuario") REFERENCES "Usuario"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario_Ubicacion" ADD CONSTRAINT "Usuario_Ubicacion_id_ubi_fkey" FOREIGN KEY ("id_ubi") REFERENCES "Ubicacion"("id_ubi") ON DELETE RESTRICT ON UPDATE CASCADE;
