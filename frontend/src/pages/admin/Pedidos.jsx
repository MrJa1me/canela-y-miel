import { useEffect, useState } from 'react'
import { avanzarEstado, ESTADOS_PEDIDO, estadoSiguiente, listarPedidos } from '../../services/orderService'

const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`

const CLASE_ESTADO = {
  Recibido: 'bg-secondary-subtle text-secondary-emphasis',
  'En preparación': 'bg-warning-subtle text-warning-emphasis',
  'Listo para despacho': 'bg-primary-subtle text-primary-emphasis',
  'En camino': 'bg-info-subtle text-info-emphasis',
  Entregado: 'bg-success-subtle text-success-emphasis',
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState(null)
  const [filtro, setFiltro] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState('')

  async function cargar() {
    setPedidos(await listarPedidos())
  }

  useEffect(() => {
    cargar().catch((fallo) => setError(fallo.message))
  }, [])

  async function avanzar(pedido) {
    try {
      await avanzarEstado(pedido)
      await cargar()
    } catch {
      // El mensaje ya lo mostró el manejador central de errores.
    }
  }

  if (error) return <p className="text-danger">{error}</p>
  if (!pedidos) return <p>Cargando…</p>

  const visibles = pedidos.filter((pedido) => {
    const cumpleEstado = filtro === 'Todos' || pedido.estado === filtro
    const texto = busqueda.trim().toLowerCase()
    const cumpleTexto = !texto
      || pedido.cliente.toLowerCase().includes(texto)
      || String(pedido.id).includes(texto)
    return cumpleEstado && cumpleTexto
  })

  return (
    <div>
      <h1 className="h3 mb-4">Pedidos</h1>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <input
          type="search"
          className="form-control form-control-sm"
          style={{ maxWidth: '260px' }}
          placeholder="Cliente o N° de pedido"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        {['Todos', ...ESTADOS_PEDIDO].map((estado) => (
          <button
            key={estado}
            className={`btn btn-sm ${filtro === estado ? 'btn-primary' : 'btn-outline-primary'}`}
            type="button"
            onClick={() => setFiltro(estado)}
          >
            {estado}
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm tarjeta-admin">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">N° pedido</th>
                <th scope="col">Cliente</th>
                <th scope="col">Fecha</th>
                <th scope="col">Entrega</th>
                <th scope="col" className="text-end">Total</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((pedido) => {
                const siguiente = estadoSiguiente(pedido.estado)

                return (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{pedido.cliente}</td>
                    <td>{pedido.fecha?.slice(0, 10)}</td>
                    <td className="small">
                      {pedido.retiro ? 'Retiro en local' : pedido.fechaEntrega ?? '—'}
                    </td>
                    <td className="text-end">{formatearPrecio(pedido.total)}</td>
                    <td>
                      <span className={`badge ${CLASE_ESTADO[pedido.estado]}`}>{pedido.estado}</span>
                    </td>
                    <td className="text-end">
                      {siguiente ? (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => avanzar(pedido)}>
                          Pasar a {siguiente}
                        </button>
                      ) : (
                        <span className="small text-body-secondary">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {visibles.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-body-secondary py-4">
                    No hay pedidos con esos filtros.
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
