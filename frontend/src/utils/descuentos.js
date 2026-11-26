// Reglas del cliente tomadas del caso. Deben dar el mismo resultado que el backend.
export const CODIGO_FELICES50 = 'FELICES50'

const DOMINIOS_INSTITUCIONALES = ['@duoc.cl', '@duocuc.cl', '@profesor.duoc.cl']

// Convierte "2000-11-25" en una fecha local (new Date("2000-11-25") sería UTC).
function fechaLocal(texto) {
  if (!texto) return null
  const [anio, mes, dia] = String(texto).split('-').map(Number)
  if (!anio || !mes || !dia) return null
  return new Date(anio, mes - 1, dia)
}

export function esCorreoInstitucional(correo) {
  if (!correo) return false
  const normalizado = correo.trim().toLowerCase()
  return DOMINIOS_INSTITUCIONALES.some((dominio) => normalizado.endsWith(dominio))
}

export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  const nacimiento = fechaLocal(fechaNacimiento)
  if (!nacimiento) return null

  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

export function esMayorDe50(fechaNacimiento, hoy = new Date()) {
  return calcularEdad(fechaNacimiento, hoy) >= 50
}

export function esCumpleanosHoy(fechaNacimiento, hoy = new Date()) {
  const nacimiento = fechaLocal(fechaNacimiento)
  if (!nacimiento) return false
  return nacimiento.getMonth() === hoy.getMonth() && nacimiento.getDate() === hoy.getDate()
}

// Resumen de los beneficios del usuario para calcular totales en el navegador.
export function beneficiosDeUsuario(usuario) {
  return {
    esPremium: Boolean(usuario?.premium),
    tieneFelices50: usuario?.codigoPromocional === CODIGO_FELICES50,
    esMayorDe50: esMayorDe50(usuario?.fechaNacimiento),
    cumpleHoy: esCumpleanosHoy(usuario?.fechaNacimiento),
    correoInstitucional: Boolean(usuario?.correoInstitucional),
  }
}

// En el catálogo del caso las tortas se llaman "Torta ...".
export function esTorta(producto) {
  return Boolean(producto?.nombre) && producto.nombre.toLowerCase().startsWith('torta')
}

// Fecha de hoy en formato yyyy-mm-dd, sin desfase de zona horaria.
export function hoyISO(hoy = new Date()) {
  const desplazamiento = hoy.getTimezoneOffset() * 60000
  return new Date(hoy.getTime() - desplazamiento).toISOString().slice(0, 10)
}
