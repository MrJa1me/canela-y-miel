import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listarProductos } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";

// Página de detalle: un producto, su cantidad y el botón "Añadir al carrito"
export default function Detalle() {
  const { id } = useParams();
  const { agregar } = useCart();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Pide los productos y se queda con el que coincide con el id de la dirección
  useEffect(() => {
    async function cargar() {
      try {
        const lista = await listarProductos();
        setProducto(lista.find((p) => p.id === Number(id)) ?? null);
      } catch {
        setError("No pudimos cargar el producto. Intenta más tarde.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  if (cargando) {
    return <div className="container">Cargando producto...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  if (!producto || !producto.activo) {
    return (
      <div className="container">
        <p>Este producto no está disponible.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const sinStock = producto.stock < 1;

  // La cantidad va entre 1 y el stock disponible
  function cambiarCantidad(nueva) {
    setAgregado(false);
    setCantidad(Math.min(Math.max(nueva, 1), producto.stock));
  }

  function anadir() {
    agregar(producto, cantidad);
    setAgregado(true);
  }

  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-3" />
        </div>

        <div className="col-12 col-md-6">
          <small className="text-secondary">{producto.categoria}</small>
          <h1 className="h3">{producto.nombre}</h1>
          <p className="h4">{formatPrice(producto.precio)}</p>
          <p>{sinStock ? "Sin stock" : `Quedan ${producto.stock} unidades`}</p>

          {!sinStock && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => cambiarCantidad(cantidad - 1)}
              >
                -
              </button>
              <span>{cantidad}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => cambiarCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>
          )}

          <button className="btn btn-primary" onClick={anadir} disabled={sinStock}>
            Añadir al carrito
          </button>

          {agregado && (
            <div className="alert alert-success mt-3">
              Producto agregado. <Link to="/carrito">Ver carrito</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
