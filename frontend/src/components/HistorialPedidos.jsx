import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

// Tabla con los pedidos anteriores del cliente
function HistorialPedidos({ pedidos }) {
  if (pedidos.length === 0) {
    return <p>Aún no tienes pedidos.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>N°</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>#{pedido.id}</td>
              <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
              <td>{pedido.estado}</td>
              <td>{formatPrice(pedido.total)}</td>
              <td>
                <Link
                  to="/seguimiento"
                  state={{ pedidoId: pedido.id }}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Seguir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialPedidos;
