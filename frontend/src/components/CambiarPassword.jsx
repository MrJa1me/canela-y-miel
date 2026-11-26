import { useState } from "react";
import { cambiarPassword } from "../services/userService";
import { coincidenContrasenas, tieneLargoMinimo } from "../utils/validators";
import FormField from "./FormField";

// Formulario para cambiar la contraseña del usuario autenticado.
function CambiarPassword() {
  const [datos, setDatos] = useState({ actual: "", nueva: "", confirmar: "" });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.id]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setMensaje("");
    setError("");

    const nuevos = {};
    if (!datos.actual.trim()) {
      nuevos.actual = "Escribe tu contraseña actual";
    }
    if (!tieneLargoMinimo(datos.nueva, 6)) {
      nuevos.nueva = "Mínimo 6 caracteres";
    }
    if (!coincidenContrasenas(datos.nueva, datos.confirmar)) {
      nuevos.confirmar = "Las contraseñas no coinciden";
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);
    try {
      await cambiarPassword({ actual: datos.actual, nueva: datos.nueva });
      setDatos({ actual: "", nueva: "", confirmar: "" });
      setMensaje("Contraseña actualizada.");
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card h-100">
      <div className="card-body">
        <h2 className="h5 mb-3">Cambiar contraseña</h2>

        {mensaje && <div className="alert alert-success py-2 small">{mensaje}</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={enviar} noValidate>
          <FormField id="actual" label="Contraseña actual" type="password"
            autoComplete="current-password" value={datos.actual}
            onChange={manejarCambio} error={errores.actual} />
          <FormField id="nueva" label="Contraseña nueva" type="password"
            autoComplete="new-password" value={datos.nueva}
            onChange={manejarCambio} error={errores.nueva} />
          <FormField id="confirmar" label="Repite la contraseña nueva" type="password"
            autoComplete="new-password" value={datos.confirmar}
            onChange={manejarCambio} error={errores.confirmar} />

          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CambiarPassword;
