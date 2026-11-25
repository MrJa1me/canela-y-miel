// Valores del negocio: envío fijo y descuento Premium
export const COSTO_ENVIO = 8000;
export const PORCENTAJE_PREMIUM = 0.1;

// Calcula subtotal, envío, descuento y total de una lista de productos
export function calcularTotales(items, esPremium) {
  // Subtotal: suma de precio x cantidad de cada producto
  const subtotal = items.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  // Envío: $8.000, pero $0 si el carrito está vacío
  const envio = items.length > 0 ? COSTO_ENVIO : 0;

  // Descuento: 10% del subtotal solo para clientes premium
  const descuento = esPremium ? Math.round(subtotal * PORCENTAJE_PREMIUM) : 0;

  return { subtotal, envio, descuento, total: subtotal - descuento + envio };
}
