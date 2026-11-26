import { act } from "react";
import { dibujar } from "./ayudas";
import Desplegable from "../../src/components/Desplegable";

describe("Desplegable", () => {
  let pantalla;

  afterEach(() => pantalla?.limpiar());

  it("abre y cierra al presionar el botón", () => {
    pantalla = dibujar(
      <Desplegable boton="Abrir">
        <span>Contenido</span>
      </Desplegable>
    );

    const menu = pantalla.querySelector(".dropdown-menu");
    expect(menu.classList.contains("show")).toBeFalse();

    const boton = pantalla.querySelector("button");
    act(() => boton.click());
    expect(menu.classList.contains("show")).toBeTrue();

    act(() => boton.click());
    expect(menu.classList.contains("show")).toBeFalse();
  });

  it("se cierra al hacer clic fuera", () => {
    pantalla = dibujar(
      <Desplegable boton="Abrir">
        <span>Contenido</span>
      </Desplegable>
    );

    act(() => pantalla.querySelector("button").click());
    act(() => {
      document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });

    expect(pantalla.querySelector(".dropdown-menu").classList.contains("show")).toBeFalse();
  });

  it("se cierra con la tecla Escape", () => {
    pantalla = dibujar(
      <Desplegable boton="Abrir">
        <span>Contenido</span>
      </Desplegable>
    );

    act(() => pantalla.querySelector("button").click());
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(pantalla.querySelector(".dropdown-menu").classList.contains("show")).toBeFalse();
  });
});
