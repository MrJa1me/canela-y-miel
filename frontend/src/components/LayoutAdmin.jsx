import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SECCIONES = [
  { ruta: '/admin', nombre: 'Dashboard' },
  { ruta: '/admin/mostrador', nombre: 'Mostrador' },
  { ruta: '/admin/inventario', nombre: 'Inventario' },
  { ruta: '/admin/pedidos', nombre: 'Pedidos' },
  { ruta: '/admin/usuarios', nombre: 'Usuarios' },
]

// Marco del panel: cabecera con menú desplegable y contenido a todo el ancho.
export default function LayoutAdmin() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()

  const actual = SECCIONES.find((seccion) => seccion.ruta === ubicacion.pathname)?.nombre ?? 'Menú'

  function salir() {
    cerrarSesion()
    navegar('/')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="navbar-canela py-3" data-bs-theme="dark">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <Link className="text-light text-decoration-none fw-semibold" to="/admin">
              Canela &amp; Miel · Administración
            </Link>

            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Menú · {actual}
              </button>
              <ul className="dropdown-menu">
                {SECCIONES.map((seccion) => (
                  <li key={seccion.ruta}>
                    <Link
                      className={`dropdown-item ${seccion.ruta === ubicacion.pathname ? 'active' : ''}`}
                      to={seccion.ruta}
                    >
                      {seccion.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-light small d-none d-sm-inline">{usuario?.nombre}</span>
            <Link className="btn btn-sm btn-outline-light" to="/">
              Ir a la tienda
            </Link>
            <button className="btn btn-sm btn-outline-light" type="button" onClick={salir}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container-fluid flex-grow-1 p-4 pagina">
        <Outlet />
      </main>
    </div>
  )
}
