import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listarPedidos } from "../../services/orderService";
import LineaEstado from "../../components/LineaEstado";

// Página de seguimiento: elige un pedido y muestra en qué paso va
export default function Seguimiento() {
  const ubicacion = useLocation();

  const [pedidos, setPedidos] = useState([]);
  const [elegidoId, setElegidoId] = useState(ubicacion.state?.pedidoId ?? null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Al abrir la página, pide los pedidos (el más nuevo primero)
  useEffect(() => {
    async function cargar() {
      try {
        const lista = await listarPedidos();
        setPedidos([...lista].sort((a, b) => b.id - a.id));
      } catch {
        setError("No pudimos cargar tus pedidos. Intenta más tarde.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return <div className="container">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  if (pedidos.length === 0) {
    return (
      <div className="container">
        <h1 className="h3 mb-3">Seguimiento de pedido</h1>
        <p>Aún no tienes pedidos.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  // Si no eligió ninguno (o no existe), muestra el más reciente
  const pedido = pedidos.find((p) => p.id === elegidoId) ?? pedidos[0];

  return (
    <div className="container">
      <h1 className="h3 mb-3">Seguimiento de pedido</h1>

      <div className="row">
        <div className="col-12 col-md-6 col-lg-4 mb-3">
          <label htmlFor="pedido" className="form-label">
            Pedido
          </label>
          <select
            id="pedido"
            className="form-select"
            value={pedido.id}
            onChange={(e) => setElegidoId(Number(e.target.value))}
          >
            {pedidos.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {new Date(p.fecha).toLocaleDateString("es-CL")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p>
        Estado actual: <strong>{pedido.estado}</strong>
      </p>
      <LineaEstado estado={pedido.estado} />
    </div>
  );
}
