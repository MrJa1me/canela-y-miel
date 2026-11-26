import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hoyISO } from '../../utils/descuentos'
import FormField from '../../components/FormField'
import {
  coincidenContrasenas,
  esCampoObligatorio,
  esEmailValido,
  tieneLargoMinimo,
} from '../../utils/validators'

export default function Registro() {
  const { registrarse } = useAuth()
  const navegar = useNavigate()

  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    fechaNacimiento: '',
    codigoPromocional: '',
    password: '',
    confirmar: '',
  })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Guarda lo que se escribe en el campo que cambió (usa el id como clave)
  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.id]: evento.target.value })
  }

  // Revisa todos los campos y devuelve los errores encontrados
  function validar() {
    const nuevos = {}
    if (!esCampoObligatorio(datos.nombre)) {
      nuevos.nombre = 'El nombre es obligatorio'
    }
    if (!esEmailValido(datos.correo.trim())) {
      nuevos.correo = 'Ingresa un correo válido'
    }
    if (!datos.fechaNacimiento) {
      nuevos.fechaNacimiento = 'La fecha de nacimiento es obligatoria'
    } else if (datos.fechaNacimiento >= hoyISO()) {
      nuevos.fechaNacimiento = 'La fecha debe ser anterior a hoy'
    }
    if (!tieneLargoMinimo(datos.password, 6)) {
      nuevos.password = 'Mínimo 6 caracteres'
    }
    if (!coincidenContrasenas(datos.password, datos.confirmar)) {
      nuevos.confirmar = 'Las contraseñas no coinciden'
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
      await registrarse({
        nombre: datos.nombre.trim(),
        correo: datos.correo.trim(),
        password: datos.password,
        fechaNacimiento: datos.fechaNacimiento,
        codigoPromocional: datos.codigoPromocional.trim() || null,
      })
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

              <form onSubmit={enviar} noValidate>
                <FormField id="nombre" label="Nombre" value={datos.nombre}
                  onChange={manejarCambio} error={errores.nombre} />
                <FormField id="correo" label="Correo" type="email" autoComplete="email"
                  value={datos.correo} onChange={manejarCambio} error={errores.correo} />
                <FormField id="fechaNacimiento" label="Fecha de nacimiento" type="date"
                  value={datos.fechaNacimiento} onChange={manejarCambio}
                  error={errores.fechaNacimiento} min="1900-01-01" required />
                <FormField id="codigoPromocional" label="Código promocional (opcional)"
                  value={datos.codigoPromocional} onChange={manejarCambio}
                  placeholder="FELICES50" />
                <FormField id="password" label="Contraseña" type="password"
                  autoComplete="new-password" value={datos.password}
                  onChange={manejarCambio} error={errores.password} />
                <FormField id="confirmar" label="Repite la contraseña" type="password"
                  autoComplete="new-password" value={datos.confirmar}
                  onChange={manejarCambio} error={errores.confirmar} />

                <button className="btn btn-primary w-100" type="submit" disabled={enviando}>
                  {enviando ? 'Creando…' : 'Crear cuenta'}
                </button>
              </form>

              <p className="small text-secondary mt-3 mb-0">
                Con <strong>FELICES50</strong> mantienes 10% de descuento. Si usas tu correo
                <strong> @duoc.cl</strong>, tu torta de cumpleaños es gratis.
              </p>

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
