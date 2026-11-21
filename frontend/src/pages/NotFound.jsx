import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="h3 mb-2">Página no encontrada</h1>
      <p className="text-secondary">La dirección que buscas no existe.</p>
      <Link className="btn btn-primary" to="/">
        Volver al inicio
      </Link>
    </div>
  )
}
