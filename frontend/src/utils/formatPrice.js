// Convierte un número en precio chileno: 35000 -> $35.000
export function formatPrice(valor) {
  // toLocaleString con 'es-CL' pone el punto de miles
  return "$" + valor.toLocaleString("es-CL");
}