import { MemoryRouter } from "react-router-dom";
import { dibujar } from "./ayudas";
import ProductCard from "../../src/components/ProductCard";

const producto = {
  id: 1,
  nombre: "Torta de Chocolate Clásica",
  categoria: "Tortas",
  precio: 35000,
  imagen: "/img/chocolate.jpg",
};

describe("ProductCard", () => {
  let pantalla;
  let alAgregar;

  // Antes de cada prueba se dibuja una tarjeta nueva
  beforeEach(() => {
    // espía: una función falsa que anota cuántas veces la llamaron
    alAgregar = jasmine.createSpy("alAgregar");
    pantalla = dibujar(
      <MemoryRouter>
        <ProductCard producto={producto} onAgregar={alAgregar} />
      </MemoryRouter>
    );
  });

  afterEach(() => pantalla.limpiar());

  it("muestra nombre, categoría y precio con punto de miles", () => {
    expect(pantalla.textContent).toContain("Torta de Chocolate Clásica");
    expect(pantalla.textContent).toContain("Tortas");
    expect(pantalla.textContent).toContain("$35.000");
  });

  it("al apretar Añadir llama a onAgregar con el producto", () => {
    const boton = pantalla.querySelector("button");
    boton.click();

    expect(alAgregar).toHaveBeenCalledOnceWith(producto);
  });
});
