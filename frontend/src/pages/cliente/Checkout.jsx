import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { crearPedido } from "../../services/orderService";
import {
  esCampoObligatorio,
  esTelefonoChilenoValido,
  tieneLargoMinimo,
} from "../../utils/validators";
import FormField from "../../components/FormField";
import ResumenCarrito from "../../components/ResumenCarrito";

// Página de pago: datos de entrega, resumen y creación del pedido
export default function Checkout() {
  const { usuario } = useAuth();
  const { items, subtotal, descuento, envio, total, vaciar } = useCart();
  const navegar = useNavigate();

  const [datos, setDatos] = useState({
    nombre: usuario.nombre,
    telefono: "",
    direccion: "",
    cupon: "",
  });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Guarda lo que se escribe en el campo que cambió (usa el id como clave)
  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.id]: evento.target.value });
  }

  // Revisa los datos de entrega y devuelve los errores encontrados
  function validar() {
    const nuevos = {};
    if (!esCampoObligatorio(datos.nombre)) {
      nuevos.nombre = "El nombre es obligatorio";
    }
    if (!esTelefonoChilenoValido(datos.telefono.trim())) {
      nuevos.telefono = "Debe tener 9 dígitos y empezar con 9";
    }
    if (!tieneLargoMinimo(datos.direccion.trim(), 5)) {
      nuevos.direccion = "Escribe tu dirección completa";
    }
    return nuevos;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      // El servidor recalcula precios, descuentos y stock
      const pedido = await crearPedido({
        clienteId: usuario.id,
        cuponCodigo: datos.cupon.trim() || null,
        detalles: items.map((i) => ({ productoId: i.id, cantidad: i.cantidad })),
      });
      vaciar();
      navegar("/confirmacion", { state: { pedido }, replace: true });
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="h3 mb-3">Checkout</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="h3 mb-3">Checkout</h1>

      <div className="row">
        <div className="col-12 col-lg-7">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={enviar} noValidate>
            <FormField id="nombre" label="Nombre de quien recibe" value={datos.nombre}
              onChange={manejarCambio} error={errores.nombre} />
            <FormField id="telefono" label="Teléfono" value={datos.telefono}
              onChange={manejarCambio} error={errores.telefono} placeholder="912345678" />
            <FormField id="direccion" label="Dirección de entrega" value={datos.direccion}
              onChange={manejarCambio} error={errores.direccion} />
            <FormField id="cupon" label="Cupón (opcional)" value={datos.cupon}
              onChange={manejarCambio} placeholder="Ej: MIEL10" />
            <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
              {enviando ? "Confirmando…" : "Confirmar pedido"}
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5 mt-4 mt-lg-0">
          <ResumenCarrito subtotal={subtotal} descuento={descuento} envio={envio} total={total} />
          <p className="small text-secondary mt-2">
            Si tienes un cupón válido, el descuento se aplica al confirmar.
          </p>
        </div>
      </div>
    </div>
  );
}
