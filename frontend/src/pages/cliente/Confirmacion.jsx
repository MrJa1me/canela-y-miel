import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import ResumenCarrito from "../../components/ResumenCarrito";

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

      <div className="d-flex gap-2 mt-3">
        <Link to="/seguimiento" state={{ pedidoId: pedido.id }} className="btn btn-primary">
          Seguir mi pedido
        </Link>
        <Link to="/catalogo" className="btn btn-outline-secondary">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
