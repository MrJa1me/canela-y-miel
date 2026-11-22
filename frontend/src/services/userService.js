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
