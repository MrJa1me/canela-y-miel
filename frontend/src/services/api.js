import { manejarError } from './errorHandler'
import {
  avisarCierre,
  avisarRenovacion,
  guardarSesion,
  leerRefresh,
  leerToken,
  limpiarSesion,
} from './sesion'

// Dirección base del backend. Se puede cambiar con VITE_API_URL.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

function cabeceras() {
  const token = leerToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Única salida al backend: agrega el token y, si el acceso venció,
// intenta renovarlo antes de dar la petición por fallida.
export async function solicitar(ruta, { method = 'GET', body, renovar = true, silenciarError = false } = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method,
    headers: cabeceras(),
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (respuesta.status === 401 && renovar && leerRefresh()) {
    const renovado = await renovarToken()
    if (renovado) {
      return solicitar(ruta, { method, body, renovar: false })
    }
  }

  if (!respuesta.ok) {
    const mensaje = await leerMensaje(respuesta)

    // Sin token válido: se cierra la sesión y el guard manda al login.
    if (respuesta.status === 401) {
      limpiarSesion()
      avisarCierre()
    }

    if (!silenciarError) {
      manejarError(respuesta.status, mensaje)
    }
    throw new Error(mensaje ?? `Error ${respuesta.status}`)
  }

  return respuesta.status === 204 ? null : respuesta.json()
}

async function renovarToken() {
  const respuesta = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: leerRefresh() }),
  })

  if (!respuesta.ok) {
    return false
  }

  const sesion = await respuesta.json()
  guardarSesion(sesion)
  avisarRenovacion(sesion.usuario)
  return true
}

async function leerMensaje(respuesta) {
  try {
    const datos = await respuesta.json()
    return datos.mensaje
  } catch {
    return null
  }
}
