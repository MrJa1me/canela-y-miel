import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { crearPedido } from "../../services/orderService";
import { validarCupon } from "../../services/cuponService";
import { beneficiosDeUsuario, esTorta, hoyISO } from "../../utils/descuentos";
import { calcularTotales } from "../../utils/calcularTotales";
import {
  esCampoObligatorio,
  esTelefonoChilenoValido,
  tieneLargoMinimo,
} from "../../utils/validators";
import FormField from "../../components/FormField";
import ResumenCarrito from "../../components/ResumenCarrito";

// Página de pago: datos de entrega, mensaje de la torta, resumen y creación del pedido
export default function Checkout() {
  const { usuario } = useAuth();
  const { items, vaciar } = useCart();
  const navegar = useNavigate();

  const beneficios = beneficiosDeUsuario(usuario);

  const [datos, setDatos] = useState({
    nombre: usuario.nombre,
    telefono: "",
    direccion: "",
    fechaEntrega: hoyISO(),
    cupon: "",
    mensaje: "",
  });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState("");
  const [avisoCupon, setAvisoCupon] = useState("");
  const [cuponPorcentaje, setCuponPorcentaje] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const hayTorta = items.some(esTorta);

  // El resumen debe dar lo mismo que el backend: mismos beneficios y cupón validado
  const totales = calcularTotales(items, { ...beneficios, cuponPorcentaje });

  // Guarda lo que se escribe en el campo que cambió (usa el id como clave)
  function manejarCambio(evento) {
    // Si cambia el cupón, el porcentaje anterior ya no sirve
    if (evento.target.id === "cupon") {
      setCuponPorcentaje(0);
      setAvisoCupon("");
    }
    setDatos({ ...datos, [evento.target.id]: evento.target.value });
  }

  // Pide al backend el porcentaje del cupón cuando el cliente sale del campo
  async function revisarCupon() {
    const codigo = datos.cupon.trim();
    if (!codigo) {
      setCuponPorcentaje(0);
      setAvisoCupon("");
      return;
    }

    try {
      const cupon = await validarCupon(codigo);
      setCuponPorcentaje(cupon.porcentaje);
      setAvisoCupon(`Cupón ${cupon.codigo}: ${cupon.porcentaje}% de descuento`);
    } catch {
      setCuponPorcentaje(0);
      setAvisoCupon("Cupón no válido o inactivo");
    }
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
    if (!datos.fechaEntrega) {
      nuevos.fechaEntrega = "Elige la fecha de entrega";
    } else if (datos.fechaEntrega < hoyISO()) {
      nuevos.fechaEntrega = "La fecha no puede ser pasada";
    }
    if (datos.mensaje.length > 200) {
      nuevos.mensaje = "Máximo 200 caracteres";
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
      const mensaje = datos.mensaje.trim() || null;
      // El servidor recalcula precios, descuentos y stock
      const pedido = await crearPedido({
        clienteId: usuario.id,
        cuponCodigo: datos.cupon.trim() || null,
        fechaEntrega: datos.fechaEntrega,
        direccion: datos.direccion.trim(),
        telefono: datos.telefono.trim(),
        detalles: items.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          mensaje: esTorta(item) ? mensaje : null,
        })),
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
            <FormField id="fechaEntrega" label="Fecha de entrega" type="date"
              value={datos.fechaEntrega} onChange={manejarCambio}
              error={errores.fechaEntrega} min={hoyISO()} required />
            <FormField id="cupon" label="Cupón (opcional)" value={datos.cupon}
              onChange={manejarCambio} onBlur={revisarCupon}
              error={errores.cupon} placeholder="Ej: MIEL10" />
            {avisoCupon && (
              <p className="small text-secondary">{avisoCupon}</p>
            )}

            {hayTorta && (
              <FormField id="mensaje" label="Mensaje para la torta (opcional)"
                value={datos.mensaje} onChange={manejarCambio}
                error={errores.mensaje} placeholder="Feliz cumpleaños, Ana"
                maxLength={200} />
            )}

            <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
              {enviando ? "Confirmando…" : "Confirmar pedido"}
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5 mt-4 mt-lg-0">
          <ResumenCarrito
            subtotal={totales.subtotal}
            descuento={totales.descuento}
            envio={totales.envio}
            total={totales.total}
            etiquetaDescuento="Descuentos aplicados"
          />
          <p className="small text-secondary mt-2">
            El descuento se confirma con el servidor al crear el pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
