import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

// Marco del panel de administración: cabecera, menú lateral y contenido.
export default function LayoutAdmin() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()

  function salir() {
    cerrarSesion()
    navegar('/')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="navbar-canela py-3" data-bs-theme="dark">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <Link className="text-light text-decoration-none fw-semibold" to="/admin">
            Canela &amp; Miel · Administración
          </Link>
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

      <div className="container-fluid flex-grow-1 d-flex">
        <div className="row flex-grow-1 w-100">
          <aside className="col-12 col-md-3 col-lg-2 bg-white border-end p-3 menu-admin">
            <nav className="nav flex-column gap-1">
              <NavLink className={claseEnlace} to="/admin/mostrador">
                Mostrador
              </NavLink>
              <NavLink className={claseEnlace} to="/admin" end>
                Dashboard
              </NavLink>
              <NavLink className={claseEnlace} to="/admin/inventario">
                Inventario
              </NavLink>
              <NavLink className={claseEnlace} to="/admin/pedidos">
                Pedidos
              </NavLink>
              <NavLink className={claseEnlace} to="/admin/usuarios">
                Usuarios
              </NavLink>
            </nav>
          </aside>

          <main className="col-12 col-md-9 col-lg-10 p-4 pagina">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
