// Elige productos para recomendar: primero de las categorías que le gustan,
// y que el cliente aún no ha comprado
export function recomendarProductos(productos, pedidos, preferencias, limite = 3) {
  // Ids de todo lo que el cliente ya compró
  const comprados = new Set(
    pedidos.flatMap((pedido) => pedido.detalles.map((d) => d.productoId))
  );

  // Solo productos activos, con stock y que no haya comprado
  const disponibles = productos.filter(
    (producto) =>
      producto.activo && producto.stock > 0 && !comprados.has(producto.id)
  );

  const preferidos = disponibles.filter((p) => preferencias.includes(p.categoria));
  const otros = disponibles.filter((p) => !preferencias.includes(p.categoria));

  return [...preferidos, ...otros].slice(0, limite);
}
