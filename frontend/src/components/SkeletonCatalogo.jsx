// Marcadores de carga con la forma de las tarjetas de producto.
export default function SkeletonCatalogo({ filas = 2 }) {
  return (
    <div className="row g-3" aria-hidden="true">
      {Array.from({ length: filas * 3 }, (_, indice) => (
        <div className="col-12 col-md-6 col-lg-4" key={indice}>
          <div className="card h-100 placeholder-glow">
            <div className="placeholder w-100" style={{ height: 180 }} />
            <div className="card-body">
              <p className="placeholder col-5 mb-2" />
              <p className="placeholder col-8 mb-2" />
              <p className="placeholder col-4 mb-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
