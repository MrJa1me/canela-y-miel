import { solicitar } from './api'

export function listarUsuarios() {
  return solicitar('/usuarios')
}

// El backend pide el usuario completo; la contraseña se omite para no cambiarla.
export function actualizarRol(usuario, rol) {
  const { id, nombre, correo, premium, activo } = usuario
  return solicitar(`/usuarios/${id}`, {
    method: 'PUT',
    body: { nombre, correo, rol, premium, activo },
  })
}

// Perfil del dueño de la cuenta. Los errores se muestran en la misma pantalla.
export function miPerfil() {
  return solicitar('/usuarios/me')
}

export function actualizarMiPerfil(datos) {
  return solicitar('/usuarios/me', { method: 'PUT', body: datos, silenciarError: true })
}

export function cambiarPassword(datos) {
  return solicitar('/usuarios/me/password', {
    method: 'PUT',
    body: datos,
    silenciarError: true,
  })
}
