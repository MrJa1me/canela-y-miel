import { act } from "react";
import { dibujar } from "../components/ayudas";
import { CartProvider, useCart } from "../../src/context/CartContext";

const torta = { id: 1, nombre: "Torta Cuadrada de Chocolate", precio: 45000 };

// Componente de prueba: guarda el carrito en una variable para poder usarlo
let carrito;
function Espia() {
  carrito = useCart();
  return null;
}

describe("CartContext", () => {
  let pantalla;
  let guardar;

  beforeEach(() => {
    // mock: reemplaza localStorage para no tocar el del navegador de verdad
    // (se espía en Storage.prototype, que es donde viven getItem y setItem)
    spyOn(Storage.prototype, "getItem").and.returnValue(null);
    guardar = spyOn(Storage.prototype, "setItem");
    pantalla = dibujar(
      <CartProvider>
        <Espia />
      </CartProvider>
    );
  });

  afterEach(() => pantalla.limpiar());

  it("agregar suma cantidad si el producto ya estaba", () => {
    act(() => carrito.agregar(torta));
    act(() => carrito.agregar(torta, 2));

    expect(carrito.items.length).toBe(1);
    expect(carrito.items[0].cantidad).toBe(3);
  });

  it("guarda el carrito en localStorage cada vez que cambia", () => {
    act(() => carrito.agregar(torta));

    expect(guardar).toHaveBeenCalledWith("carrito", jasmine.any(String));
  });

  it("cambiarCantidad a menos de 1 quita el producto", () => {
    act(() => carrito.agregar(torta));
    act(() => carrito.cambiarCantidad(1, 0));

    expect(carrito.items.length).toBe(0);
    expect(carrito.envio).toBe(0);
  });
});
