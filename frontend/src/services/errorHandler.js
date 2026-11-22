// Manejador central de errores de la API.
// Un solo lugar decide qué mensaje ve el usuario.
// shortcut: alert nativo, cambiar a toasts cuando exista un contenedor global.

const MENSAJES = {
  400: 'Los datos enviados no son válidos.',
  403: 'No tienes permiso para esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'La operación entra en conflicto con los datos actuales.',
  500: 'Ocurrió un error en el servidor.',
}

export function manejarError(estado, mensaje) {
  // 401: la sesión ya se cerró o es un login fallido; la pantalla muestra el detalle.
  if (estado === 401) return

  alert(mensaje ?? MENSAJES[estado] ?? 'Ocurrió un error inesperado.')
}
