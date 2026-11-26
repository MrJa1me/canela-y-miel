import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listarProductos } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { esTorta } from "../../utils/descuentos";
import { formatPrice } from "../../utils/formatPrice";
import FormField from "../../components/FormField";
import CarruselProductos from "../../components/CarruselProductos";

// Página de detalle: un producto, su cantidad, mensaje y el botón "Añadir al carrito"
export default function Detalle() {
  const { id } = useParams();
  const { agregar } = useCart();

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [agregado, setAgregado] = useState(false);
  const [compartido, setCompartido] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Pide los productos, se queda con el de la dirección y busca los de su categoría
  async function cargar() {
    setCargando(true);
    setError("");
    try {
      const lista = await listarProductos();
      const encontrado = lista.find((p) => p.id === Number(id)) ?? null;
      setProducto(encontrado);
      setRelacionados(
        encontrado
          ? lista
              .filter(
                (p) =>
                  p.activo &&
                  p.categoria === encontrado.categoria &&
                  p.id !== encontrado.id
              )
              .slice(0, 6)
          : []
      );
    } catch {
      setError("Ocurrió un error al cargar el producto. Intenta nuevamente en unos minutos.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [id]);

  if (cargando) {
    return <div className="container">Cargando producto...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={cargar}>
            Reintentar
          </button>
        </div>
      </div>
    );
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
  const torta = esTorta(producto);

  // La cantidad va entre 1 y el stock disponible
  function cambiarCantidad(nueva) {
    setAgregado(false);
    setCantidad(Math.min(Math.max(nueva, 1), producto.stock));
  }

  function anadir() {
    agregar(producto, cantidad, torta ? mensaje.trim() || null : null);
    setAgregado(true);
  }

  // Copia el enlace del producto (o lo muestra si el navegador lo bloquea)
  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCompartido("Enlace copiado.");
    } catch {
      setCompartido(`Copia este enlace: ${window.location.href}`);
    }
  }

  function compartirWhatsApp() {
    const texto = encodeURIComponent(
      `${producto.nombre} (${producto.codigo ?? ""}) - ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${texto}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded-3"
            loading="lazy"
          />
        </div>

        <div className="col-12 col-md-6">
          <small className="text-secondary">
            {producto.categoria}
            {producto.codigo && <> · {producto.codigo}</>}
          </small>
          <h1 className="h3">{producto.nombre}</h1>
          {producto.descripcion && (
            <p className="text-body-secondary">{producto.descripcion}</p>
          )}
          <p className="h4">{formatPrice(producto.precio)}</p>
          {producto.porciones && (
            <p className="small text-secondary">{producto.porciones} porciones aprox.</p>
          )}
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

          {torta && !sinStock && (
            <FormField id="mensaje" label="Mensaje para la torta (opcional)"
              value={mensaje} onChange={(e) => setMensaje(e.target.value)}
              placeholder="Feliz cumpleaños, Ana" maxLength={200} />
          )}

          <button className="btn btn-primary" onClick={anadir} disabled={sinStock}>
            Añadir al carrito
          </button>

          {agregado && (
            <div className="alert alert-success mt-3">
              Producto agregado. <Link to="/carrito">Ver carrito</Link>
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={copiarEnlace}>
              Copiar enlace
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={compartirWhatsApp}>
              Compartir por WhatsApp
            </button>
          </div>
          {compartido && <p className="small text-secondary mt-2">{compartido}</p>}
        </div>
      </div>

      {relacionados.length > 0 && (
        <>
          <h2 className="h5 mt-5">También te puede gustar</h2>
          {/* Productos relacionados: usan ProductCard (.tarjeta-producto) */}
          <CarruselProductos
            id="carrusel-relacionados"
            productos={relacionados}
            onAgregar={(item) => agregar(item)}
          />
        </>
      )}
    </div>
  );
}
