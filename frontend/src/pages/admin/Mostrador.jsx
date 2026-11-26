import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarProductos } from "../../services/productService";
import { listarUsuarios } from "../../services/userService";
import { crearPedido } from "../../services/orderService";
import { validarCupon } from "../../services/cuponService";
import { beneficiosDeUsuario, hoyISO } from "../../utils/descuentos";
import { calcularTotales } from "../../utils/calcularTotales";
import { esTelefonoChilenoValido, tieneLargoMinimo } from "../../utils/validators";
import { formatPrice } from "../../utils/formatPrice";
import FormField from "../../components/FormField";

// Pedidos tomados en el local (POS). Solo para ADMIN.
export default function Mostrador() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [items, setItems] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("local");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState(hoyISO());
  const [cupon, setCupon] = useState("");
  const [cuponPorcentaje, setCuponPorcentaje] = useState(0);
  const [avisoCupon, setAvisoCupon] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const [listaProductos, listaUsuarios] = await Promise.all([
          listarProductos(),
          listarUsuarios(),
        ]);
        setProductos(listaProductos.filter((p) => p.activo));

        const soloClientes = listaUsuarios.filter((u) => u.rol === "CLIENTE");
        setClientes(soloClientes);
        const mostrador =
          soloClientes.find((u) => u.correo === "mostrador@canelaymiel.cl") ??
          soloClientes[0];
        if (mostrador) setClienteId(String(mostrador.id));
      } catch {
        setError("Ocurrió un error al cargar los datos del mostrador.");
      }
    }
    cargar();
  }, []);

  const cliente = clientes.find((c) => String(c.id) === clienteId) ?? null;
  const retiro = tipoEntrega === "local";

  const totales = calcularTotales(items, {
    ...beneficiosDeUsuario(cliente),
    cuponPorcentaje,
  });
  const envio = retiro ? 0 : totales.envio;
  const total = totales.subtotal - totales.descuento + envio;

  const visibles = productos.filter((producto) => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return true;
    return (
      producto.nombre.toLowerCase().includes(texto) ||
      (producto.codigo ?? "").toLowerCase().includes(texto)
    );
  });

  function agregar(producto) {
    setExito("");
    setItems((actual) => {
      const existe = actual.find((item) => item.id === producto.id);
      if (existe) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [
        ...actual,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
        },
      ];
    });
  }

  function quitar(id) {
    setItems((actual) => actual.filter((item) => item.id !== id));
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) {
      quitar(id);
      return;
    }
    setItems((actual) =>
      actual.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  }

  function manejarCupon(evento) {
    setCupon(evento.target.value);
    setCuponPorcentaje(0);
    setAvisoCupon("");
  }

  async function revisarCupon() {
    const codigo = cupon.trim();
    if (!codigo) {
      setCuponPorcentaje(0);
      setAvisoCupon("");
      return;
    }

    try {
      const encontrado = await validarCupon(codigo);
      setCuponPorcentaje(encontrado.porcentaje);
      setAvisoCupon(`Cupón ${encontrado.codigo}: ${encontrado.porcentaje}% de descuento`);
    } catch {
      setCuponPorcentaje(0);
      setAvisoCupon("Cupón no válido o inactivo");
    }
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    setExito("");

    if (items.length === 0) {
      setError("Agrega al menos un producto.");
      return;
    }
    if (!clienteId) {
      setError("Elige el cliente.");
      return;
    }
    if (!fechaEntrega) {
      setError("Elige la fecha de entrega.");
      return;
    }
    if (!retiro) {
      if (!tieneLargoMinimo(direccion.trim(), 5)) {
        setError("Escribe la dirección de entrega.");
        return;
      }
      if (!esTelefonoChilenoValido(telefono.trim())) {
        setError("El teléfono debe tener 9 dígitos y empezar con 9.");
        return;
      }
    }

    setEnviando(true);
    try {
      const pedido = await crearPedido({
        clienteId: Number(clienteId),
        cuponCodigo: cupon.trim() || null,
        fechaEntrega,
        direccion: retiro ? "Retiro en el local" : direccion.trim(),
        telefono: retiro ? "" : telefono.trim(),
        retiro,
        detalles: items.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          mensaje: null,
        })),
      });

      setExito(`Pedido #${pedido.id} creado por ${formatPrice(pedido.total)}.`);
      setItems([]);
      setCupon("");
      setCuponPorcentaje(0);
      setAvisoCupon("");
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1 className="h3 mb-1">Mostrador</h1>
      <p className="text-body-secondary">Pedidos tomados en el local, sin pasar por el carrito del cliente.</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {exito && (
        <div className="alert alert-success">
          {exito} <Link to="/admin/pedidos">Ver pedidos</Link>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card tarjeta-admin h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h5 mb-0">Productos</h2>
                <span className="small text-body-secondary">{visibles.length} disponibles</span>
              </div>

              <input
                type="search"
                className="form-control mb-3"
                placeholder="Buscar por nombre o código"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />

              <div className="row g-2">
                {visibles.map((producto) => (
                  <div className="col-12 col-sm-6" key={producto.id}>
                    <div className="border rounded-3 p-2 d-flex align-items-center gap-2 h-100">
                      <img
                        src={producto.imagen}
                        alt=""
                        width="48"
                        height="48"
                        className="rounded object-fit-cover"
                        loading="lazy"
                      />
                      <div className="flex-grow-1">
                        <p className="small fw-bold mb-0">{producto.nombre}</p>
                        <p className="small text-body-secondary mb-0">
                          {formatPrice(producto.precio)} · stock {producto.stock}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => agregar(producto)}
                        aria-label={`Agregar ${producto.nombre}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <form onSubmit={enviar} className="card tarjeta-admin">
            <div className="card-body">
              <h2 className="h5 mb-3">Pedido</h2>

              {items.length === 0 ? (
                <p className="small text-body-secondary">Agrega productos para comenzar.</p>
              ) : (
                <ul className="list-group list-group-flush mb-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item px-0 d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <p className="small mb-0">{item.nombre}</p>
                        <p className="small text-body-secondary mb-0">
                          {formatPrice(item.precio)} c/u
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="small mb-3">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totales.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Descuentos</span>
                  <span>-{formatPrice(totales.descuento)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Envío</span>
                  <span>{formatPrice(envio)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-1 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <label className="form-label" htmlFor="cliente">Cliente</label>
              <select
                id="cliente"
                className="form-select mb-2"
                value={clienteId}
                onChange={(evento) => setClienteId(evento.target.value)}
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>

              <label className="form-label" htmlFor="tipoEntrega">Entrega</label>
              <select
                id="tipoEntrega"
                className="form-select mb-2"
                value={tipoEntrega}
                onChange={(evento) => setTipoEntrega(evento.target.value)}
              >
                <option value="local">Retiro en el local</option>
                <option value="domicilio">Despacho a domicilio</option>
              </select>

              {!retiro && (
                <>
                  <FormField id="direccion" label="Dirección de entrega"
                    value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                  <FormField id="telefono" label="Teléfono" value={telefono}
                    onChange={(e) => setTelefono(e.target.value)} placeholder="912345678" />
                </>
              )}

              <label className="form-label" htmlFor="fechaEntrega">Fecha de entrega</label>
              <input
                id="fechaEntrega"
                type="date"
                className="form-control mb-2"
                min={hoyISO()}
                value={fechaEntrega}
                onChange={(evento) => setFechaEntrega(evento.target.value)}
                required
              />

              <label className="form-label" htmlFor="cupon">Cupón (opcional)</label>
              <input
                id="cupon"
                className="form-control"
                value={cupon}
                onChange={manejarCupon}
                onBlur={revisarCupon}
                placeholder="MIEL10"
              />
              {avisoCupon && <p className="small text-body-secondary mt-1">{avisoCupon}</p>}

              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={enviando || items.length === 0}
              >
                {enviando ? "Creando…" : "Crear pedido"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
