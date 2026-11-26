import { useEffect, useState } from 'react'
import { listarCategorias } from '../../services/categoriaService'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from '../../services/productService'

const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`

// Imágenes copiadas del prototipo a public/img.
const IMAGENES = [
  { archivo: '/img/chocolate.jpg', nombre: 'Torta de chocolate' },
  { archivo: '/img/tartaleta.jpg', nombre: 'Tartaleta' },
  { archivo: '/img/pancakes.png', nombre: 'Pancakes' },
  { archivo: '/img/cheesecake.jpg', nombre: 'Cheesecake' },
  { archivo: '/img/tres_leches.jpg', nombre: 'Tres leches' },
  { archivo: '/img/zanahoria.jpg', nombre: 'Pastel de zanahoria' },
  { archivo: '/img/macarons.jpg', nombre: 'Macarons' },
  { archivo: '/img/placeholder.svg', nombre: 'Ilustración genérica' },
  { archivo: '/img/mapa.jpg', nombre: 'Mapa' },
]

const FORMULARIO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoriaId: '',
  precio: '',
  stock: '',
  porciones: '',
  imagen: IMAGENES[0].archivo,
  activo: true,
}

export default function Inventario() {
  const [productos, setProductos] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [formulario, setFormulario] = useState(null) // null = formulario cerrado
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [soloStockBajo, setSoloStockBajo] = useState(false)

  async function cargar() {
    const [listaProductos, listaCategorias] = await Promise.all([
      listarProductos(),
      listarCategorias(),
    ])
    setProductos(listaProductos)
    setCategorias(listaCategorias)
  }

  useEffect(() => {
    cargar().catch((fallo) => setError(fallo.message))
  }, [])

  function abrirNuevo() {
    setEditandoId(null)
    setFormulario({ ...FORMULARIO_VACIO })
  }

  function abrirEdicion(producto) {
    setEditandoId(producto.id)
    setFormulario({
      codigo: producto.codigo ?? '',
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      categoriaId: String(producto.categoriaId),
      precio: String(producto.precio),
      stock: String(producto.stock),
      porciones: String(producto.porciones ?? ''),
      imagen: producto.imagen,
      activo: producto.activo,
    })
  }

  function cerrarFormulario() {
    setFormulario(null)
    setEditandoId(null)
  }

  async function guardar(evento) {
    evento.preventDefault()

    const datos = {
      codigo: formulario.codigo.trim().toUpperCase(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      categoriaId: Number(formulario.categoriaId),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      porciones: Number(formulario.porciones),
      imagen: formulario.imagen,
      activo: formulario.activo,
    }

    try {
      if (editandoId) {
        await actualizarProducto(editandoId, datos)
      } else {
        await crearProducto(datos)
      }
      cerrarFormulario()
      await cargar()
    } catch {
      // El mensaje ya lo mostró el manejador central de errores.
    }
  }

  async function borrar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return

    try {
      await eliminarProducto(producto.id)
      await cargar()
    } catch {
      // El mensaje ya lo mostró el manejador central de errores.
    }
  }

  if (error) return <p className="text-danger">{error}</p>
  if (!productos) return <p>Cargando…</p>

  const visibles = productos.filter((producto) => {
    const texto = busqueda.trim().toLowerCase()
    const cumpleTexto = !texto
      || producto.nombre.toLowerCase().includes(texto)
      || (producto.codigo ?? '').toLowerCase().includes(texto)
    const cumpleStock = !soloStockBajo || producto.stock <= 5
    return cumpleTexto && cumpleStock
  })

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Inventario</h1>
        <button className="btn btn-primary" type="button" onClick={abrirNuevo}>
          Nuevo producto
        </button>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <input
          type="search"
          className="form-control"
          style={{ maxWidth: "320px" }}
          placeholder="Buscar por nombre o código"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        <div className="form-check mb-0">
          <input
            id="solo-stock"
            type="checkbox"
            className="form-check-input"
            checked={soloStockBajo}
            onChange={(evento) => setSoloStockBajo(evento.target.checked)}
          />
          <label className="form-check-label small" htmlFor="solo-stock">
            Solo stock bajo (5 o menos)
          </label>
        </div>
        <span className="small text-body-secondary">{visibles.length} productos</span>
      </div>

      {formulario && (
        <div className="card border-0 shadow-sm mb-4 tarjeta-admin">
          <div className="card-body">
            <h2 className="h5 mb-3">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>

            <form onSubmit={guardar}>
              <div className="row g-2">
                <div className="col-6 col-lg-2">
                  <label className="form-label" htmlFor="codigo">Código</label>
                  <input
                    className="form-control"
                    id="codigo"
                    value={formulario.codigo}
                    onChange={(evento) => setFormulario({ ...formulario, codigo: evento.target.value })}
                    placeholder="TC001"
                    required
                  />
                </div>

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
                    value={formulario.categoriaId}
                    onChange={(evento) => setFormulario({ ...formulario, categoriaId: evento.target.value })}
                    required
                  >
                    <option value="">Selecciona…</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
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
                  <label className="form-label" htmlFor="porciones">Porciones</label>
                  <input
                    className="form-control"
                    id="porciones"
                    type="number"
                    min="1"
                    value={formulario.porciones}
                    onChange={(evento) => setFormulario({ ...formulario, porciones: evento.target.value })}
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

                <div className="col-12">
                  <label className="form-label" htmlFor="descripcion">Descripción</label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    rows="2"
                    value={formulario.descripcion}
                    onChange={(evento) => setFormulario({ ...formulario, descripcion: evento.target.value })}
                    required
                  />
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

      <div className="card border-0 shadow-sm tarjeta-admin">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col" className="text-end">Stock</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((producto) => (
                <tr key={producto.id}>
                  <td className="text-nowrap">{producto.codigo ?? '—'}</td>
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

              {visibles.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-body-secondary py-4">
                    No hay productos con esos filtros.
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
