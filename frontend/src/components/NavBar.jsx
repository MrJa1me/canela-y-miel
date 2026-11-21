import { Link, NavLink } from 'react-router-dom'

// Devuelve la clase de Bootstrap para marcar el enlace activo.
const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

export default function NavBar() {
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
          <ul className="navbar-nav ms-auto">
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
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={claseEnlace} to="/perfil">
                Mi perfil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={claseEnlace} to="/seguimiento">
                Seguimiento
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
