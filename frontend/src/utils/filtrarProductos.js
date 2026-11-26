// Deja los productos que cumplen categoría, precio, tamaño y búsqueda por nombre o código.
export function filtrarProductos(
  productos,
  { categoria = "", precioMax = Number.POSITIVE_INFINITY, porcionesMax = null, busqueda = "" } = {}
) {
  const texto = busqueda.trim().toLowerCase();

  return productos.filter((producto) => {
    const cumpleCategoria = categoria === "" || producto.categoria === categoria;
    const cumplePrecio = producto.precio <= precioMax;
    const cumplePorciones =
      !porcionesMax || (producto.porciones && producto.porciones <= porcionesMax);
    const cumpleTexto =
      texto === "" ||
      producto.nombre.toLowerCase().includes(texto) ||
      (producto.codigo ?? "").toLowerCase().includes(texto);

    return cumpleCategoria && cumplePrecio && cumplePorciones && cumpleTexto;
  });
}
