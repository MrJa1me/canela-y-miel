import { useEffect, useState } from "react";
import { listarProductos } from "../../services/productService";
import { listarCategorias } from "../../services/categoriaService";
import { useCart } from "../../context/CartContext";
import { filtrarProductos } from "../../utils/filtrarProductos";
import ProductCard from "../../components/ProductCard";
import Filtros from "../../components/Filtros";
import SkeletonCatalogo from "../../components/SkeletonCatalogo";

// Página del catálogo: lista de productos con filtros
export default function Catalogo() {
  const { agregar } = useCart();

  // Datos que llegan del backend
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Filtros elegidos por el cliente
  const [categoria, setCategoria] = useState("");
  const [precioMax, setPrecioMax] = useState(60000);
  const [porcionesMax, setPorcionesMax] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Al abrir la página, pide productos y categorías al backend
  async function cargar() {
    setCargando(true);
    setError("");
    try {
      const listaProductos = await listarProductos();
      const listaCategorias = await listarCategorias();
      setProductos(listaProductos);
      // De cada categoría guardamos solo el nombre
      setCategorias(listaCategorias.map((c) => c.nombre));
    } catch {
      setError("No pudimos cargar los productos. Revisa que el backend esté encendido.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  if (cargando) {
    return (
      <div className="container">
        <h1 className="h3 mb-3">Catálogo</h1>
        <SkeletonCatalogo />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="h3 mb-3">Catálogo</h1>
        <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={cargar}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Solo productos activos que cumplen los filtros
  const visibles = filtrarProductos(
    productos.filter((p) => p.activo),
    {
      categoria,
      precioMax,
      porcionesMax: porcionesMax ? Number(porcionesMax) : null,
      busqueda,
    }
  );

  return (
    <div className="container">
      <h1 className="h3 mb-3">Catálogo</h1>

      <Filtros
        categorias={categorias}
        categoria={categoria}
        precioMax={precioMax}
        porcionesMax={porcionesMax}
        busqueda={busqueda}
        onCategoria={setCategoria}
        onPrecioMax={setPrecioMax}
        onPorcionesMax={setPorcionesMax}
        onBusqueda={setBusqueda}
      />

      {visibles.length === 0 ? (
        <p>No hay productos con esos filtros.</p>
      ) : (
        <>
          <p className="small text-secondary">
            {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
          </p>
          <div className="row g-3">
            {visibles.map((producto) => (
              <div key={producto.id} className="col-12 col-md-6 col-lg-4">
                <ProductCard producto={producto} onAgregar={agregar} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
