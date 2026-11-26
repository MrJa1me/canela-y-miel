import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

// Marco de las páginas del cliente: barra arriba, contenido y pie abajo.
export default function LayoutCliente() {
  const ubicacion = useLocation()

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      {/* La key reinicia la animación al cambiar de página */}
      <main key={ubicacion.pathname} className="flex-grow-1 py-4 pagina">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
