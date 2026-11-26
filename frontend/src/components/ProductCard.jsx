import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

// Tarjeta de un producto: imagen, nombre, categoría, precio y botones
function ProductCard({ producto, onAgregar }) {
  return (
    <div className="card h-100">
      <img
        src={producto.imagen}
        className="card-img-top"
        alt={producto.nombre}
      />
      <div className="card-body d-flex flex-column">
        <small className="text-secondary">
          {producto.categoria}
          {producto.codigo && <> · {producto.codigo}</>}
        </small>
        <h2 className="h6">{producto.nombre}</h2>
        <p className="fw-bold mb-3">{formatPrice(producto.precio)}</p>

        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/producto/${producto.id}`}
            className="btn btn-outline-secondary btn-sm"
          >
            Ver detalle
          </Link>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAgregar(producto)}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;