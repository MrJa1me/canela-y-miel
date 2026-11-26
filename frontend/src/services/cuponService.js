import { solicitar } from './api'

// Público: devuelve el porcentaje del cupón para mostrarlo antes de confirmar.
// Si el código no sirve, la pantalla muestra el aviso (sin alert).
export function validarCupon(codigo) {
  return solicitar(`/cupones/validar/${encodeURIComponent(codigo)}`, {
    silenciarError: true,
  })
}
