import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Registro() {
  const { registrarse } = useAuth()
  const navegar = useNavigate()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await registrarse({ nombre: nombre.trim(), correo: correo.trim(), password })
      navegar('/perfil', { replace: true })
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-9 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-3">Crear cuenta</h1>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={enviar}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="nombre">Nombre</label>
                  <input
                    className="form-control"
                    id="nombre"
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="correo">Correo</label>
                  <input
                    className="form-control"
                    id="correo"
                    type="email"
                    autoComplete="email"
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <input
                    className="form-control"
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                    minLength="6"
                    required
                  />
                  <div className="form-text">Mínimo 6 caracteres.</div>
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={enviando}>
                  {enviando ? 'Creando…' : 'Crear cuenta'}
                </button>
              </form>

              <p className="small mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
