import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  Flame,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from 'lucide-react'
import { useAuth, MOCK_CREDENTIALS } from '../context/AuthContext'

export default function Login() {
  const { isAuthenticated, login, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

  // Si ya está autenticado, redirigir al Dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Por favor, completa todos los campos para ingresar.')
      return
    }

    const res = await login(email, password)
    if (res.success) {
      navigate('/', { replace: true })
    } else {
      setError(res.error)
    }
  }

  const handleFillDemo = () => {
    setEmail(MOCK_CREDENTIALS.email)
    setPassword(MOCK_CREDENTIALS.password)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#e41d28] selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#e41d28]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#e41d28]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="p-6 md:px-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e41d28] rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
            <Flame size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-wider leading-none">
              SON<span className="text-[#e41d28]">NOS</span>
            </h1>
            <p className="text-gray-400 text-[9px] font-bold tracking-[0.25em] uppercase mt-0.5">
              Gestor Fitness
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2e2e2e] text-xs text-gray-400">
          <ShieldCheck size={14} className="text-[#e41d28]" />
          <span>Acceso Seguro Encriptado</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-[#1a1a1a] border border-[#2b2b2b] rounded-3xl p-8 md:p-10 shadow-2xl relative">
          {/* Card Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#121212] border border-[#333] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <KeyRound size={26} className="text-[#e41d28]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Iniciar Sesión
            </h2>
            <p className="text-gray-400 text-xs mt-1.5">
              Ingresa tus credenciales autorizadas de Sonnos Gestor
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#fde8e9] border border-[#e41d28]/30 text-[#e41d28] text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo 1: Usuario / Email */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">
                Usuario / Correo Electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sonnos.com"
                  className="w-full bg-[#121212] border border-[#333] focus:border-[#e41d28] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e41d28]/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Campo 2: Contraseña */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border border-[#333] focus:border-[#e41d28] rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e41d28]/30 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-0.5 cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón Principal Iniciar Sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#e41d28] text-white py-3.5 px-4 rounded-2xl text-sm font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </div>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-[#292929] text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#e41d28] bg-[#121212] border border-[#333] hover:border-[#e41d28]/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles size={13} className="text-[#e41d28]" />
              <span>Usar credenciales de prueba demo</span>
            </button>
            <p className="text-[11px] font-mono text-gray-600 mt-2">
              admin@sonnos.com · sonnos2026
            </p>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="p-6 text-center text-xs text-gray-500 z-10">
        <p className="max-w-md mx-auto">
          Acceso exclusivo para clientes <strong>Sonnos Gestor</strong>. Si necesitas credenciales, contacta a soporte corporativo.
        </p>
        <p className="text-[10px] text-gray-600 mt-1">
          © 2026 Sonnos Fitness Systems · Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
