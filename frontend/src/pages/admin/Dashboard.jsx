import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarPedidos } from '../../services/orderService'
import { listarProductos } from '../../services/productService'
import { listarUsuarios } from '../../services/userService'

const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`

const claveDeFecha = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`

// Suma los pedidos de los últimos 7 días para el gráfico.
function ventasPorDia(pedidos) {
  const dias = []

  for (let atras = 6; atras >= 0; atras--) {
    const fecha = new Date()
    fecha.setHours(0, 0, 0, 0)
    fecha.setDate(fecha.getDate() - atras)
    dias.push({
      clave: claveDeFecha(fecha),
      etiqueta: fecha.toLocaleDateString('es-CL', { weekday: 'short' }),
      total: 0,
    })
  }

  pedidos.forEach((pedido) => {
    const dia = dias.find((item) => item.clave === (pedido.fecha ?? '').slice(0, 10))
    if (dia) dia.total += pedido.total
  })

  return dias
}

// Tarjeta de indicador: recibe todo por props.
function TarjetaKpi({ titulo, valor, detalle }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card h-100 border-0 shadow-sm tarjeta-admin tarjeta-hover">
        <div className="card-body">
          <p className="text-secondary small mb-1">{titulo}</p>
          <p className="h4 mb-1">{valor}</p>
          <p className="small text-body-secondary mb-0">{detalle}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [resumen, setResumen] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [pedidos, productos, usuarios] = await Promise.all([
          listarPedidos(),
          listarProductos(),
          listarUsuarios(),
        ])

        const ventas = pedidos.reduce((suma, pedido) => suma + pedido.total, 0)
        const activos = pedidos.filter((pedido) => pedido.estado !== 'Entregado').length
        const stockBajo = productos.filter((producto) => producto.stock <= 5).length
        const clientes = usuarios.filter((usuario) => usuario.rol === 'CLIENTE').length

        setResumen({
          ventas,
          pedidos: pedidos.length,
          activos,
          stockBajo,
          clientes,
          semana: ventasPorDia(pedidos),
          ultimos: [...pedidos].sort((a, b) => b.id - a.id).slice(0, 5),
          stockBajoLista: productos.filter((producto) => producto.stock <= 5).slice(0, 5),
        })
      } catch (fallo) {
        setError(fallo.message)
      }
    }

    cargar()
  }, [])

  if (error) return <p className="text-danger">{error}</p>
  if (!resumen) return <p>Cargando…</p>

  const maximo = Math.max(...resumen.semana.map((dia) => dia.total), 1)

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard</h1>

      <div className="row g-3">
        <TarjetaKpi titulo="Ventas totales" valor={formatearPrecio(resumen.ventas)} detalle="Suma de los pedidos registrados" />
        <TarjetaKpi titulo="Pedidos" valor={resumen.pedidos} detalle={`${resumen.activos} activos`} />
        <TarjetaKpi titulo="Stock bajo" valor={resumen.stockBajo} detalle="Productos con 5 unidades o menos" />
        <TarjetaKpi titulo="Clientes" valor={resumen.clientes} detalle="Usuarios con rol CLIENTE" />
      </div>

      <div className="card border-0 shadow-sm mt-4 tarjeta-admin">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Ventas de los últimos 7 días</h2>
            <span className="small text-body-secondary">Según pedidos registrados</span>
          </div>

          <div className="d-flex align-items-end gap-2 grafico">
            {resumen.semana.map((dia) => (
              <div key={dia.clave} className="d-flex flex-column flex-fill h-100 text-center">
                <div className="d-flex align-items-end flex-grow-1">
                  <div
                    className="w-100 bg-secondary rounded-top"
                    style={{
                      height: `${Math.round((dia.total / maximo) * 100)}%`,
                      maxWidth: "56px",
                      margin: "0 auto",
                    }}
                    title={`${dia.clave}: ${formatearPrecio(dia.total)}`}
                  />
                </div>
                <small className="mt-2 text-body-secondary">{dia.etiqueta}</small>
              </div>
            ))}
          </div>

          {resumen.semana.every((dia) => dia.total === 0) && (
            <p className="text-body-secondary small mb-0">Todavía no hay pedidos en los últimos 7 días.</p>
          )}
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-lg-7">
          <div className="card h-100 tarjeta-admin">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 mb-0">Últimos pedidos</h2>
                <Link to="/admin/pedidos" className="small">Ver todos</Link>
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Estado</th>
                      <th scope="col" className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumen.ultimos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>#{pedido.id}</td>
                        <td>{pedido.cliente}</td>
                        <td><span className="small">{pedido.estado}</span></td>
                        <td className="text-end">{formatearPrecio(pedido.total)}</td>
                      </tr>
                    ))}
                    {resumen.ultimos.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center small text-body-secondary py-3">
                          Todavía no hay pedidos.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card h-100 tarjeta-admin">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 mb-0">Stock bajo</h2>
                <Link to="/admin/inventario" className="small">Ver inventario</Link>
              </div>
              <ul className="list-unstyled mb-0 small">
                {resumen.stockBajoLista.map((producto) => (
                  <li key={producto.id} className="d-flex justify-content-between border-bottom py-1">
                    <span>{producto.nombre}</span>
                    <span className="text-danger fw-semibold">{producto.stock}</span>
                  </li>
                ))}
                {resumen.stockBajoLista.length === 0 && (
                  <li className="text-body-secondary">Todo el stock está sobre 5 unidades.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
