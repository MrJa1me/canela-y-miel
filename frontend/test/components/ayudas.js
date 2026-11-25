import { act } from "react";
import { createRoot } from "react-dom/client";

// React necesita saber que estamos en una prueba para actualizar la pantalla
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Dibuja un componente en un div de prueba y devuelve el div para revisarlo
export function dibujar(elemento) {
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);
  act(() => raiz.render(elemento));

  // Limpieza: se llama al terminar cada prueba
  contenedor.limpiar = () => {
    act(() => raiz.unmount());
    contenedor.remove();
  };
  return contenedor;
}
