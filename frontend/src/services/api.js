import { manejarError } from './errorHandler'

// Dirección base del backend. Se puede cambiar con VITE_API_URL en un .env del frontend.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

// Cabeceras comunes. Desde la Fase 3 el login guarda el token en localStorage.
function cabeceras() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Única salida hacia el backend: agrega el token y manda los errores al manejador central.
// La Fase 4 reemplaza los datos locales de los servicios por llamadas a esta función.
export async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers: cabeceras() })

  if (!respuesta.ok) {
    manejarError(respuesta.status)
    throw new Error(`Error ${respuesta.status}`)
  }

  return respuesta.status === 204 ? null : respuesta.json()
}
