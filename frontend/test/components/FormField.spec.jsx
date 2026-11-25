import { dibujar } from "./ayudas";
import FormField from "../../src/components/FormField";

describe("FormField", () => {
  it("muestra la etiqueta y no muestra mensaje si no hay error", () => {
    const pantalla = dibujar(
      <FormField id="correo" label="Correo" value="" onChange={() => {}} />
    );

    expect(pantalla.querySelector("label").textContent).toBe("Correo");
    expect(pantalla.querySelector(".invalid-feedback")).toBeNull();
    pantalla.limpiar();
  });

  it("con error pinta el campo en rojo y muestra el mensaje", () => {
    const pantalla = dibujar(
      <FormField
        id="correo"
        label="Correo"
        value=""
        onChange={() => {}}
        error="Ingresa un correo válido"
      />
    );

    expect(pantalla.querySelector("input").classList).toContain("is-invalid");
    expect(pantalla.querySelector(".invalid-feedback").textContent).toBe(
      "Ingresa un correo válido"
    );
    pantalla.limpiar();
  });
});
