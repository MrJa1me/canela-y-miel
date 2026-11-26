import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

// Devuelve la clase de Bootstrap para marcar el enlace activo.
const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

// El enlace del perfil lleva el avatar al lado del texto.
const claseEnlacePerfil = ({ isActive }) =>
  `nav-link d-inline-flex align-items-center gap-1${isActive ? ' active' : ''}`

export default function NavBar() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()

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
              </NavLink>
            </li>

            {usuario ? (
              <>
                <li className="nav-item">
                  <NavLink className={claseEnlacePerfil} to="/perfil">
                    <Avatar usuario={usuario} tamano={24} />
                    <span>Mi perfil</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={claseEnlace} to="/seguimiento">
                    Seguimiento
                  </NavLink>
                </li>
                {usuario.rol === 'ADMIN' && (
                  <li className="nav-item">
                    <NavLink className={claseEnlace} to="/admin">
                      Panel admin
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link bg-transparent border-0"
                    onClick={salir}
                  >
                    Salir
                  </button>
                </li>
              </>
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
