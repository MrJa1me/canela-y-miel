import { useEffect, useState } from "react";
import { listarProductos } from "../../services/productService";
import { listarCategorias } from "../../services/categoriaService";
import { useCart } from "../../context/CartContext";
import { filtrarProductos } from "../../utils/filtrarProductos";
import ProductCard from "../../components/ProductCard";
import Filtros from "../../components/Filtros";

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

  // Al abrir la página, pide productos y categorías al backend
  useEffect(() => {
    async function cargar() {
      try {
        const listaProductos = await listarProductos();
        const listaCategorias = await listarCategorias();
        setProductos(listaProductos);
        // De cada categoría guardamos solo el nombre
        setCategorias(listaCategorias.map((c) => c.nombre));
      } catch {
        setError("No pudimos cargar los productos. Intenta más tarde.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return <div className="container">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  // Solo productos activos que cumplen los filtros
  const visibles = filtrarProductos(
    productos.filter((p) => p.activo),
    categoria,
    precioMax
  );

  return (
    <div className="container">
      <h1 className="h3 mb-3">Catálogo</h1>

      <Filtros
        categorias={categorias}
        categoria={categoria}
        precioMax={precioMax}
        onCategoria={setCategoria}
        onPrecioMax={setPrecioMax}
      />

      {visibles.length === 0 ? (
        <p>No hay productos con esos filtros.</p>
      ) : (
        <div className="row g-3">
          {visibles.map((producto) => (
            <div key={producto.id} className="col-12 col-md-6 col-lg-4">
              <ProductCard producto={producto} onAgregar={agregar} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}