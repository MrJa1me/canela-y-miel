import { solicitar } from './api'

export function listarProductos() {
  return solicitar('/productos')
}

export function crearProducto(datos) {
  return solicitar('/productos', { method: 'POST', body: datos })
}

export function actualizarProducto(id, datos) {
  return solicitar(`/productos/${id}`, { method: 'PUT', body: datos })
}

export function eliminarProducto(id) {
  return solicitar(`/productos/${id}`, { method: 'DELETE' })
}
