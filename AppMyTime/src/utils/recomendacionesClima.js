export const generarRecomendacionExtendida = ({ condition, description, temp, wind, humidity, precipitation }) => {
  const t = parseInt(temp);
  const v = wind * 3.6;
  const h = humidity;
  const p = precipitation;
  const desc = description?.toLowerCase() || '';

  // Reglas por condiciones extremas primero
  if (t <= -5) {
    return '🥶 Frío extremo: evita salir si no es necesario y mantente abrigado en ambientes calefaccionados.';
  }

  if (t < 2 && h > 85) {
    return '🧊 Frío y humedad elevada: la sensación térmica puede ser muy baja. Mejor quedarse en interiores.';
  }

  if (t < 5 && v > 30) {
    return '🌬️ Frío y viento: condiciones muy incómodas para estar al aire libre. Evita exposición prolongada.';
  }

  if (t < 10 && p > 0) {
    return '🌧️ Lluvia con frío: no es recomendable permanecer afuera sin abrigo y protección.';
  }

  if (t < 10 && desc.includes('cielo claro')) {
    return '❄️ Cielo despejado pero con mucho frío: si sales, hazlo con varias capas de abrigo.';
  }

  if (t >= 35 && h > 70) {
    return '🔥 Calor húmedo extremo: evita esfuerzos físicos intensos y permanece en lugares ventilados.';
  }

  if (t >= 30 && v < 10 && h > 80) {
    return '🌡️ Calor pesado y sin viento: puede sentirse sofocante. Mantente hidratado y descansa a la sombra.';
  }

  if (t >= 25 && h > 90) {
    return '🌡️ Mucha humedad y calor: sensación térmica elevada, mantente hidratado y en lugares frescos.';
  }

  if (v > 60) {
    return '🌪️ Viento extremo: riesgo de voladuras y ramas caídas. No se recomienda salir.';
  }

  if (v > 45) {
    return '🌬️ Viento muy fuerte: limita tu exposición al aire libre. Atención a objetos sueltos o techumbres.';
  }

  if (v > 30) {
    return '💨 Viento fuerte: puede dificultar actividades al aire libre. Abrígate si hay sensación térmica baja.';
  }

  // Reglas por combinación de clima y viento
  if (desc.includes('lluvia ligera') && v > 25) {
    return '🌧️ Lluvia ligera con viento fuerte: no es recomendable usar paraguas. Usa impermeable y abrigo adecuado si debes salir.';
  }

  if (desc.includes('llovizna') && v > 25) {
    return '🌦️ Llovizna con viento: lleva chaqueta impermeable en lugar de paraguas para evitar molestias.';
  }

  // Reglas por descripción textual del clima
  if (desc.includes('tormenta eléctrica')) {
    return '⚡ Tormenta eléctrica: mejor mantenerse bajo techo y evitar salir a la intemperie.';
  }

  if (desc.includes('tormenta') || desc.includes('chubascos fuertes')) {
    return '⛈️ Tormenta o chubascos intensos: precaución extrema si sales. Mejor quedarse en un lugar seguro.';
  }

  if (desc.includes('granizo')) {
    return '🌨️ Posible caída de granizo: evita estar al aire libre si no es estrictamente necesario.';
  }

  if (desc.includes('nieve ligera')) {
    return '❄️ Nieve ligera: si necesitas salir, usa calzado antideslizante y abrigo adecuado.';
  }

  if (desc.includes('nieve moderada') || desc.includes('nevando')) {
    return '❄️ Nevando: mantente abrigado y evita circular por zonas resbalosas si no es necesario.';
  }

  if (desc.includes('lluvia intensa')) {
    return '🌧️ Lluvia intensa: condiciones adversas para estar afuera. Mejor no salir.';
  }

  if (desc.includes('lluvia ligera')) {
    return '🌦️ Lluvia ligera: puedes salir, pero lleva paraguas por si acaso.';
  }

  if (desc.includes('lluvia moderada')) {
    return '🌧️ Lluvia moderada: evita actividades prolongadas al aire libre sin protección.';
  }

  if (desc.includes('llovizna') || desc.includes('precipitaciones débiles')) {
    return '🌦️ Llovizna: ambiente húmedo pero tolerable. Ideal para actividades suaves con abrigo liviano.';
  }

  if (desc.includes('nubes dispersas')) {
    return '⛅ Nubes dispersas: ideal para estar al aire libre con luz suave y agradable.';
  }

  if (desc.includes('algo nublado')) {
    return '🌤️ Algo nublado: clima cómodo y tranquilo para estar al aire libre.';
  }

  if (desc.includes('nublado') || desc.includes('muy nublado') || desc.includes('cubierto')) {
    return '☁️ Cielo nublado: el ambiente puede sentirse más fresco, ideal para actividades sin sol directo.';
  }

  if (desc.includes('cielo claro')) {
    return '☀️ Cielo claro: excelente momento para estar al aire libre. Usa protección solar si es de día.';
  }

  if (desc.includes('niebla') || desc.includes('neblina')) {
    return '🌫️ Niebla o neblina: visibilidad reducida. Evita manejar o andar en bicicleta si no es necesario.';
  }

  if (desc.includes('polvo') || desc.includes('arena')) {
    return '🌪️ Polvo o arena en el aire: usa mascarilla si vas a estar en exteriores y protege tus ojos.';
  }

  if (desc.includes('viento con polvo')) {
    return '🌬️ Viento con polvo: limita tu exposición al aire libre y cierra ventanas en interiores.';
  }

  // Reglas por condiciones cómodas
  if (t >= 18 && t < 28 && h < 80 && v < 25) {
    return '🌤️ Clima templado y seco: condiciones óptimas para cualquier tipo de actividad.';
  }

  if (t >= 10 && t < 18) {
    if (v > 25) {
      return '🧥 Día fresco con viento: lleva cortaviento si vas a estar mucho rato afuera.';
    }
    return '🧥 Día fresco: cómodo con abrigo ligero. Perfecto para caminar o pasear.';
  }

  if (t >= 5 && t < 10) {
    return '🧣 Hace frío: abrígate bien si vas a salir, especialmente en zonas abiertas o con sombra.';
  }

  if (h > 90 && t < 5) {
    return '🥶 Frío y humedad alta: el ambiente se siente muy crudo. Mejor quedarse en lugares calefaccionados.';
  }

  return '🌡️ Clima frío: si sales, hazlo bien abrigado y con precaución.';
};
