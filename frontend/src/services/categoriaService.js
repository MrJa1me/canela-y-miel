import { solicitar } from './api'

export function listarCategorias() {
  return solicitar('/categorias')
}
