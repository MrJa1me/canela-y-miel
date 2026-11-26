import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

// Vista previa del carrito que se abre desde la barra de navegación.
function MiniCarrito() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="px-3 py-3 small text-secondary">
        Tu carrito está vacío.
        <Link className="d-block mt-2" to="/catalogo">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="list-group list-group-flush">
        {items.slice(0, 4).map((item) => (
          <li key={item.id} className="list-group-item d-flex align-items-center gap-2">
            <img
              src={item.imagen}
              alt=""
              width="40"
              height="40"
              className="rounded object-fit-cover"
              loading="lazy"
            />
            <div className="flex-grow-1">
              <p className="small fw-bold mb-0">{item.nombre}</p>
              <p className="small text-secondary mb-0">
                {item.cantidad} × {formatPrice(item.precio)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {items.length > 4 && (
        <p className="small text-secondary px-3 pt-2 mb-0">
          y {items.length - 4} producto{items.length - 4 === 1 ? "" : "s"} más…
        </p>
      )}

      <div className="border-top px-3 py-2">
        <div className="d-flex justify-content-between small fw-bold mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link className="btn btn-primary btn-sm w-100" to="/carrito">
          Ver carrito
        </Link>
        <Link className="btn btn-outline-primary btn-sm w-100 mt-2" to="/checkout">
          Ir a pagar
        </Link>
      </div>
    </div>
  );
}

export default MiniCarrito;
