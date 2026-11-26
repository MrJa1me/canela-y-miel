import { iniciales } from "../utils/avatares";

// Avatar del usuario: su imagen elegida o un círculo con sus iniciales.
function Avatar({ usuario, tamano = 32, className = "" }) {
  const estilo = { width: tamano, height: tamano };

  if (usuario?.avatar) {
    return (
      <img
        src={usuario.avatar}
        alt=""
        className={`rounded-circle object-fit-cover ${className}`}
        style={estilo}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`rounded-circle d-inline-flex align-items-center justify-content-center ${className}`}
      style={{
        ...estilo,
        backgroundColor: "var(--color-primary-soft)",
        color: "var(--color-secondary)",
        fontWeight: 600,
        fontSize: Math.round(tamano * 0.4),
      }}
    >
      {iniciales(usuario?.nombre)}
    </span>
  );
}

export default Avatar;
