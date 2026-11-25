// Tarjeta con los datos del cliente
function PerfilDatos({ usuario }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h2 className="h5 mb-3">Mis datos</h2>
        <p className="mb-1">
          <strong>Nombre:</strong> {usuario.nombre}
        </p>
        <p className="mb-1">
          <strong>Correo:</strong> {usuario.correo}
        </p>
        <p className="mb-0">
          <strong>Tipo de cliente:</strong>{" "}
          {usuario.premium ? "Premium (10% de descuento)" : "Normal"}
        </p>
      </div>
    </div>
  );
}

export default PerfilDatos;
