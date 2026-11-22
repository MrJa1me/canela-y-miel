import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { usuario } = useAuth()

  return (
    <footer className="footer-canela py-4 mt-auto">
      <div className="container">
        <div className="row gy-3">
          <div className="col-12 col-md-6">
            <h5 className="mb-2">Canela &amp; Miel</h5>
            <p className="mb-0 small">Pastelería artesanal, hecha a mano cada día.</p>
          </div>

          <div className="col-12 col-md-4">
            <p className="mb-1 small">hola@canelaymiel.cl</p>
            <p className="mb-0 small">Calle del Sabor 123, Barrio Dulce</p>
          </div>

          <div className="col-12 col-md-2 text-md-end">
            {usuario?.rol === 'ADMIN' && (
              <Link className="link-light small" to="/admin">
                Administración
              </Link>
            )}
          </div>
        </div>

        <hr className="border-light opacity-25" />
        <p className="mb-0 small text-center">
          © 2026 Pastelería Canela &amp; Miel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
