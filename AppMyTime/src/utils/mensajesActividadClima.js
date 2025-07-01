export function esClimaCompatible(nombre, weather) {
  const sensacion = parseFloat(weather.feels_like);
  const viento = weather.wind * 3.6;
  const lluvia = weather.precipitation > 0;
  const cond = weather.condition?.toLowerCase() || '';
  const nombreLower = nombre.toLowerCase();

  if (nombreLower.includes('correr') && !lluvia && sensacion >= 6 && sensacion <= 25 && viento < 25) return true;
  if (nombreLower.includes('lectura al aire') && !lluvia && (cond.includes('despejado') || cond.includes('nublado')) && sensacion >= 10) return true;
  if (nombreLower.includes('yoga') || nombreLower.includes('meditación') || nombreLower.includes('trabajo') || nombreLower.includes('clases') || nombreLower.includes('estudio') || nombreLower.includes('descanso') || nombreLower.includes('limpieza') || nombreLower.includes('lectura en casa') || nombreLower.includes('pelicula')) return true;
  if (nombreLower.includes('caminar') && !lluvia && sensacion > 8) return true;
  if (nombreLower.includes('shopping') && (lluvia || viento > 30 || sensacion < 10)) return true;
  if (nombreLower.includes('pescar') && !lluvia && viento < 25) return true;
  if (nombreLower.includes('ciclismo') && !lluvia && viento < 20 && sensacion >= 12) return true;
  if (nombreLower.includes('futbol') && !lluvia && sensacion >= 10) return true;
  if (nombreLower.includes('foto') || nombreLower.includes('fotografía')) {
    if (!lluvia && !cond.includes('niebla')) return true;
  }
  if (nombreLower.includes('natación') && sensacion > 22 && !lluvia) return true;
  if (nombreLower.includes('surf') && sensacion > 20 && !cond.includes('tormenta')) return true;
  if (nombreLower.includes('senderismo') && !lluvia && viento < 20 && sensacion > 10) return true;
  if (nombreLower.includes('jardinería') && !lluvia && !cond.includes('nieve')) return true;
  if (nombreLower.includes('picnic') && !lluvia && sensacion > 15) return true;
  if (nombreLower.includes('dibujo') && !lluvia && !cond.includes('niebla')) return true;
  if (nombreLower.includes('cine')) return true;

  return false;
}

export function generarMensajeActividadClima(nombreActividad, weather) {
  const compatible = esClimaCompatible(nombreActividad, weather);
  const nombreLower = nombreActividad.toLowerCase();

  if (!compatible) {
    if (nombreLower.includes('correr')) return '❌ Evita correr hoy, el clima no es favorable (lluvia, frío o mucho viento).';
    if (nombreLower.includes('lectura al aire')) return '📚 No se recomienda leer al aire libre con este clima.';
    if (nombreLower.includes('caminar')) return '🚫 Hoy no es ideal para caminar, podría estar lluvioso o incómodo.';
    if (nombreLower.includes('shopping')) return '🏬 No es necesario salir hoy, espera un clima más extremo para aprovechar shopping.';
    if (nombreLower.includes('pescar')) return '🎣 Las condiciones no son seguras para pescar.';
    if (nombreLower.includes('ciclismo')) return '🚳 Evita salir en bicicleta, el clima puede ser riesgoso.';
    if (nombreLower.includes('futbol')) return '⚠️ El clima no permite jugar fútbol cómodamente.';
    if (nombreLower.includes('foto') || nombreLower.includes('fotografía')) return '📵 Hoy no es buen día para fotografías al aire libre.';
    if (nombreLower.includes('natación')) return '💧 No se recomienda nadar hoy debido al clima frío o lluvioso.';
    if (nombreLower.includes('surf')) return '🌊 Mejor evita el surf hoy, podría haber condiciones peligrosas.';
    if (nombreLower.includes('senderismo')) return '🥾 No se recomienda hacer senderismo con este clima.';
    if (nombreLower.includes('jardinería')) return '🌧️ Jardinería no es conveniente hoy por el clima.';
    if (nombreLower.includes('picnic')) return '🧺 Mejor posponer el picnic para otro día con mejor tiempo.';
    if (nombreLower.includes('dibujo')) return '🎨 El clima no es propicio para dibujar al aire libre.';

    // Para actividades de interior no compatibles, aunque es raro, damos genérico
    return `⚠️ Hoy no se recomienda realizar "${nombreActividad}" debido a las condiciones climáticas.`;
  }

  // Mensajes positivos
  if (nombreLower.includes('correr')) return '🏃‍♂️ Ideal para salir a correr. ¡Aprovecha el buen clima!';
  if (nombreLower.includes('lectura al aire')) return '📖 Buen clima para una lectura al aire libre. ¡Lleva tu libro favorito!';
  if (nombreLower.includes('yoga')) return '🧘 Un día perfecto para practicar yoga y relajarte.';
  if (nombreLower.includes('caminar')) return '🚶 Buen clima para salir a caminar. ¡Disfruta del paseo!';
  if (nombreLower.includes('shopping')) return '🛍️ Perfecto para hacer compras sin preocuparse por el clima.';
  if (nombreLower.includes('pescar')) return '🎣 Condiciones aptas para una buena jornada de pesca.';
  if (nombreLower.includes('ciclismo')) return '🚴 ¡Buen momento para pedalear!';
  if (nombreLower.includes('futbol')) return '⚽ Puedes jugar fútbol en este horario sin problemas.';
  if (nombreLower.includes('foto') || nombreLower.includes('fotografía')) return '📸 ¡Buena luz para tomar fotografías!';
  if (nombreLower.includes('natación')) return '🏊‍♂️ Día caluroso, ideal para nadar.';
  if (nombreLower.includes('surf')) return '🏄 Buenas condiciones para surfear.';
  if (nombreLower.includes('senderismo')) return '🥾 Disfruta una caminata en la naturaleza.';
  if (nombreLower.includes('jardinería')) return '🌱 Puedes cuidar tu jardín con tranquilidad.';
  if (nombreLower.includes('picnic')) return '🧺 ¡Ideal para un picnic al aire libre!';
  if (nombreLower.includes('meditación')) return '🧘 Respira profundo. Buen día para meditar.';
  if (nombreLower.includes('dibujo')) return '🎨 Perfecto para inspirarte y dibujar al aire libre.';
  if (nombreLower.includes('cine')) return '🎬 Buen día para ver una película en el cine.';
  if (nombreLower.includes('estudio')) return '📚 Condiciones ideales para concentrarte en tus estudios.';
  if (nombreLower.includes('trabajo')) return '💻 Trabaja desde casa sin interrupciones climáticas.';
  if (nombreLower.includes('descanso')) return '🛌 Día tranquilo para descansar.';
  if (nombreLower.includes('limpieza')) return '🧹 Puedes aprovechar de limpiar la casa.';
  if (nombreLower.includes('lectura en casa')) return '📘 Tarde perfecta para leer en casa.';
  if (nombreLower.includes('pelicula')) return '📺 Ideal para una película en casa.';
  if (nombreLower.includes('clases')) return '📖 El clima no interfiere con tus clases. ¡A estudiar!';

  return `✅ Puedes realizar "${nombreActividad}" con tranquilidad.`;
}

