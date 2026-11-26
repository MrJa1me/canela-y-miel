import { useState } from "react";

// Panel que se abre y cierra. Se usa en el perfil para agrupar secciones.
function PanelDesplegable({ titulo, abiertoInicial = false, children }) {
  const [abierto, setAbierto] = useState(abiertoInicial);

  return (
    <div className="card tarjeta-perfil mb-3 panel-desplegable">
      <h2 className="h5 mb-0">
        <button
          type="button"
          className="btn btn-link w-100 text-start d-flex justify-content-between align-items-center text-decoration-none text-reset px-3 py-3"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
        >
          <span>{titulo}</span>
          <span aria-hidden="true">{abierto ? "−" : "+"}</span>
        </button>
      </h2>

      {abierto && <div className="card-body pt-0 panel-contenido">{children}</div>}
    </div>
  );
}

export default PanelDesplegable;
