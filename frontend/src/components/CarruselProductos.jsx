import { useEffect, useRef } from "react";
import { Carousel } from "bootstrap";
import { agruparEnFilas } from "../utils/agruparEnFilas";
import ProductCard from "./ProductCard";

// Carrusel de tarjetas de producto con el carrusel de Bootstrap.
function CarruselProductos({ id, productos, onAgregar }) {
  const referencia = useRef(null);
  const instancia = useRef(null);
  const filas = agruparEnFilas(productos);

  useEffect(() => {
    // Con una sola diapositiva no hay nada que mover.
    if (!referencia.current || filas.length < 2) return;

    instancia.current = new Carousel(referencia.current, {
      ride: "carousel",
      interval: 5500,
      pause: "hover",
    });
    return () => instancia.current?.dispose();
  }, [filas.length]);

  if (productos.length === 0) return null;

  return (
    <div id={id} ref={referencia} className="carousel slide carrusel-productos mb-4">
      <div className="carousel-inner">
        {filas.map((fila, indice) => (
          <div key={indice} className={indice === 0 ? "carousel-item active" : "carousel-item"}>
            <div className="row g-3">
              {fila.map((producto) => (
                <div key={producto.id} className="col-12 col-md-4">
                  <ProductCard producto={producto} onAgregar={onAgregar} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filas.length > 1 && (
        <>
          <div
            className="carousel-indicators mb-0"
            style={{ position: "static", marginTop: "1rem" }}
          >
            {filas.map((_, indice) => (
              <button
                key={indice}
                type="button"
                onClick={() => instancia.current?.to(indice)}
                className={indice === 0 ? "active" : ""}
                aria-label={`Grupo ${indice + 1}`}
              />
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            onClick={() => instancia.current?.prev()}
            aria-label="Anterior"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={() => instancia.current?.next()}
            aria-label="Siguiente"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}

export default CarruselProductos;
