import { useEffect, useRef } from "react";
import { Carousel } from "bootstrap";
import "./Carrusel.css";

// Carrusel de imágenes con título y texto (usa el carrusel de Bootstrap)
function Carrusel({ id, diapositivas }) {
  const referencia = useRef(null);

  // Al aparecer en pantalla, activa el cambio automático cada 4 segundos
  useEffect(() => {
    const instancia = new Carousel(referencia.current, {
      ride: "carousel",
      interval: 4000,
    });
    // Al salir de la página, lo apaga para no dejar nada corriendo
    return () => instancia.dispose();
  }, []);

  return (
    <div id={id} ref={referencia} className="carousel slide mb-4">
      <div className="carousel-inner rounded-3">
        {diapositivas.map((diapositiva, indice) => (
          <div
            key={diapositiva.titulo}
            className={indice === 0 ? "carousel-item active" : "carousel-item"}
          >
            <img
              src={diapositiva.imagen}
              className="d-block w-100 carrusel-imagen"
              alt={diapositiva.titulo}
            />
            <div className="carousel-caption carrusel-texto">
              <h2 className="h5 text-white">{diapositiva.titulo}</h2>
              <p className="mb-0">{diapositiva.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
        aria-label="Anterior"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
        aria-label="Siguiente"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Carrusel;
