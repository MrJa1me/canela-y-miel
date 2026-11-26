import { dibujar } from "./ayudas";
import Avatar from "../../src/components/Avatar";

describe("Avatar", () => {
  let pantalla;

  afterEach(() => pantalla?.limpiar());

  it("muestra las iniciales cuando no hay avatar", () => {
    pantalla = dibujar(<Avatar usuario={{ nombre: "Ana Pérez" }} />);

    expect(pantalla.textContent).toBe("AP");
    expect(pantalla.querySelector("img")).toBeNull();
  });

  it("muestra la imagen del avatar elegido", () => {
    pantalla = dibujar(
      <Avatar usuario={{ nombre: "Ana", avatar: "/img/avatares/avatar-2.svg" }} />
    );

    const imagen = pantalla.querySelector("img");
    expect(imagen.getAttribute("src")).toBe("/img/avatares/avatar-2.svg");
  });
});
