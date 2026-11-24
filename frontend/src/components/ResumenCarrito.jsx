import { formatPrice } from "../utils/formatPrice";

// Cuadro con el detalle de lo que se va a pagar
function ResumenCarrito({ subtotal, descuento, envio, total }) {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="h5 mb-3">Resumen del pedido</h2>

        <div className="d-flex justify-content-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* El descuento solo se muestra si hay (clientes premium) */}
        {descuento > 0 && (
          <div className="d-flex justify-content-between">
            <span>Descuento Premium (10%)</span>
            <span>-{formatPrice(descuento)}</span>
          </div>
        )}

        <div className="d-flex justify-content-between">
          <span>Envío</span>
          <span>{formatPrice(envio)}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default ResumenCarrito;