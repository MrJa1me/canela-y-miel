// Revisa que el email tenga forma de correo: algo@dominio.cl
export function esEmailValido(email) {
  // Patrón: texto + @ + texto + punto + texto, sin espacios
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email);
}

// Revisa que el teléfono chileno tenga 9 dígitos y empiece con 9
export function esTelefonoChilenoValido(telefono) {
  // ^9 = empieza con 9, \d{8} = ocho dígitos más, $ = ahí termina
  const patron = /^9\d{8}$/;
  return patron.test(telefono);
}
// Revisa que el texto tenga al menos "minimo" caracteres
export function tieneLargoMinimo(texto, minimo) {
  return texto.length >= minimo;
}

// Revisa que las dos contraseñas sean exactamente iguales
export function coincidenContrasenas(contrasena, repetida) {
  return contrasena === repetida;
}

// Revisa que el campo no esté vacío (ni solo espacios)
export function esCampoObligatorio(valor) {
  return valor.trim() !== "";
}