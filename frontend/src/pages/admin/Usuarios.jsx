import { useEffect, useState } from 'react'
import { actualizarRol, listarUsuarios } from '../../services/userService'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(null)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')

  async function cargar() {
    setUsuarios(await listarUsuarios())
  }

  useEffect(() => {
    cargar().catch((fallo) => setError(fallo.message))
  }, [])

  async function cambiarRol(usuario, rol) {
    try {
      await actualizarRol(usuario, rol)
      await cargar()
    } catch {
      // Si falla, se recarga para que el selector vuelva al rol real.
      try {
        await cargar()
      } catch {
        // Sin conexión: el mensaje ya se mostró.
      }
    }
  }

  if (error) return <p className="text-danger">{error}</p>
  if (!usuarios) return <p>Cargando…</p>

  const texto = busqueda.trim().toLowerCase()
  const visibles = usuarios.filter(
    (usuario) =>
      !texto ||
      usuario.nombre.toLowerCase().includes(texto) ||
      usuario.correo.toLowerCase().includes(texto)
  )

  return (
    <div>
      <h1 className="h3 mb-4">Usuarios</h1>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <input
          type="search"
          className="form-control"
          style={{ maxWidth: '320px' }}
          placeholder="Buscar por nombre o correo"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        <span className="small text-body-secondary">{visibles.length} usuarios</span>
      </div>

      <div className="card border-0 shadow-sm tarjeta-admin">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Premium</th>
                <th scope="col">Rol</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    {usuario.premium ? (
                      <span className="badge bg-warning-subtle text-warning-emphasis">Premium</span>
                    ) : (
                      <span className="text-body-secondary">—</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      aria-label={`Rol de ${usuario.nombre}`}
                      value={usuario.rol}
                      onChange={(evento) => cambiarRol(usuario, evento.target.value)}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CLIENTE">CLIENTE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
