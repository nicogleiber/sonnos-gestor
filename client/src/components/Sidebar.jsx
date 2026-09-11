import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarDays,
  UserCheck,
  Tag,
  ChevronRight,
  Flame,
  LogOut,
  X,
  ShoppingBag,
  Wallet,
  Bell,
  ScanLine,
  Building2,
  Settings,
  Shield
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ onClose, onNavigate, onOpenCheckin, onOpenConfig }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Sede Multicuenta
  const [sedeActiva, setSedeActiva] = useState('Sede Central')

  const isSocio = user?.role === 'Socio'

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
    navigate('/login', { replace: true })
  }

  const handleOpenConfig = () => {
    if (onOpenConfig) onOpenConfig()
    if (onClose) onClose()
  }

  const handleLinkClick = () => {
    if (onNavigate) onNavigate()
    if (onClose) onClose()
  }

  // Ítems según rol del usuario autenticado
  const navItems = !isSocio ? [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/socios', icon: Users, label: 'Socios' },
    { to: '/planes', icon: Tag, label: 'Planes' },
    { to: '/tienda', icon: ShoppingBag, label: 'Tienda & Stock' },
    { to: '/caja', icon: Wallet, label: 'Caja' },
    { to: '/clases', icon: Dumbbell, label: 'Clases y Salones' },
    { to: '/calendario', icon: CalendarDays, label: 'Calendario' },
    { to: '/personal', icon: UserCheck, label: 'Personal' },
    { to: '/notificaciones', icon: Bell, label: 'Notificaciones' },
  ] : [
    // Vista restringida para el rol Socio
    { to: '/calendario', icon: CalendarDays, label: 'Mi Cronograma' },
    { to: '/clases', icon: Dumbbell, label: 'Clases Disponibles' },
    { to: '/planes', icon: Tag, label: 'Planes y Membresías' },
  ]

  return (
    <aside className="w-72 lg:w-64 h-full bg-[#121212] border-r border-[#242424] flex flex-col justify-between shadow-2xl shrink-0 select-none overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
              <Flame size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-wider leading-none">
                SON<span className="text-[#e41d28]">NOS</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-bold tracking-[0.25em] uppercase mt-1">
                Gestor Fitness
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Selector de Sede Multicuenta */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-2 rounded-2xl bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 size={15} className="text-[#e41d28] shrink-0" />
              <select
                value={sedeActiva}
                onChange={e => setSedeActiva(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none truncate cursor-pointer"
              >
                <option value="Sede Central" className="bg-[#121212] text-white">Sede Central (Belgrano)</option>
                <option value="Sede Norte" className="bg-[#121212] text-white">Sede Norte (Palermo)</option>
                <option value="Sede Oeste" className="bg-[#121212] text-white">Sede Oeste (Ramos)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón Destacado: Fichaje Rápido / Check-in */}
        {!isSocio && (
          <div className="px-4 py-2">
            <button
              onClick={() => {
                if (onOpenCheckin) onOpenCheckin()
                if (onClose) onClose()
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#e41d28] text-white py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-98"
            >
              <ScanLine size={16} />
              <span>Fichaje / Check-in</span>
            </button>
          </div>
        )}

        {/* Links de Navegación */}
        <nav className="px-3 py-3 space-y-1">
          <div className="px-3 pb-1 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {!isSocio ? 'Administración' : 'Portal del Socio'}
            </p>
          </div>

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#e41d28] text-white shadow-lg shadow-red-900/40 translate-x-1'
                    : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#e41d28]'
                    }`}
                  />
                  <span className="flex-1 tracking-wide truncate">{label}</span>
                  {isActive && <ChevronRight size={14} className="text-white/80 shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer con Perfil, Configuración y Logout */}
      <div className="p-3 mx-2 mb-3 border-t border-[#242424] space-y-2">
        {/* Términos y Condiciones si está en modo Socio */}
        {isSocio && (
          <p className="text-[9px] text-gray-500 px-1 text-center">
            🔐 Datos protegidos conforme a los Términos y Condiciones de Sonnos Gestor.
          </p>
        )}

        {/* Usuario, Configuración y Botón Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] border border-[#333] text-[#e41d28] flex items-center justify-center font-black text-xs shrink-0">
              {user?.avatar || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-200 truncate">{user?.name || 'Admin Sonnos'}</p>
              <p className="text-[9px] text-gray-500 truncate">{user?.email || 'admin@sonnos.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Botón Configuración del Gimnasio */}
            <button
              onClick={handleOpenConfig}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#242424] transition-all cursor-pointer"
              title="Configuración del Gimnasio"
              aria-label="Configuración del Gimnasio"
            >
              <Settings size={16} />
            </button>

            {/* Botón Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#e41d28] transition-all cursor-pointer"
              title="Cerrar Sesión"
              aria-label="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

