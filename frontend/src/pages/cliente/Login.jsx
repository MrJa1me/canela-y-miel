import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FormField from '../../components/FormField'
import { esCampoObligatorio, esEmailValido } from '../../utils/validators'

export default function Login() {
  const { iniciarSesion } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Revisa los campos antes de llamar al servidor
  function validar() {
    const nuevos = {}
    if (!esEmailValido(correo.trim())) {
      nuevos.correo = 'Ingresa un correo válido'
    }
    if (!esCampoObligatorio(password)) {
      nuevos.password = 'La contraseña es obligatoria'
    }
    return nuevos
  }

  async function enviar(evento) {
    evento.preventDefault()
    setError('')

    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)
    try {
      const autenticado = await iniciarSesion(correo.trim(), password)
      const destino = ubicacion.state?.desde ?? (autenticado.rol === 'ADMIN' ? '/admin' : '/')
      navegar(destino, { replace: true })
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
              <h1 className="h4 mb-3">Iniciar sesión</h1>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={enviar} noValidate>
                <FormField
                  id="correo"
                  label="Correo"
                  type="email"
                  autoComplete="email"
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  error={errores.correo}
                />
                <FormField
                  id="password"
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(evento) => setPassword(evento.target.value)}
                  error={errores.password}
                />

                <button className="btn btn-primary w-100" type="submit" disabled={enviando}>
                  {enviando ? 'Ingresando…' : 'Ingresar'}
                </button>
              </form>

              <p className="small mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
