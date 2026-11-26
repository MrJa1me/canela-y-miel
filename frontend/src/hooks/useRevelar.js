import { useEffect } from "react";

// Marca como visibles las secciones .revelar cuando entran en pantalla.
export function useRevelar() {
  useEffect(() => {
    const elementos = Array.from(document.querySelectorAll(".revelar"));
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || !("IntersectionObserver" in window)) {
      elementos.forEach((elemento) => elemento.classList.add("visible"));
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elementos.forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, []);
}
