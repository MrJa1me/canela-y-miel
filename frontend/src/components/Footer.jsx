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
            <p className="mb-2 small">Pastelería artesanal, hecha a mano cada día.</p>
            <p className="mb-0 small">
              <a
                className="link-light"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              {" · "}
              <a
                className="link-light"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </p>
          </div>

          <div className="col-12 col-md-3">
            <p className="mb-1 small">hola@canelaymiel.cl</p>
            <p className="mb-0 small">Calle del Sabor 123, Barrio Dulce</p>
          </div>

          <div className="col-12 col-md-3 text-md-end">
            <Link className="link-light small d-block" to="/catalogo">
              Catálogo
            </Link>
            <Link className="link-light small d-block" to="/registro">
              Registro
            </Link>
            {usuario && (
              <Link className="link-light small d-block" to="/perfil">
                Mi perfil
              </Link>
            )}
            {usuario?.rol === 'ADMIN' && (
              <Link className="link-light small d-block" to="/admin">
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
