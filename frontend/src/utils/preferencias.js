// Las preferencias (categorías favoritas) se guardan en el navegador, una lista por cliente
function claveDe(usuarioId) {
  return `preferencias-${usuarioId}`;
}

// Lee las categorías favoritas; si no hay nada (o está dañado), devuelve lista vacía
export function leerPreferencias(usuarioId) {
  try {
    const texto = localStorage.getItem(claveDe(usuarioId));
    return texto ? JSON.parse(texto) : [];
  } catch {
    return [];
  }
}

// Guarda la lista de categorías favoritas
export function guardarPreferencias(usuarioId, categorias) {
  localStorage.setItem(claveDe(usuarioId), JSON.stringify(categorias));
}
