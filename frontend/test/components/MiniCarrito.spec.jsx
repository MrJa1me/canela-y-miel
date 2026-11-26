import { MemoryRouter } from "react-router-dom";
import { dibujar } from "./ayudas";
import MiniCarrito from "../../src/components/MiniCarrito";
import { CartProvider } from "../../src/context/CartContext";

function dibujarCarrito(items) {
  spyOn(Storage.prototype, "getItem").and.returnValue(
    items ? JSON.stringify(items) : null
  );
  spyOn(Storage.prototype, "setItem");

  return dibujar(
    <MemoryRouter>
      <CartProvider>
        <MiniCarrito />
      </CartProvider>
    </MemoryRouter>
  );
}

describe("MiniCarrito", () => {
  let pantalla;

  afterEach(() => pantalla?.limpiar());

  it("muestra el mensaje cuando está vacío", () => {
    pantalla = dibujarCarrito([]);

    expect(pantalla.textContent).toContain("Tu carrito está vacío");
    expect(pantalla.textContent).toContain("Ver catálogo");
  });

  it("muestra los productos, el subtotal y los accesos", () => {
    pantalla = dibujarCarrito([
      { id: 1, nombre: "Torta Cuadrada de Chocolate", precio: 45000, cantidad: 2, imagen: "/img/chocolate.jpg" },
    ]);

    expect(pantalla.textContent).toContain("Torta Cuadrada de Chocolate");
    expect(pantalla.textContent).toContain("2 × $45.000");
    expect(pantalla.textContent).toContain("$90.000");
    expect(pantalla.textContent).toContain("Ver carrito");
    expect(pantalla.textContent).toContain("Ir a pagar");
  });
});
