import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

// Marco de las páginas del cliente: barra arriba, contenido y pie abajo.
export default function LayoutCliente() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
