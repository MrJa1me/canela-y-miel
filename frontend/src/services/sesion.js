// Guarda la sesión en localStorage para que sobreviva a las recargas.
const TOKEN = 'canela.token'
const REFRESH = 'canela.refreshToken'
const USUARIO = 'canela.usuario'

export function guardarSesion({ token, refreshToken, usuario }) {
  localStorage.setItem(TOKEN, token)
  localStorage.setItem(REFRESH, refreshToken)
  localStorage.setItem(USUARIO, JSON.stringify(usuario))
}

export function leerToken() {
  return localStorage.getItem(TOKEN)
}

export function leerRefresh() {
  return localStorage.getItem(REFRESH)
}

export function leerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(USUARIO))
  } catch {
    return null
  }
}

// Guarda el usuario actualizado (por ejemplo, después de editar el perfil).
export function guardarUsuario(usuario) {
  localStorage.setItem(USUARIO, JSON.stringify(usuario))
}

export function limpiarSesion() {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(REFRESH)
  localStorage.removeItem(USUARIO)
}

// Eventos para avisar a AuthContext cuando la sesión cambia fuera de React.
export function avisarRenovacion(usuario) {
  window.dispatchEvent(new CustomEvent('canela:sesion-renovada', { detail: usuario }))
}

export function avisarCierre() {
  window.dispatchEvent(new Event('canela:sesion-cerrada'))
}
