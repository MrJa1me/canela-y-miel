import { useEffect, useState } from 'react'
import { CATEGORIAS, IMAGENES } from '../../services/datosLocales'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from '../../services/productService'

const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`

const FORMULARIO_VACIO = {
  nombre: '',
  categoria: CATEGORIAS[0],
  precio: '',
  stock: '',
  imagen: IMAGENES[0].archivo,
}

export default function Inventario() {
  const [productos, setProductos] = useState(null)
  const [formulario, setFormulario] = useState(null) // null = formulario cerrado
  const [editandoId, setEditandoId] = useState(null)

  async function cargar() {
    setProductos(await listarProductos())
  }

  useEffect(() => {
    cargar()
  }, [])

  function abrirNuevo() {
    setEditandoId(null)
    setFormulario({ ...FORMULARIO_VACIO })
  }

  function abrirEdicion(producto) {
    setEditandoId(producto.id)
    setFormulario({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen: producto.imagen,
    })
  }

  function cerrarFormulario() {
    setFormulario(null)
    setEditandoId(null)
  }

  async function guardar(evento) {
    evento.preventDefault()

    const datos = {
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      imagen: formulario.imagen,
    }

    if (editandoId) {
      await actualizarProducto(editandoId, datos)
    } else {
      await crearProducto(datos)
    }

    cerrarFormulario()
    await cargar()
  }

  async function borrar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    await eliminarProducto(producto.id)
    await cargar()
  }

  if (!productos) return <p>Cargando…</p>

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Inventario</h1>
        <button className="btn btn-primary" type="button" onClick={abrirNuevo}>
          Nuevo producto
        </button>
      </div>

      {formulario && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5 mb-3">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>

            <form onSubmit={guardar}>
              <div className="row g-2">
                <div className="col-12 col-lg-4">
                  <label className="form-label" htmlFor="nombre">Nombre</label>
                  <input
                    className="form-control"
                    id="nombre"
                    value={formulario.nombre}
                    onChange={(evento) => setFormulario({ ...formulario, nombre: evento.target.value })}
                    required
                  />
                </div>

                <div className="col-6 col-lg-2">
                  <label className="form-label" htmlFor="categoria">Categoría</label>
                  <select
                    className="form-select"
                    id="categoria"
                    value={formulario.categoria}
                    onChange={(evento) => setFormulario({ ...formulario, categoria: evento.target.value })}
                  >
                    {CATEGORIAS.map((categoria) => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-lg-2">
                  <label className="form-label" htmlFor="precio">Precio</label>
                  <input
                    className="form-control"
                    id="precio"
                    type="number"
                    min="0"
                    value={formulario.precio}
                    onChange={(evento) => setFormulario({ ...formulario, precio: evento.target.value })}
                    required
                  />
                </div>

                <div className="col-6 col-lg-2">
                  <label className="form-label" htmlFor="stock">Stock</label>
                  <input
                    className="form-control"
                    id="stock"
                    type="number"
                    min="0"
                    value={formulario.stock}
                    onChange={(evento) => setFormulario({ ...formulario, stock: evento.target.value })}
                    required
                  />
                </div>

                <div className="col-6 col-lg-2">
                  <label className="form-label" htmlFor="imagen">Imagen</label>
                  <select
                    className="form-select"
                    id="imagen"
                    value={formulario.imagen}
                    onChange={(evento) => setFormulario({ ...formulario, imagen: evento.target.value })}
                  >
                    {IMAGENES.map((imagen) => (
                      <option key={imagen.archivo} value={imagen.archivo}>{imagen.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-primary" type="submit">Guardar</button>
                <button className="btn btn-outline-secondary" type="button" onClick={cerrarFormulario}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col" className="text-end">Stock</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={producto.imagen}
                        alt=""
                        width="48"
                        height="48"
                        className="rounded object-fit-cover"
                      />
                      <span>{producto.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary-emphasis">{producto.categoria}</span>
                  </td>
                  <td className="text-end">{formatearPrecio(producto.precio)}</td>
                  <td className={`text-end ${producto.stock <= 5 ? 'text-danger fw-semibold' : ''}`}>
                    {producto.stock}
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => abrirEdicion(producto)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => borrar(producto)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-body-secondary py-4">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
