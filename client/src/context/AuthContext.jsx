import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch, STORAGE_TOKEN_KEY, STORAGE_USER_KEY, STORAGE_GYM_KEY } from '../api/config'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) || null)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    localStorage.removeItem(STORAGE_USER_KEY)
    localStorage.removeItem(STORAGE_GYM_KEY)
  }, [])

  // Sincronizar logout ante eventos globales de expiración de token
  useEffect(() => {
    const handleGlobalLogout = () => {
      logout()
    }
    window.addEventListener('sonnos_auth_logout', handleGlobalLogout)
    return () => window.removeEventListener('sonnos_auth_logout', handleGlobalLogout)
  }, [logout])

  /**
   * Iniciar sesión contra el backend real en MongoDB.
   * Endpoint: POST /api/auth/login
   */
  const login = async (email, password) => {
    setLoading(true)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const cleanPass = password.trim()

      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      })

      const authToken = data.token
      const dbUser = data.user
      const isPlatformAdmin = Boolean(data.isPlatformAdmin || dbUser.isPlatformAdmin)
      const gyms = Array.isArray(data.gyms) ? data.gyms : []

      const activeGym = gyms[0] || null
      const gymId = activeGym?.gymId ? String(activeGym.gymId) : null
      const gymName = activeGym?.gymName || 'Sonnos Gym - Sede Central'
      const role = activeGym?.role || (isPlatformAdmin ? 'owner' : 'staff')

      const firstName = dbUser.firstName || ''
      const lastName = dbUser.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || cleanEmail.split('@')[0]
      const avatar = ((firstName ? firstName.slice(0, 2) : '') || cleanEmail.slice(0, 2)).toUpperCase()

      const authUser = {
        id: dbUser._id || dbUser.id,
        _id: dbUser._id || dbUser.id,
        email: dbUser.email || cleanEmail,
        firstName,
        lastName,
        name: fullName,
        role,
        gymId,
        gymName,
        gyms,
        isPlatformAdmin,
        avatar,
        loginTime: new Date().toISOString(),
      }

      // Persistir en localStorage
      localStorage.setItem(STORAGE_TOKEN_KEY, authToken)
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authUser))
      if (gymId) {
        localStorage.setItem(STORAGE_GYM_KEY, gymId)
      }

      setToken(authToken)
      setUser(authUser)
      setLoading(false)

      return { success: true, user: authUser }
    } catch (err) {
      setLoading(false)
      return {
        success: false,
        error: err.message || 'Error al iniciar sesión. Verifica tus credenciales.',
      }
    }
  }

  /**
   * Registro de un nuevo gimnasio / owner en la plataforma.
   * Endpoint: POST /api/auth/register
   */
  const register = async ({ gymName, firstName, lastName, email, password }) => {
    setLoading(true)
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          gymName: gymName.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      })

      const authToken = data.token
      const dbUser = data.user
      const gym = data.gym

      const gymId = gym?._id ? String(gym._id) : String(gym?.id)
      const fullName = `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || dbUser.email.split('@')[0]
      const avatar = ((dbUser.firstName ? dbUser.firstName.slice(0, 2) : '') || dbUser.email.slice(0, 2)).toUpperCase()

      const authUser = {
        id: dbUser._id || dbUser.id,
        _id: dbUser._id || dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        name: fullName,
        role: 'owner',
        gymId,
        gymName: gym?.name || gymName,
        gyms: [{ gymId, gymName: gym?.name || gymName, role: 'owner' }],
        isPlatformAdmin: false,
        avatar,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem(STORAGE_TOKEN_KEY, authToken)
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authUser))
      if (gymId) {
        localStorage.setItem(STORAGE_GYM_KEY, gymId)
      }

      setToken(authToken)
      setUser(authUser)
      setLoading(false)

      return { success: true, user: authUser }
    } catch (err) {
      setLoading(false)
      return {
        success: false,
        error: err.message || 'Error al registrar la cuenta.',
      }
    }
  }

  /**
   * Cambiar de sede/gimnasio activo (para usuarios multi-sede / owners).
   */
  const switchGym = (newGymId) => {
    if (!user || !user.gyms) return

    const targetGym = user.gyms.find((g) => String(g.gymId) === String(newGymId))
    if (!targetGym) return

    const updatedUser = {
      ...user,
      gymId: String(targetGym.gymId),
      gymName: targetGym.gymName,
      role: targetGym.role || user.role,
    }

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser))
    localStorage.setItem(STORAGE_GYM_KEY, String(targetGym.gymId))
    setUser(updatedUser)
  }

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        switchGym,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
