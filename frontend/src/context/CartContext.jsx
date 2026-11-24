import { createContext, useContext, useEffect, useState } from "react";

// La "libreta compartida" del carrito
const CartContext = createContext();

// Nombre con el que se guarda el carrito en el navegador
const CLAVE_CARRITO = "carrito";

// Lee el carrito guardado; si no hay nada (o está dañado), devuelve lista vacía
function leerCarritoGuardado() {
  try {
    const texto = localStorage.getItem(CLAVE_CARRITO);
    return texto ? JSON.parse(texto) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children, esPremium = false }) {
  // items = lista de productos en el carrito, cada uno con su cantidad
  const [items, setItems] = useState(leerCarritoGuardado);

  // Cada vez que cambia el carrito, lo guarda en el navegador
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  // Agrega un producto; si ya estaba, solo le suma cantidad
  function agregar(producto, cantidad = 1) {
    setItems((actual) => {
      const existe = actual.find((item) => item.id === producto.id);
      if (existe) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...actual, { ...producto, cantidad }];
    });
  }

  // Saca un producto del carrito
  function quitar(id) {
    setItems((actual) => actual.filter((item) => item.id !== id));
  }

  // Cambia la cantidad; si baja de 1, el producto se quita
  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) {
      quitar(id);
      return;
    }
    setItems((actual) =>
      actual.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  }

  // Deja el carrito vacío
  function vaciar() {
    setItems([]);
  }

  // Subtotal: suma de precio x cantidad de cada producto
  const subtotal = items.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  // Envío: $8.000, pero $0 si el carrito está vacío
  const envio = items.length > 0 ? 8000 : 0;

  // Descuento: 10% del subtotal solo para clientes premium
  const descuento = esPremium ? Math.round(subtotal * 0.1) : 0;

  // Total a pagar
  const total = subtotal - descuento + envio;

  const valor = {
    items,
    agregar,
    quitar,
    cambiarCantidad,
    vaciar,
    subtotal,
    envio,
    descuento,
    total,
  };

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

// Atajo para que cualquier componente use el carrito
export function useCart() {
  return useContext(CartContext);
}