// utils/actividadesConEmoji.js
export const getEmojiActividad = (nombre) => {
  const lower = nombre.toLowerCase();
  if (lower.includes('correr')) return '🏃‍♂️';
  if (lower.includes('lectura')) return '📖';
  if (lower.includes('yoga')) return '🧘';
  if (lower.includes('caminar')) return '🚶';
  if (lower.includes('shopping')) return '🛍️';
  if (lower.includes('pescar')) return '🎣';
  if (lower.includes('ciclismo')) return '🚴';
  if (lower.includes('futbol')) return '⚽';
  if (lower.includes('foto') || lower.includes('fotografía')) return '📸';
  if (lower.includes('natación')) return '🏊';
  if (lower.includes('surf')) return '🏄';
  if (lower.includes('senderismo')) return '🥾';
  if (lower.includes('jardinería')) return '🌿';
  if (lower.includes('picnic')) return '🧺';
  if (lower.includes('meditación')) return '🧘‍♂️';
  if (lower.includes('dibujo')) return '🎨';
  if (lower.includes('cine')) return '🎬';
  if (lower.includes('estudio')) return '📚';
  if (lower.includes('trabajo')) return '💻';
  if (lower.includes('descanso')) return '🛌';
  if (lower.includes('limpieza')) return '🧹';
  if (lower.includes('pelicula')) return '📺';
  if (lower.includes('clases')) return '👨‍🏫';
  return '✨';
};
