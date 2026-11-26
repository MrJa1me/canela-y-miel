import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import ResumenCarrito from "../../components/ResumenCarrito";
import MapaTienda from "../../components/MapaTienda";

// Página final: muestra el pedido que acaba de crear el servidor
export default function Confirmacion() {
  const ubicacion = useLocation();
  const pedido = ubicacion.state?.pedido;

  // Si entra directo (sin haber comprado), no hay nada que mostrar
  if (!pedido) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container">
      <div className="alert alert-success">
        <h1 className="h4 mb-1">¡Gracias por tu compra!</h1>
        <p className="mb-0">
          Tu pedido <strong>#{pedido.id}</strong> quedó en estado{" "}
          <strong>{pedido.estado}</strong>.
        </p>
      </div>

      <div className="row">
        <div className="col-12 col-lg-7">
          {pedido.fechaEntrega && (
            <p className="mb-3">
              <strong>Entrega:</strong> {pedido.fechaEntrega}
              {pedido.direccion && <> — {pedido.direccion}</>}
              {pedido.telefono && <> · {pedido.telefono}</>}
            </p>
          )}

          <h2 className="h5">Detalle</h2>
          <ul className="list-group mb-3">
            {pedido.detalles.map((detalle) => (
              <li
                key={detalle.productoId}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {detalle.cantidad} x {detalle.producto}
                  {detalle.mensaje && (
                    <small className="d-block text-secondary">
                      Mensaje: {detalle.mensaje}
                    </small>
                  )}
                </span>
                <span>{formatPrice(detalle.subtotal)}</span>
              </li>
            ))}
          </ul>
          {pedido.cuponCodigo && <p>Cupón aplicado: {pedido.cuponCodigo}</p>}
        </div>

        <div className="col-12 col-lg-5">
          <ResumenCarrito
            subtotal={pedido.subtotal}
            descuento={pedido.descuento}
            envio={pedido.envio}
            total={pedido.total}
            etiquetaDescuento="Descuentos aplicados"
          />
        </div>
      </div>

      <div className="row g-3 mt-2 mb-4">
        <div className="col-12 col-lg-7">
          <MapaTienda />
        </div>
        <div className="col-12 col-lg-5 d-flex flex-column gap-2 no-imprimir">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Ver boleta
          </button>
          <Link
            to="/seguimiento"
            state={{ pedidoId: pedido.id }}
            className="btn btn-outline-primary"
          >
            Seguir mi pedido
          </Link>
          <Link to="/catalogo" className="btn btn-outline-secondary">
            Seguir comprando
          </Link>
        </div>
      </div>

      {/* Vista imprimible: el resto de la página se oculta al imprimir */}
      <section className="boleta border rounded-3 p-3">
        <div className="d-flex justify-content-between align-items-start">
          <h2 className="h5 mb-1">Boleta #{pedido.id}</h2>
          <span className="small">{new Date(pedido.fecha).toLocaleString("es-CL")}</span>
        </div>
        <p className="small mb-1">
          <strong>Cliente:</strong> {pedido.cliente} · {pedido.correo}
        </p>
        {pedido.fechaEntrega && (
          <p className="small mb-1">
            <strong>Entrega:</strong> {pedido.fechaEntrega} — {pedido.direccion}
          </p>
        )}
        {pedido.telefono && (
          <p className="small mb-0">
            <strong>Teléfono:</strong> {pedido.telefono}
          </p>
        )}

        <table className="table table-sm mt-3">
          <thead>
            <tr>
              <th scope="col">Cantidad</th>
              <th scope="col">Producto</th>
              <th scope="col" className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles.map((detalle) => (
              <tr key={detalle.productoId}>
                <td>{detalle.cantidad}</td>
                <td>
                  {detalle.producto}
                  {detalle.mensaje && (
                    <small className="d-block text-secondary">{detalle.mensaje}</small>
                  )}
                </td>
                <td className="text-end">{formatPrice(detalle.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-end">
          <div className="small" style={{ minWidth: "220px" }}>
            <div className="d-flex justify-content-between gap-4">
              <span>Subtotal</span>
              <span>{formatPrice(pedido.subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between gap-4">
              <span>Descuentos</span>
              <span>-{formatPrice(pedido.descuento)}</span>
            </div>
            <div className="d-flex justify-content-between gap-4">
              <span>Envío</span>
              <span>{formatPrice(pedido.envio)}</span>
            </div>
            <div className="d-flex justify-content-between gap-4 fw-bold border-top pt-1 mt-1">
              <span>Total</span>
              <span>{formatPrice(pedido.total)}</span>
            </div>
          </div>
        </div>

        <p className="small text-secondary mt-3 mb-0">
          Documento de demostración, sin valor tributario.
        </p>
      </section>
    </div>
  );
}
