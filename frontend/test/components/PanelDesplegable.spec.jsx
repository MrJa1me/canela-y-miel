import { act } from "react";
import { dibujar } from "./ayudas";
import PanelDesplegable from "../../src/components/PanelDesplegable";

describe("PanelDesplegable", () => {
  let pantalla;

  afterEach(() => pantalla?.limpiar());

  it("muestra y oculta el contenido al presionar el título", () => {
    pantalla = dibujar(
      <PanelDesplegable titulo="Mis preferencias">
        <p>Contenido del panel</p>
      </PanelDesplegable>
    );

    expect(pantalla.textContent).toContain("Mis preferencias");
    expect(pantalla.textContent).not.toContain("Contenido del panel");

    const boton = pantalla.querySelector("button");
    act(() => boton.click());
    expect(pantalla.textContent).toContain("Contenido del panel");

    act(() => boton.click());
    expect(pantalla.textContent).not.toContain("Contenido del panel");
  });

  it("puede comenzar abierto", () => {
    pantalla = dibujar(
      <PanelDesplegable titulo="Historial" abiertoInicial>
        <p>Pedidos</p>
      </PanelDesplegable>
    );

    expect(pantalla.textContent).toContain("Pedidos");
  });
});
