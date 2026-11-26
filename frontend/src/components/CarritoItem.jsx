import { formatPrice } from "../utils/formatPrice";

// Una fila del carrito: nombre, precio, cantidad y botón quitar
function CarritoItem({ item, onCambiarCantidad, onQuitar }) {
  return (
    <div className="row align-items-center border-bottom py-3">
      <div className="col-12 col-md-5">
        <h2 className="h6 mb-0">{item.nombre}</h2>
        <small>{formatPrice(item.precio)} c/u</small>
        {item.mensaje && (
          <small className="d-block text-secondary">Mensaje: {item.mensaje}</small>
        )}
      </div>

      <div className="col-6 col-md-3 mt-2 mt-md-0">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
        >
          -
        </button>
        <span className="mx-2">{item.cantidad}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
        >
          +
        </button>
      </div>

      <div className="col-6 col-md-2 mt-2 mt-md-0 fw-bold">
        {formatPrice(item.precio * item.cantidad)}
      </div>

      <div className="col-12 col-md-2 mt-2 mt-md-0">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onQuitar(item.id)}
        >
          Quitar
        </button>
      </div>
    </div>
  );
}

export default CarritoItem;