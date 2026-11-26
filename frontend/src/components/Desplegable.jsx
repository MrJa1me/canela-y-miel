import { useEffect, useRef, useState } from "react";

// Menú desplegable propio (no depende del JavaScript de Bootstrap).
// Se cierra al hacer clic fuera, al presionar Escape o al elegir una opción.
function Desplegable({ boton, children, claseBoton = "btn btn-outline-secondary", alineadoDerecha = false, claseMenu = "" }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    function alClicFuera(evento) {
      if (contenedor.current && !contenedor.current.contains(evento.target)) {
        setAbierto(false);
      }
    }

    function alEscape(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
      }
    }

    document.addEventListener("pointerdown", alClicFuera);
    document.addEventListener("keydown", alEscape);
    return () => {
      document.removeEventListener("pointerdown", alClicFuera);
      document.removeEventListener("keydown", alEscape);
    };
  }, [abierto]);

  return (
    <div className="dropdown" ref={contenedor}>
      <button
        type="button"
        className={`${claseBoton} dropdown-toggle`}
        aria-expanded={abierto}
        aria-haspopup="menu"
        onClick={() => setAbierto(!abierto)}
      >
        {boton}
      </button>

      <div
        className={`dropdown-menu ${alineadoDerecha ? "dropdown-menu-end" : ""} ${abierto ? "show" : ""} ${claseMenu}`}
        onClick={() => setAbierto(false)}
      >
        {children}
      </div>
    </div>
  );
}

export default Desplegable;
