// Manejador central de errores de la API.
// Un solo lugar decide qué mensaje ve el usuario y cuándo cerrar la sesión.
// shortcut: alert nativo, cambiar a toasts cuando exista un contenedor global.

const MENSAJES = {
  400: 'Los datos enviados no son válidos.',
  403: 'No tienes permiso para esta acción.',
  404: 'El recurso solicitado no existe.',
  500: 'Ocurrió un error en el servidor.',
}

export function manejarError(estado, mensaje) {
  // 401: token vencido o inválido. Se borra y se vuelve al login.
  if (estado === 401) {
    localStorage.removeItem('token')
    window.location.assign('/login')
    return
  }

  alert(mensaje ?? MENSAJES[estado] ?? 'Ocurrió un error inesperado.')
}
