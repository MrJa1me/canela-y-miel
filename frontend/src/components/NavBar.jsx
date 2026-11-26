import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Avatar from './Avatar'
import Desplegable from './Desplegable'
import MiniCarrito from './MiniCarrito'

// Devuelve la clase de Bootstrap para marcar el enlace activo.
const claseEnlace = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

export default function NavBar() {
  const { usuario, cerrarSesion } = useAuth()
  const { items } = useCart()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const unidades = items.reduce((total, item) => total + item.cantidad, 0)

  // En móvil, el menú se cierra solo al cambiar de página.
  useEffect(() => {
    setMenuAbierto(false)
  }, [ubicacion.pathname])

  function salir() {
    cerrarSesion()
    navegar('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-canela">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Canela &amp; Miel
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-controls="menuPrincipal"
          aria-expanded={menuAbierto}
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${menuAbierto ? ' show' : ''}`} id="menuPrincipal">
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
              <Desplegable
                claseBoton="nav-link d-inline-flex align-items-center gap-1"
                claseMenu="mini-carrito-menu"
                alineadoDerecha
                boton={
                  <>
                    Carrito
                    {unidades > 0 && (
                      <span
                        key={unidades}
                        className="badge rounded-pill contador-carrito"
                        aria-label={`${unidades} productos en el carrito`}
                      >
                        {unidades}
                      </span>
                    )}
                  </>
                }
              >
                <MiniCarrito />
              </Desplegable>
            </li>

            {usuario ? (
              <li className="nav-item">
                <Desplegable
                  claseBoton="nav-link d-inline-flex align-items-center gap-1"
                  alineadoDerecha
                  boton={
                    <>
                      <Avatar usuario={usuario} tamano={24} />
                      <span className="d-none d-lg-inline">{usuario.nombre.split(' ')[0]}</span>
                    </>
                  }
                >
                  <Link className="dropdown-item" to="/perfil">Mi perfil</Link>
                  <Link className="dropdown-item" to="/seguimiento">Seguimiento</Link>
                  {usuario.rol === 'ADMIN' && (
                    <Link className="dropdown-item" to="/admin">Panel admin</Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button type="button" className="dropdown-item" onClick={salir}>
                    Cerrar sesión
                  </button>
                </Desplegable>
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
