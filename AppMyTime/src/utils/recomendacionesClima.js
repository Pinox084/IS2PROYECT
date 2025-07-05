export const generarRecomendacionExtendida = ({ condition, temp, wind, humidity, precipitation }) => {
  const t = parseInt(temp);
  const v = wind * 3.6;
  const cond = condition?.toLowerCase() || '';

  if (cond.includes('tormenta')) return '⚡ Tormentas activas: quédate bajo techo y desconecta equipos eléctricos.';
  if (cond.includes('nieve')) return '❄️ Nieve en el ambiente: abrigo completo y precaución al circular.';
  if (cond.includes('lluvia') || precipitation > 0.5) {
    if (t < 8) return '🌧️ Lluvia con frío: impermeable y capas de abrigo recomendadas.';
    return '☔ Lleva paraguas y evita estar al aire libre por mucho tiempo.';
  }
  if (cond.includes('niebla')) return '🌫️ Visibilidad reducida: si conduces, enciende luces bajas y ve con calma.';
  if (v > 35) return '💨 Viento fuerte: asegúrate de que objetos livianos estén protegidos.';
  if (t > 33) return '🔥 Calor extremo: hidrátate y evita exposición prolongada al sol.';
  if (t >= 26) return '☀️ Día caluroso: usa protector solar, lentes y mantente hidratado.';
  if (t >= 18) return '⛅ Clima templado: ideal para actividades al aire libre.';
  if (t >= 10) return '🧥 Día fresco: lleva abrigo liviano por precaución.';
  if (t >= 5) return '🧣 Frío moderado: chaqueta gruesa y gorro recomendados.';
  return '🥶 Frío intenso: limita tu tiempo fuera y abrígate en capas.';
};

