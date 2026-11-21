import { datosUsuarios } from './datosLocales'

const ROLES = ['ADMIN', 'CLIENTE']

let usuarios = [...datosUsuarios]

export async function listarUsuarios() {
  return [...usuarios]
}

export async function actualizarRol(id, rol) {
  if (!ROLES.includes(rol)) throw new Error('Rol no válido')

  usuarios = usuarios.map((usuario) => (usuario.id === id ? { ...usuario, rol } : usuario))
  const actualizado = usuarios.find((usuario) => usuario.id === id)
  if (!actualizado) throw new Error('Usuario no encontrado')
  return { ...actualizado }
}
