import { useState } from "react";
import { AVATARES } from "../utils/avatares";
import { esCampoObligatorio, esTelefonoChilenoValido } from "../utils/validators";
import Avatar from "./Avatar";
import FormField from "./FormField";

// Tarjeta con los datos del cliente y su modo de edición.
function PerfilDatos({ usuario, onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  function abrirEdicion() {
    setDatos({
      nombre: usuario.nombre,
      telefono: usuario.telefono ?? "",
      direccion: usuario.direccion ?? "",
      preferencias: usuario.preferencias ?? [],
      avatar: usuario.avatar ?? null,
    });
    setErrores({});
    setMensaje("");
    setEditando(true);
  }

  function cancelar() {
    setEditando(false);
    setErrores({});
  }

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.id]: evento.target.value });
  }

  async function guardar(evento) {
    evento.preventDefault();
    setMensaje("");

    const nuevos = {};
    if (!esCampoObligatorio(datos.nombre)) {
      nuevos.nombre = "El nombre es obligatorio";
    }
    if (datos.telefono.trim() && !esTelefonoChilenoValido(datos.telefono.trim())) {
      nuevos.telefono = "Debe tener 9 dígitos y empezar con 9";
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);
    try {
      await onGuardar({
        ...datos,
        nombre: datos.nombre.trim(),
        telefono: datos.telefono.trim(),
        direccion: datos.direccion.trim(),
      });
      setEditando(false);
      setMensaje("Datos guardados.");
    } catch (fallo) {
      setMensaje(fallo.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card h-100 tarjeta-perfil">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="h5 mb-0">Mis datos</h2>
          {!editando && (
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={abrirEdicion}>
              Editar
            </button>
          )}
        </div>

        {mensaje && <div className="alert alert-info py-2 small">{mensaje}</div>}

        {!editando ? (
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
            <Avatar usuario={usuario} tamano={88} />
            <div>
              <h3 className="h4 mb-1">{usuario.nombre}</h3>
              <p className="small text-secondary mb-2">{usuario.correo}</p>
              <p className="mb-1"><strong>Teléfono:</strong> {usuario.telefono || "Sin registrar"}</p>
              <p className="mb-0"><strong>Dirección:</strong> {usuario.direccion || "Sin registrar"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={guardar} noValidate>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Avatar usuario={{ ...usuario, avatar: datos.avatar }} tamano={56} />
              <span className="small text-secondary">Vista previa del avatar</span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {AVATARES.map((ruta) => (
                <button
                  key={ruta}
                  type="button"
                  className={`btn p-0 rounded-circle ${datos.avatar === ruta ? "border border-2 border-primary" : "border-0"}`}
                  onClick={() => setDatos({ ...datos, avatar: ruta })}
                  aria-label="Elegir avatar"
                >
                  <img src={ruta} alt="" width="40" height="40" className="rounded-circle" />
                </button>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setDatos({ ...datos, avatar: null })}
              >
                Sin avatar
              </button>
            </div>

            <FormField id="nombre" label="Nombre" value={datos.nombre}
              onChange={manejarCambio} error={errores.nombre} />
            <FormField id="telefono" label="Teléfono" value={datos.telefono}
              onChange={manejarCambio} error={errores.telefono} placeholder="912345678" />
            <FormField id="direccion" label="Dirección" value={datos.direccion}
              onChange={manejarCambio} />

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? "Guardando…" : "Guardar"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PerfilDatos;
