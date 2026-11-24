import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CarritoItem from "../../components/CarritoItem";
import ResumenCarrito from "../../components/ResumenCarrito";

// Página del carrito: lista de productos y resumen de pago
export default function Carrito() {
  // Trae del contexto los datos y las funciones del carrito
  const { items, cambiarCantidad, quitar, vaciar, subtotal, descuento, envio, total } =
    useCart();

  // Si no hay productos, muestra un mensaje y un enlace al catálogo
  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="h3 mb-3">Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="h3 mb-3">Carrito</h1>

      <div className="row">
        <div className="col-12 col-lg-8">
          {items.map((item) => (
            <CarritoItem
              key={item.id}
              item={item}
              onCambiarCantidad={cambiarCantidad}
              onQuitar={quitar}
            />
          ))}
          <button className="btn btn-link mt-2" onClick={vaciar}>
            Vaciar carrito
          </button>
        </div>

        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <ResumenCarrito
            subtotal={subtotal}
            descuento={descuento}
            envio={envio}
            total={total}
          />
          <Link to="/checkout" className="btn btn-primary w-100 mt-3">
            Ir a pagar
          </Link>
        </div>
      </div>
    </div>
  );
}