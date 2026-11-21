import { datosProductos } from './datosLocales'

// Copia en memoria: los cambios se pierden al recargar hasta la Fase 4.
let productos = [...datosProductos]

export async function listarProductos() {
  return [...productos]
}

export async function crearProducto(datos) {
  const id = Math.max(0, ...productos.map((producto) => producto.id)) + 1
  const nuevo = { ...datos, id }
  productos = [...productos, nuevo]
  return { ...nuevo }
}

export async function actualizarProducto(id, datos) {
  productos = productos.map((producto) => (producto.id === id ? { ...producto, ...datos } : producto))
  const actualizado = productos.find((producto) => producto.id === id)
  if (!actualizado) throw new Error('Producto no encontrado')
  return { ...actualizado }
}

export async function eliminarProducto(id) {
  productos = productos.filter((producto) => producto.id !== id)
}
