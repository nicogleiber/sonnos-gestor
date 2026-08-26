import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const STORAGE_KEY = 'sonnos_auth_user'

// Credenciales de prueba oficiales
export const MOCK_CREDENTIALS = {
  email: 'admin@sonnos.com',
  password: 'sonnos2026',
  name: 'Administrador Sonnos',
  role: 'Administrador General',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  // Sincronizar localStorage cuando cambie el usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  /**
   * Iniciar sesión.
   * Estructura lista para conectar con Firebase Auth:
   * ej: const userCredential = await signInWithEmailAndPassword(auth, email, password)
   */
  const login = async (email, password) => {
    setLoading(true)

    // Simulación de latencia de red de 400ms para UX natural
    await new Promise(resolve => setTimeout(resolve, 400))

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    // Verificación con credenciales de prueba o cualquier cuenta corporativa @sonnos.com
    if (
      (cleanEmail === MOCK_CREDENTIALS.email.toLowerCase() && cleanPass === MOCK_CREDENTIALS.password) ||
      (cleanEmail.endsWith('@sonnos.com') && cleanPass.length >= 6)
    ) {
      const authUser = {
        email: cleanEmail,
        name: cleanEmail === MOCK_CREDENTIALS.email ? MOCK_CREDENTIALS.name : cleanEmail.split('@')[0],
        role: MOCK_CREDENTIALS.role,
        avatar: cleanEmail.slice(0, 2).toUpperCase(),
        loginTime: new Date().toISOString(),
      }
      setUser(authUser)
      setLoading(false)
      return { success: true, user: authUser }
    } else {
      setLoading(false)
      return {
        success: false,
        error: 'Credenciales inválidas. Verifica tu correo electrónico y contraseña.',
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
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
