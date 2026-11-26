import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import Carrusel from "../../components/Carrusel";
import CarruselProductos from "../../components/CarruselProductos";

// Imágenes que ya están en public/img
const DIAPOSITIVAS = [
  {
    imagen: "/img/chocolate.jpg",
    titulo: "Pastelería artesanal",
    texto: "Tortas y postres hechos con cariño, como en casa.",
  },
  {
    imagen: "/img/cheesecake.jpg",
    titulo: "Sabores de temporada",
    texto: "Frutos rojos, canela y miel en cada receta.",
  },
  {
    imagen: "/img/macarons.jpg",
    titulo: "Para regalar",
    texto: "Cajas de macarons listas para sorprender.",
  },
];

// Página de inicio: carrusel, productos destacados y datos del negocio
export default function Inicio() {
  const { agregar } = useCart();
  const [destacados, setDestacados] = useState([]);

  // Al abrir la página, toma hasta 9 productos activos para el carrusel
  useEffect(() => {
    async function cargar() {
      try {
        const lista = await listarProductos();
        setDestacados(lista.filter((p) => p.activo).slice(0, 9));
      } catch {
        // Si falla, solo no se muestran los destacados
        setDestacados([]);
      }
    }
    cargar();
  }, []);

  return (
    <div className="container">
      <Carrusel id="carrusel-inicio" diapositivas={DIAPOSITIVAS} />

      <h1 className="h3 mb-3">Bienvenidos a Canela &amp; Miel</h1>
      <p>
        Pastelería online con despacho a domicilio por $8.000. Los clientes
        Premium tienen 10% de descuento en sus productos.
      </p>

      <h2 className="h5 mt-4">Nuestros favoritos</h2>
      <CarruselProductos
        id="carrusel-productos"
        productos={destacados}
        onAgregar={agregar}
      />

      <Link to="/catalogo" className="btn btn-primary">
        Ver todo el catálogo
      </Link>
    </div>
  );
}
