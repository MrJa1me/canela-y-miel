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

  async function cargar() {
    setPedidos(await listarPedidos())
  }

  useEffect(() => {
    cargar()
  }, [])

  async function avanzar(id) {
    try {
      await avanzarEstado(id)
      await cargar()
    } catch (error) {
      window.alert(error.message)
    }
  }

  if (!pedidos) return <p>Cargando…</p>

  const visibles = filtro === 'Todos' ? pedidos : pedidos.filter((pedido) => pedido.estado === filtro)

  return (
    <div>
      <h1 className="h3 mb-4">Pedidos</h1>

      <div className="d-flex flex-wrap gap-2 mb-3">
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

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">N° pedido</th>
                <th scope="col">Cliente</th>
                <th scope="col">Fecha</th>
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
                    <td>{pedido.fecha}</td>
                    <td className="text-end">{formatearPrecio(pedido.total)}</td>
                    <td>
                      <span className={`badge ${CLASE_ESTADO[pedido.estado]}`}>{pedido.estado}</span>
                    </td>
                    <td className="text-end">
                      {siguiente ? (
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => avanzar(pedido.id)}>
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
                  <td colSpan="6" className="text-center text-body-secondary py-4">
                    No hay pedidos en este estado.
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
