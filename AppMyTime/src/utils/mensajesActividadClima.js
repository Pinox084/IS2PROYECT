function capitalizar(str) {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1);
}

export function esClimaCompatibleConPerfil(perfil, weather) {
  const temp = parseFloat(weather.temp);
  const viento = weather.wind * 3.6;
  const humedad = weather.humidity;
  const precipitacion = weather.precipitation;
  const cond = weather.condition?.toLowerCase() || '';
  const condicionesPermitidas = perfil.climas?.map(c => c.nombre_clima?.toLowerCase()) || [];

  const tempOk = (!perfil.temp_min || temp >= perfil.temp_min) && (!perfil.temp_max || temp <= perfil.temp_max);
  const vientoOk = (!perfil.viento_max || viento <= perfil.viento_max);
  const humedadOk = (!perfil.sense_max || humedad <= perfil.sense_max);
  const precipitacionOk = (!perfil.max_precipitaciones || precipitacion <= perfil.max_precipitaciones);
  const condicionOk = condicionesPermitidas.includes(cond);

  return tempOk && vientoOk && humedadOk && precipitacionOk && condicionOk;
}

export function explicarIncompatibilidadPerfil(perfil, weather, nombreActividad = 'esta actividad') {
  const temp = parseFloat(weather.temp);
  const viento = weather.wind * 3.6;
  const humedad = weather.humidity;
  const precipitacion = weather.precipitation;
  const cond = weather.condition?.toLowerCase() || '';
  const condicionesPermitidas = perfil.climas?.map(c => c.nombre_clima?.toLowerCase()) || [];

  const nombre = capitalizar(nombreActividad);
  const problemas = [];

  if (perfil.temp_min && temp < perfil.temp_min) problemas.push(`la temperatura está más baja de lo ideal (${temp}°C)`);
  if (perfil.temp_max && temp > perfil.temp_max) problemas.push(`hace más calor de lo recomendable (${temp}°C)`);
  if (perfil.viento_max && viento > perfil.viento_max) problemas.push(`hay mucho viento (${viento.toFixed(0)} km/h)`);
  if (perfil.sense_max && humedad > perfil.sense_max) problemas.push(`la humedad es alta (${humedad}%)`);
  if (perfil.max_precipitaciones && precipitacion > perfil.max_precipitaciones) problemas.push(`hay demasiada lluvia (${precipitacion.toFixed(1)} mm/h)`);
  if (condicionesPermitidas.length > 0 && !condicionesPermitidas.includes(cond)) problemas.push(`el clima actual (${weather.condition}) no es adecuado`);

  if (problemas.length === 0) return null;
  if (problemas.length === 1) return `⚠️ No es el mejor momento para ${nombre.toLowerCase()}: ${problemas[0]}.`;
  if (problemas.length === 2) return `⚠️ No se recomienda realizar ${nombre.toLowerCase()} en estas condiciones: ${problemas[0]} y ${problemas[1]}.`;

  const problemaEjemplo = problemas[Math.floor(Math.random() * problemas.length)];
  return `⚠️ Las condiciones no son favorables para ${nombre.toLowerCase()}. Por ejemplo, ${problemaEjemplo}, entre otros factores climáticos.`;
}

export function generarMensajeActividadClima(nombreActividad, weather, perfil) {
  const compatible = esClimaCompatibleConPerfil(perfil, weather);
  const nombre = nombreActividad.toLowerCase();
  const nombreCapitalizado = capitalizar(nombreActividad);

  if (!compatible) {
    return explicarIncompatibilidadPerfil(perfil, weather, nombreCapitalizado);
  }

  if (nombre.includes('correr')) return '🏃‍♂️ Buen momento para salir a correr y activar el cuerpo.';
  if (nombre.includes('lectura al aire')) return '📖 El clima acompaña para disfrutar una lectura tranquila al aire libre.';
  if (nombre.includes('yoga')) return '🧘 Clima ideal para una sesión relajante de yoga.';
  if (nombre.includes('caminar')) return '🚶 Perfecto para una caminata al aire libre sin contratiempos.';
  if (nombre.includes('shopping')) return '🛍️ Puedes salir a hacer compras sin preocuparte por el clima.';
  if (nombre.includes('pescar')) return '🎣 Condiciones agradables para una buena jornada de pesca.';
  if (nombre.includes('ciclismo')) return '🚴 Excelente momento para salir en bicicleta.';
  if (nombre.includes('futbol')) return '⚽ Buenas condiciones para jugar un partido de fútbol.';
  if (nombre.includes('fotograf')) return '📸 Buena luz y clima para sacar fotos espectaculares.';
  if (nombre.includes('nataci')) return '🏊 Hace calor, ideal para nadar y refrescarte.';
  if (nombre.includes('surf')) return '🏄 Buenas condiciones para surfear y disfrutar el mar.';
  if (nombre.includes('senderismo')) return '🥾 Perfecto para salir de excursión y disfrutar la naturaleza.';
  if (nombre.includes('jardiner')) return '🌱 Clima propicio para cuidar tus plantas en el jardín.';
  if (nombre.includes('picnic')) return '🧺 Ideal para un picnic tranquilo al aire libre.';
  if (nombre.includes('meditaci')) return '🧘 Buen momento para meditar y reconectar contigo mismo.';
  if (nombre.includes('dibujo')) return '🎨 Clima agradable para dibujar al aire libre con inspiración.';
  if (nombre.includes('cine')) return '🎬 Buen momento para ir al cine y relajarte un rato.';
  if (nombre.includes('estudio')) return '📚 El ambiente está tranquilo para concentrarte en estudiar.';
  if (nombre.includes('trabajo')) return '💻 Puedes trabajar desde casa con tranquilidad.';
  if (nombre.includes('descanso')) return '🛌 Las condiciones son ideales para descansar un poco.';
  if (nombre.includes('limpieza')) return '🧼 Buen momento para hacer limpieza sin interrupciones.';
  if (nombre.includes('lectura en casa')) return '📘 Ideal para leer en casa con calma.';
  if (nombre.includes('pelicula')) return '📺 Perfecto para ver una película en casa y relajarte.';
  if (nombre.includes('clases')) return '📖 Buen clima para concentrarte en tus clases o tareas.';

  return `✅ Todo está bien para que disfrutes de ${nombreCapitalizado}.`;
}
