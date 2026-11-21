import { useEffect, useState } from 'react'
import { actualizarRol, listarUsuarios } from '../../services/userService'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(null)

  async function cargar() {
    setUsuarios(await listarUsuarios())
  }

  useEffect(() => {
    cargar()
  }, [])

  async function cambiarRol(id, rol) {
    try {
      await actualizarRol(id, rol)
      await cargar()
    } catch (error) {
      window.alert(error.message)
    }
  }

  if (!usuarios) return <p>Cargando…</p>

  return (
    <div>
      <h1 className="h3 mb-4">Usuarios</h1>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Premium</th>
                <th scope="col">Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
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
                      onChange={(evento) => cambiarRol(usuario.id, evento.target.value)}
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
