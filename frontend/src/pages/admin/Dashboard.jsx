import { useEffect, useState } from 'react'
import { listarPedidos } from '../../services/orderService'
import { listarProductos } from '../../services/productService'
import { listarUsuarios } from '../../services/userService'
import { ventasSemana } from '../../services/datosLocales'

const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`

// Tarjeta de indicador: recibe todo por props.
function TarjetaKpi({ titulo, valor, detalle }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card h-100 border-0 shadow-sm">
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

  useEffect(() => {
    async function cargar() {
      const [pedidos, productos, usuarios] = await Promise.all([
        listarPedidos(),
        listarProductos(),
        listarUsuarios(),
      ])

      const ventas = pedidos.reduce((suma, pedido) => suma + pedido.total, 0)
      const activos = pedidos.filter((pedido) => pedido.estado !== 'Entregado').length
      const stockBajo = productos.filter((producto) => producto.stock <= 5).length
      const clientes = usuarios.filter((usuario) => usuario.rol === 'CLIENTE').length

      setResumen({ ventas, pedidos: pedidos.length, activos, stockBajo, clientes })
    }

    cargar()
  }, [])

  if (!resumen) return <p>Cargando…</p>

  const maximo = Math.max(...ventasSemana.valores)

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard</h1>

      <div className="row g-3">
        <TarjetaKpi titulo="Ventas totales" valor={formatearPrecio(resumen.ventas)} detalle="Suma de los pedidos registrados" />
        <TarjetaKpi titulo="Pedidos" valor={resumen.pedidos} detalle={`${resumen.activos} activos`} />
        <TarjetaKpi titulo="Stock bajo" valor={resumen.stockBajo} detalle="Productos con 5 unidades o menos" />
        <TarjetaKpi titulo="Clientes" valor={resumen.clientes} detalle="Usuarios con rol CLIENTE" />
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Ventas de la semana</h2>
            <span className="small text-body-secondary">Datos de ejemplo</span>
          </div>

          <div className="d-flex align-items-end gap-2 grafico">
            {ventasSemana.valores.map((valor, indice) => (
              <div
                key={ventasSemana.etiquetas[indice]}
                className="d-flex flex-column flex-fill h-100 text-center"
              >
                <div className="d-flex align-items-end flex-grow-1">
                  <div
                    className="w-100 bg-secondary rounded-top"
                    style={{ height: `${Math.round((valor / maximo) * 100)}%` }}
                    title={`${ventasSemana.etiquetas[indice]}: ${formatearPrecio(valor)}`}
                  />
                </div>
                <small className="mt-2 text-body-secondary">{ventasSemana.etiquetas[indice]}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
