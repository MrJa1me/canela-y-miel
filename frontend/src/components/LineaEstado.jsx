import { ESTADOS_PEDIDO } from "../services/orderService";
import "./LineaEstado.css";

// Muestra los pasos del pedido y marca en cuál va
function LineaEstado({ estado }) {
  const posicionActual = ESTADOS_PEDIDO.indexOf(estado);

  // Clase de cada paso: hecho (ya pasó), actual (está aquí) o vacía (falta)
  function claseDelPaso(indice) {
    if (indice < posicionActual) return "linea-estado-paso hecho";
    if (indice === posicionActual) return "linea-estado-paso actual";
    return "linea-estado-paso";
  }

  return (
    <ol className="linea-estado">
      {ESTADOS_PEDIDO.map((nombre, indice) => (
        <li key={nombre} className={claseDelPaso(indice)}>
          <span className="linea-estado-punto">{indice + 1}</span>
          {nombre}
        </li>
      ))}
    </ol>
  );
}

export default LineaEstado;
