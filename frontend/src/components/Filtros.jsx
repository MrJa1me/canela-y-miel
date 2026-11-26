// Controles para filtrar: categoría y precio máximo
function Filtros({ categorias, categoria, precioMax, onCategoria, onPrecioMax }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-6">
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

      <div className="col-12 col-md-6">
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