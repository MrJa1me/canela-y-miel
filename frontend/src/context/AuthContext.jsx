import { createContext, useContext, useEffect, useState } from 'react'
import {
  cerrarSesion as cerrarSesionLocal,
  login,
  perfil,
  registro,
} from '../services/authService'
import { leerToken, leerUsuario } from '../services/sesion'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuario)
  const [cargando, setCargando] = useState(Boolean(leerToken()))

  // Al recargar: valida el token y recupera el usuario real.
  useEffect(() => {
    if (!leerToken()) return

    perfil()
      .then(setUsuario)
      .catch(() => setUsuario(leerUsuario()))
      .finally(() => setCargando(false))
  }, [])

  // api.js avisa cuando renovó el token o cuando la sesión dejó de servir.
  useEffect(() => {
    const alRenovar = (evento) => setUsuario(evento.detail)
    const alCerrar = () => setUsuario(null)

    window.addEventListener('canela:sesion-renovada', alRenovar)
    window.addEventListener('canela:sesion-cerrada', alCerrar)
    return () => {
      window.removeEventListener('canela:sesion-renovada', alRenovar)
      window.removeEventListener('canela:sesion-cerrada', alCerrar)
    }
  }, [])

  async function iniciarSesion(correo, password) {
    const autenticado = await login(correo, password)
    setUsuario(autenticado)
    return autenticado
  }

  async function registrarse(datos) {
    const autenticado = await registro(datos)
    setUsuario(autenticado)
    return autenticado
  }

  function cerrarSesion() {
    cerrarSesionLocal()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, registrarse, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return contexto
}
