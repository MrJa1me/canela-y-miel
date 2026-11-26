// Agrupa una lista en filas de tamaño fijo (para las diapositivas del carrusel).
export function agruparEnFilas(elementos, tamano = 3) {
  const filas = [];
  for (let i = 0; i < elementos.length; i += tamano) {
    filas.push(elementos.slice(i, i + tamano));
  }
  return filas;
}
