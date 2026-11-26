import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos } from "../../services/productService";
import { listarCategorias } from "../../services/categoriaService";
import { useCart } from "../../context/CartContext";
import { useRevelar } from "../../hooks/useRevelar";
import Carrusel from "../../components/Carrusel";
import CarruselProductos from "../../components/CarruselProductos";

// Promociones del hero
const DIAPOSITIVAS = [
  {
    imagen: "/img/chocolate.jpg",
    titulo: "50% para mayores de 50",
    texto: "Regístrate con tu fecha de nacimiento y recibe la mitad de descuento en todos los productos.",
  },
  {
    imagen: "/img/cheesecake.jpg",
    titulo: "Código FELICES50",
    texto: "Regístrate con FELICES50 y mantén 10% de descuento de por vida.",
  },
  {
    imagen: "/img/tres_leches.jpg",
    titulo: "50 años de tradición",
    texto: "Celebramos medio siglo endulzando celebraciones. En 1995 ayudamos a crear la torta más grande del mundo.",
  },
];

const BENEFICIOS = [
  { titulo: "50%", texto: "Para mayores de 50 años, en todos los productos." },
  { titulo: "FELICES50", texto: "10% de descuento de por vida al registrarte con el código." },
  { titulo: "$8.000", texto: "Despacho a domicilio con la fecha de entrega que elijas." },
  {
    titulo: "Cumpleaños",
    texto: "Torta más barata gratis para estudiantes Duoc, con otro producto en el pedido.",
  },
];

// Contenido de demostración para la vista previa del blog
const RECETAS = [
  {
    imagen: "/img/pancakes.png",
    titulo: "Bizcocho esponjoso: 3 claves",
    texto: "Temperatura, batido y reposo: la diferencia está en los detalles.",
  },
  {
    imagen: "/img/macarons.jpg",
    titulo: "Cómo conservar macarons",
    texto: "Guárdalos en frío y atempera antes de servir para recuperar la textura.",
  },
  {
    imagen: "/img/cheesecake.jpg",
    titulo: "Repostería sin gluten",
    texto: "Harinas de almendra y arroz para un cheesecake que no pierde cremosidad.",
  },
];

// Página de inicio: promociones, categorías, favoritos, historia y blog
export default function Inicio() {
  const { agregar } = useCart();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useRevelar();

  // Al abrir la página, pide el catálogo completo y las categorías
  useEffect(() => {
    async function cargar() {
      try {
        const [lista, listaCategorias] = await Promise.all([
          listarProductos(),
          listarCategorias(),
        ]);
        setProductos(lista.filter((p) => p.activo));
        setCategorias(listaCategorias.map((c) => c.nombre));
      } catch {
        // Si falla, la página sigue funcionando sin catálogo
        setProductos([]);
        setCategorias([]);
      }
    }
    cargar();
  }, []);

  const destacados = productos.slice(0, 9);

  return (
    <div className="container">
      <Carrusel id="carrusel-inicio" diapositivas={DIAPOSITIVAS} />

      <section className="text-center mb-5 revelar">
        <h1 className="display-6">Bienvenidos a Canela &amp; Miel</h1>
        <p className="lead">
          Tortas artesanales, postres y opciones sin azúcar, sin gluten y veganas.
        </p>
        <div className="d-flex justify-content-center gap-2 flex-wrap">
          <Link to="/catalogo" className="btn btn-primary">
            Ver catálogo
          </Link>
          <Link to="/registro" className="btn btn-outline-primary">
            Crear cuenta
          </Link>
        </div>
      </section>

      <section className="mb-5 revelar">
        <h2 className="h3 mb-3">Nuestras categorías</h2>
        {/* Tarjetas de categorías del Home. Fondo: .tarjeta-categoria en global.css */}
        <div className="row g-3">
          {categorias.map((nombre) => {
            const cantidad = productos.filter((p) => p.categoria === nombre).length;
            return (
              <div className="col-6 col-md-3" key={nombre}>
                <Link
                  to={`/catalogo?categoria=${encodeURIComponent(nombre)}`}
                  className="card h-100 tarjeta-hover tarjeta-categoria text-decoration-none"
                >
                  <div className="card-body">
                    <h3 className="h6 mb-1">{nombre}</h3>
                    <p className="small text-secondary mb-0">
                      {cantidad} {cantidad === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-5 revelar">
        <h2 className="h3 mb-3">Nuestros favoritos</h2>
        <CarruselProductos
          id="carrusel-productos"
          productos={destacados}
          onAgregar={agregar}
        />
      </section>

      <section className="mb-5 revelar">
        <h2 className="h3 mb-3">Beneficios y promociones</h2>
        {/* Tarjetas de beneficios del Home. Fondo: .tarjeta-beneficio en global.css */}
        <div className="row g-3">
          {BENEFICIOS.map((beneficio) => (
            <div className="col-12 col-sm-6 col-lg-3" key={beneficio.titulo}>
              <div className="card h-100 tarjeta-hover tarjeta-beneficio">
                <div className="card-body">
                  <h3 className="h4 mb-2">{beneficio.titulo}</h3>
                  <p className="mb-0 small">{beneficio.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="row g-4 align-items-center mb-5 revelar">
        <div className="col-12 col-md-6">
          <img
            src="/img/tres_leches.jpg"
            alt="Torta de tres leches de la casa"
            className="img-fluid rounded-3"
            loading="lazy"
          />
        </div>
        <div className="col-12 col-md-6">
          <h2 className="h3">Nuestra historia</h2>
          <p>
            Llevamos 50 años preparando recetas de familia, con la misma dedicación
            del primer día. En 1995 participamos en la creación de la torta más
            grande del mundo, un récord Guinness que sigue siendo parte de nuestra
            historia.
          </p>
          <p className="mb-0">
            Cada torta se hace a mano, con ingredientes frescos y el tiempo que
            necesita. La nostalgia y la tradición están en cada receta.
          </p>
        </div>
      </section>

      <section className="card border-0 mb-5 revelar">
        <div className="card-body p-4">
          <h2 className="h3">Impacto comunitario</h2>
          <p className="mb-0">
            Cada compra apoya la formación de nuevos talentos en gastronomía:
            trabajamos con estudiantes en talleres, recetas y celebraciones de la
            comunidad local.
          </p>
        </div>
      </section>

      <section className="mb-5 revelar">
        <h2 className="h3 mb-1">Recetas y consejos</h2>
        <p className="small text-secondary">Contenido de demostración.</p>
        {/* Tarjetas del blog del Home. Fondo: .tarjeta-blog en global.css */}
        <div className="row g-3">
          {RECETAS.map((receta) => (
            <div className="col-12 col-md-4" key={receta.titulo}>
              <article className="card h-100 tarjeta-hover tarjeta-blog">
                <img
                  src={receta.imagen}
                  alt={receta.titulo}
                  className="card-img-top imagen-tarjeta"
                  loading="lazy"
                />
                <div className="card-body">
                  <h3 className="h6">{receta.titulo}</h3>
                  <p className="mb-0 small">{receta.texto}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section
        className="text-center p-4 p-md-5 rounded-4 mb-4 revelar"
        style={{ backgroundColor: "var(--color-primary-soft)" }}
      >
        <h2 className="h3">Regístrate con FELICES50</h2>
        <p className="mb-3">
          10% de descuento de por vida y torta gratis en tu cumpleaños si estudias
          en Duoc.
        </p>
        <Link to="/registro" className="btn btn-primary">
          Crear mi cuenta
        </Link>
      </section>
    </div>
  );
}
