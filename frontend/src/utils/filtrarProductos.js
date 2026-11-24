// Deja solo los productos de la categoría y con precio hasta el máximo
export function filtrarProductos(productos, categoria, precioMax) {
  return productos.filter((producto) => {
    const cumpleCategoria = categoria === "" || producto.categoria === categoria;
    const cumplePrecio = producto.precio <= precioMax;
    return cumpleCategoria && cumplePrecio;
  });
}