import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { listarPedidos } from "../../services/orderService";
import { listarProductos } from "../../services/productService";
import { listarCategorias } from "../../services/categoriaService";
import { leerPreferencias, guardarPreferencias } from "../../utils/preferencias";
import { recomendarProductos } from "../../utils/recomendarProductos";
import PerfilDatos from "../../components/PerfilDatos";
import Preferencias from "../../components/Preferencias";
import HistorialPedidos from "../../components/HistorialPedidos";
import ProductCard from "../../components/ProductCard";

// Página del perfil: datos, preferencias, historial y recomendaciones
export default function Perfil() {
  const { usuario } = useAuth();
  const { agregar } = useCart();

  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [preferencias, setPreferencias] = useState(() =>
    leerPreferencias(usuario.id)
  );
  const [error, setError] = useState("");

  // Al abrir la página, pide pedidos, productos y categorías
  useEffect(() => {
    async function cargar() {
      try {
        setPedidos(await listarPedidos());
        setProductos(await listarProductos());
        const lista = await listarCategorias();
        setCategorias(lista.map((c) => c.nombre));
      } catch {
        setError("No pudimos cargar tu información. Intenta más tarde.");
      }
    }
    cargar();
  }, []);

  // Marca o desmarca una categoría favorita y la guarda
  function alternarPreferencia(nombre) {
    const nuevas = preferencias.includes(nombre)
      ? preferencias.filter((c) => c !== nombre)
      : [...preferencias, nombre];
    setPreferencias(nuevas);
    guardarPreferencias(usuario.id, nuevas);
  }

  const recomendados = recomendarProductos(productos, pedidos, preferencias);

  return (
    <div className="container">
      <h1 className="h3 mb-3">Mi perfil</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <PerfilDatos usuario={usuario} />
        </div>
        <div className="col-12 col-md-6">
          <Preferencias
            categorias={categorias}
            elegidas={preferencias}
            onAlternar={alternarPreferencia}
          />
        </div>
      </div>

      <h2 className="h5">Historial de pedidos</h2>
      <HistorialPedidos pedidos={pedidos} />

      <h2 className="h5 mt-4">Recomendados para ti</h2>
      <div className="row g-3">
        {recomendados.map((producto) => (
          <div key={producto.id} className="col-12 col-md-6 col-lg-4">
            <ProductCard producto={producto} onAgregar={agregar} />
          </div>
        ))}
      </div>
    </div>
  );
}
