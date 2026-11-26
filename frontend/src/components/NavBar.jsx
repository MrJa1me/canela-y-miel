import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Avatar from './Avatar'

// Devuelve la clase de Bootstrap para marcar el enlace activo.
const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

export default function NavBar() {
  const { usuario, cerrarSesion } = useAuth()
  const { items } = useCart()
  const navegar = useNavigate()

  const unidades = items.reduce((total, item) => total + item.cantidad, 0)

  function salir() {
    cerrarSesion()
    navegar('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-canela" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Canela &amp; Miel
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className={claseEnlace} to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={claseEnlace} to="/catalogo">
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={claseEnlace} to="/carrito">
                Carrito
                {unidades > 0 && (
                  <span
                    key={unidades}
                    className="badge rounded-pill contador-carrito ms-1"
                    aria-label={`${unidades} productos en el carrito`}
                  >
                    {unidades}
                  </span>
                )}
              </NavLink>
            </li>

            {usuario ? (
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle d-inline-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Avatar usuario={usuario} tamano={24} />
                  <span className="d-none d-lg-inline">{usuario.nombre.split(' ')[0]}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/perfil">Mi perfil</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/seguimiento">Seguimiento</Link>
                  </li>
                  {usuario.rol === 'ADMIN' && (
                    <li>
                      <Link className="dropdown-item" to="/admin">Panel admin</Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button type="button" className="dropdown-item" onClick={salir}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={claseEnlace} to="/login">
                    Iniciar sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={claseEnlace} to="/registro">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
