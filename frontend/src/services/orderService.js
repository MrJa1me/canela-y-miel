import { datosPedidos, ESTADOS_PEDIDO } from './datosLocales'

let pedidos = [...datosPedidos]

export { ESTADOS_PEDIDO }

export async function listarPedidos() {
  return [...pedidos]
}

// Devuelve el estado que sigue en el flujo, o null si el pedido ya terminó.
export function estadoSiguiente(estado) {
  const posicion = ESTADOS_PEDIDO.indexOf(estado)
  const esUltimo = posicion === ESTADOS_PEDIDO.length - 1
  return posicion === -1 || esUltimo ? null : ESTADOS_PEDIDO[posicion + 1]
}

// Regla de negocio: un pedido solo avanza al estado siguiente del flujo.
export async function avanzarEstado(id) {
  const pedido = pedidos.find((item) => item.id === id)
  if (!pedido) throw new Error('Pedido no encontrado')

  const siguiente = estadoSiguiente(pedido.estado)
  if (!siguiente) throw new Error('El pedido ya fue entregado')

  pedidos = pedidos.map((item) => (item.id === id ? { ...item, estado: siguiente } : item))
  return { ...pedido, estado: siguiente }
}
