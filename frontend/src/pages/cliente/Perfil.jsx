import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { listarPedidos } from "../../services/orderService";
import { listarProductos } from "../../services/productService";
import { listarCategorias } from "../../services/categoriaService";
import { actualizarMiPerfil } from "../../services/userService";
import { beneficiosDeUsuario } from "../../utils/descuentos";
import { recomendarProductos } from "../../utils/recomendarProductos";
import PerfilDatos from "../../components/PerfilDatos";
import Preferencias from "../../components/Preferencias";
import CambiarPassword from "../../components/CambiarPassword";
import HistorialPedidos from "../../components/HistorialPedidos";
import ProductCard from "../../components/ProductCard";

// Datos del usuario que viajan al backend (por ejemplo, al guardar una preferencia).
function datosDePerfil(usuario, cambios = {}) {
  return {
    nombre: usuario.nombre,
    telefono: usuario.telefono ?? "",
    direccion: usuario.direccion ?? "",
    preferencias: usuario.preferencias ?? [],
    avatar: usuario.avatar ?? null,
    ...cambios,
  };
}

// Página del perfil: datos, preferencias, beneficios, contraseña, historial y recomendaciones
export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const { agregar } = useCart();

  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  const preferencias = usuario.preferencias ?? [];
  const beneficios = beneficiosDeUsuario(usuario);
  const sinBeneficios =
    !beneficios.esPremium &&
    !beneficios.tieneFelices50 &&
    !beneficios.esMayorDe50 &&
    !beneficios.correoInstitucional;

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

  // Guarda los datos editados y refresca la sesión (NavBar incluido)
  async function guardarDatos(datos) {
    const actualizado = await actualizarMiPerfil(datos);
    actualizarUsuario(actualizado);
  }

  // Las preferencias se guardan al instante, igual que antes
  async function alternarPreferencia(nombre) {
    const nuevas = preferencias.includes(nombre)
      ? preferencias.filter((c) => c !== nombre)
      : [...preferencias, nombre];

    try {
      setError("");
      const actualizado = await actualizarMiPerfil(
        datosDePerfil(usuario, { preferencias: nuevas })
      );
      actualizarUsuario(actualizado);
    } catch {
      setError("No pudimos guardar tus preferencias. Intenta de nuevo.");
    }
  }

  const recomendados = recomendarProductos(productos, pedidos, preferencias);

  return (
    <div className="container">
      <h1 className="h3 mb-3">Mi perfil</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <PerfilDatos usuario={usuario} onGuardar={guardarDatos} />
        </div>
        <div className="col-12 col-md-6">
          <Preferencias
            categorias={categorias}
            elegidas={preferencias}
            onAlternar={alternarPreferencia}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Mis beneficios</h2>
              <ul className="list-unstyled mb-0 small">
                {beneficios.esMayorDe50 && (
                  <li>50% de descuento en todos los productos por tener más de 50 años.</li>
                )}
                {beneficios.tieneFelices50 && (
                  <li>10% de descuento de por vida por registrarte con FELICES50.</li>
                )}
                {beneficios.esPremium && (
                  <li>10% de descuento de cliente Premium.</li>
                )}
                {beneficios.correoInstitucional && (
                  <li>Torta gratis el día de tu cumpleaños (correo institucional Duoc).</li>
                )}
                {sinBeneficios && (
                  <li className="text-secondary">
                    Aún no tienes descuentos activos.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <CambiarPassword />
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
