// Avatares predefinidos: el backend solo acepta estas rutas.
export const AVATARES = [1, 2, 3, 4, 5, 6].map(
  (numero) => `/img/avatares/avatar-${numero}.svg`
)

// Iniciales para cuando el usuario no elige avatar.
export function iniciales(nombre) {
  if (!nombre || !nombre.trim()) return '?'
  const letras = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
  return letras.toUpperCase()
}
