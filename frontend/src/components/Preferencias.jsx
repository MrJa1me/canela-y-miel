// Casillas para elegir las categorías favoritas del cliente
function Preferencias({ categorias, elegidas, onAlternar }) {
  return (
    <div className="card h-100 tarjeta-perfil">
      <div className="card-body">
        <h2 className="h5 mb-3">Mis preferencias</h2>
        <p className="small text-secondary">
          Elige tus categorías favoritas y las usamos para recomendarte.
        </p>
        {categorias.map((nombre, indice) => (
          <div key={nombre} className="form-check">
            <input
              id={`preferencia-${indice}`}
              type="checkbox"
              className="form-check-input"
              checked={elegidas.includes(nombre)}
              onChange={() => onAlternar(nombre)}
            />
            <label htmlFor={`preferencia-${indice}`} className="form-check-label">
              {nombre}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Preferencias;
