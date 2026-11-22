import { solicitar } from './api'
import { guardarSesion, limpiarSesion } from './sesion'

export async function login(correo, password) {
  const sesion = await solicitar('/auth/login', {
    method: 'POST',
    body: { correo, password },
    renovar: false,
  })
  guardarSesion(sesion)
  return sesion.usuario
}

export async function registro(datos) {
  const sesion = await solicitar('/auth/registro', {
    method: 'POST',
    body: datos,
    renovar: false,
  })
  guardarSesion(sesion)
  return sesion.usuario
}

export function perfil() {
  return solicitar('/auth/perfil')
}

export function cerrarSesion() {
  limpiarSesion()
}
