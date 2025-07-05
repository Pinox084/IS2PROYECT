export const generarRecomendacionExtendida = ({ condition, description, temp, wind, humidity, precipitation }) => {
  const t = parseInt(temp);
  const v = wind * 3.6;
  const h = humidity;
  const p = precipitation;
  const cond = condition?.toLowerCase() || '';
  const desc = description?.toLowerCase() || '';

  if (desc.includes('tormenta')) {
    return '⚡ Hay tormentas activas: lo mejor es quedarse en casa y evitar riesgos eléctricos o caídas de ramas.';
  }

  if (desc.includes('nieve')) {
    return '❄️ Está nevando: si necesitas salir, usa ropa térmica y cuidado con superficies resbalosas.';
  }

  if (desc.includes('lluvia ligera')) {
    return '🌦️ Hay lluvia ligera: puedes salir, pero lleva paraguas por si acaso y evita ropa que se empape fácil.';
  }

  if (desc.includes('lluvia moderada') || (cond.includes('lluvia') && p > 0.5)) {
    if (t < 8) {
      return '🌧️ Lluvia moderada con frío: abrígate bien y usa ropa impermeable.';
    }
    if (h > 85) {
      return '☔ Lluvia y humedad alta: puede sentirse pegajoso. Usa ropa fresca e impermeable.';
    }
    return '☔ Lluvia moderada: si vas a salir, no olvides paraguas o impermeable.';
  }

  if (desc.includes('llovizna')) {
    return '🌦️ Llovizna ocasional: clima algo húmedo pero tolerable, ideal para paseos cortos o actividades suaves.';
  }

  if (desc.includes('cielo claro')) {
    return '☀️ Cielo despejado: aprovecha para hacer actividades al aire libre sin preocupaciones.';
  }

  if (desc.includes('nubes dispersas') || desc.includes('algo nublado')) {
    return '⛅ Cielo parcialmente nublado: ideal para caminar o disfrutar actividades con luz suave.';
  }

  if (desc.includes('nublado') || cond.includes('nubes')) {
    return '🌥️ Está nublado: no hay sol directo, pero puede sentirse más fresco. Perfecto para moverse con comodidad.';
  }

  if (desc.includes('niebla') || cond.includes('niebla')) {
    return '🌫️ Hay niebla: evita conducir si no es necesario y mantén buena visibilidad si lo haces.';
  }

  if (v > 40) {
    return '🌬️ Viento muy fuerte: evita actividades al aire libre que puedan ser riesgosas.';
  }

  if (v > 30) {
    return '💨 Viento fuerte: sujeta bien objetos livianos y ten precaución si estás al aire libre.';
  }

  if (h > 90 && t >= 25) {
    return '🌡️ Mucha humedad y calor: evita esfuerzos físicos intensos y mantente bien hidratado.';
  }

  if (t > 35) {
    return '🔥 Calor extremo: busca sombra, usa gorro y protector solar, y bebe agua con frecuencia.';
  }

  if (t >= 28) {
    return '☀️ Día muy caluroso: ideal para actividades suaves, pero evita exponerte mucho tiempo al sol.';
  }

  if (t >= 18 && t < 28 && h < 80 && v < 25) {
    return '⛅ Clima templado y cómodo: excelente para cualquier actividad al aire libre.';
  }

  if (t >= 10 && t < 18) {
    if (v > 25) {
      return '🧥 Día fresco con viento: lleva una chaqueta cortaviento si sales.';
    }
    return '🧥 Día fresco: una chaqueta liviana basta si estarás al aire libre.';
  }

  if (t >= 5 && t < 10) {
    return '🧣 Hace frío: abrígate bien si vas a salir, especialmente en zonas con sombra o viento.';
  }

  if (h > 90 && t < 5) {
    return '🥶 Frío y humedad alta: el aire se siente muy crudo. Mejor permanecer en espacios calefaccionados.';
  }

  return '🥶 Frío intenso: lo mejor es mantenerse abrigado dentro de casa y evitar exposición prolongada.';
};
