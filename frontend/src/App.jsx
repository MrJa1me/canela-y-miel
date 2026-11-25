import { Route, Routes } from 'react-router-dom'
import LayoutCliente from './components/LayoutCliente'
import LayoutAdmin from './components/LayoutAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import Inicio from './pages/cliente/Inicio'
import Catalogo from './pages/cliente/Catalogo'
import Carrito from './pages/cliente/Carrito'
import Detalle from './pages/cliente/Detalle'
import Confirmacion from './pages/cliente/Confirmacion'
import Checkout from './pages/cliente/Checkout'
import Perfil from './pages/cliente/Perfil'
import Seguimiento from './pages/cliente/Seguimiento'
import Login from './pages/cliente/Login'
import Registro from './pages/cliente/Registro'
import Dashboard from './pages/admin/Dashboard'
import Inventario from './pages/admin/Inventario'
import Pedidos from './pages/admin/Pedidos'
import Usuarios from './pages/admin/Usuarios'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutCliente />}>
        <Route index element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="producto/:id" element={<Detalle />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />

        {/* Solo con sesión iniciada */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="confirmacion" element={<Confirmacion />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="seguimiento" element={<Seguimiento />} />
        </Route>
      </Route>

      {/* Solo ADMIN */}
      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
