import { solicitar } from './api'

export const ESTADOS_PEDIDO = [
  'Recibido',
  'En preparación',
  'Listo para despacho',
  'En camino',
  'Entregado',
]

export function listarPedidos() {
  return solicitar('/pedidos')
}

export function crearPedido(datos) {
  return solicitar('/pedidos', { method: 'POST', body: datos })
}

// Devuelve el estado que sigue en el flujo, o null si ya terminó.
export function estadoSiguiente(estado) {
  const posicion = ESTADOS_PEDIDO.indexOf(estado)
  const esUltimo = posicion === ESTADOS_PEDIDO.length - 1
  return posicion === -1 || esUltimo ? null : ESTADOS_PEDIDO[posicion + 1]
}

// El backend valida el orden; aquí solo se arma el estado destino.
export function avanzarEstado(pedido) {
  const siguiente = estadoSiguiente(pedido.estado)
  if (!siguiente) return Promise.reject(new Error('El pedido ya fue entregado'))

  return solicitar(`/pedidos/${pedido.id}/estado`, {
    method: 'PATCH',
    body: { estado: siguiente },
  })
}
