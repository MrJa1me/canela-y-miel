// Controles para filtrar: búsqueda, categoría, porciones y precio máximo
function Filtros({
  categorias,
  categoria,
  precioMax,
  porcionesMax,
  busqueda,
  onCategoria,
  onPrecioMax,
  onPorcionesMax,
  onBusqueda,
}) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <label htmlFor="filtro-busqueda" className="form-label">
          Buscar
        </label>
        <input
          id="filtro-busqueda"
          type="search"
          className="form-control"
          placeholder="Nombre o código (ej: TC001)"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
        />
      </div>

      <div className="col-6 col-md-3">
        <label htmlFor="filtro-categoria" className="form-label">
          Categoría
        </label>
        <select
          id="filtro-categoria"
          className="form-select"
          value={categoria}
          onChange={(e) => onCategoria(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="col-6 col-md-2">
        <label htmlFor="filtro-porciones" className="form-label">
          Tamaño
        </label>
        <select
          id="filtro-porciones"
          className="form-select"
          value={porcionesMax}
          onChange={(e) => onPorcionesMax(e.target.value)}
        >
          <option value="">Cualquiera</option>
          {[1, 8, 12, 16, 20, 24, 30, 40].map((numero) => (
            <option key={numero} value={numero}>
              Hasta {numero} porciones
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md-3">
        <label htmlFor="filtro-precio" className="form-label">
          Precio máximo: ${precioMax.toLocaleString("es-CL")}
        </label>
        <input
          id="filtro-precio"
          type="range"
          className="form-range"
          min="0"
          max="60000"
          step="1000"
          value={precioMax}
          onChange={(e) => onPrecioMax(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Filtros;
