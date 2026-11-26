import { esTorta } from "./descuentos";

// Valores del negocio: envío fijo y porcentajes del caso
export const COSTO_ENVIO = 8000;
const PORCENTAJE_MAYOR_50 = 0.5;
const PORCENTAJE_DIEZ = 0.1;

// Precio de la torta más barata del carrito (se regala una sola).
function precioTortaMasBarata(items) {
  const precios = items.filter(esTorta).map((item) => item.precio);
  return precios.length > 0 ? Math.min(...precios) : 0;
}

// Calcula subtotal, descuento, envío y total igual que el backend:
// 1) torta gratis Duoc, 2) solo el mayor descuento porcentual, 3) envío fijo.
export function calcularTotales(items, beneficios = {}) {
  const {
    esPremium = false,
    tieneFelices50 = false,
    esMayorDe50 = false,
    cumpleHoy = false,
    correoInstitucional = false,
    cuponPorcentaje = 0,
  } = beneficios;

  const subtotal = items.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  const tortaGratis =
    correoInstitucional && cumpleHoy ? precioTortaMasBarata(items) : 0;
  const base = subtotal - tortaGratis;

  const porcentaje = Math.max(
    esMayorDe50 ? PORCENTAJE_MAYOR_50 : 0,
    esPremium || tieneFelices50 ? PORCENTAJE_DIEZ : 0,
    cuponPorcentaje / 100
  );

  const descuento = Math.round(base * porcentaje) + tortaGratis;

  // Envío: $8.000, pero $0 si el carrito está vacío
  const envio = items.length > 0 ? COSTO_ENVIO : 0;

  return { subtotal, envio, descuento, total: subtotal - descuento + envio, tortaGratis };
}
