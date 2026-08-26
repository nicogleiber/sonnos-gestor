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
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/socios', icon: Users, label: 'Socios' },
  { to: '/tarifas', icon: Tag, label: 'Tarifas' },
  { to: '/clases', icon: Dumbbell, label: 'Clases y Salones' },
  { to: '/calendario', icon: CalendarDays, label: 'Calendario' },
  { to: '/personal', icon: UserCheck, label: 'Personal' },
]

export default function Sidebar({ onClose, onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
    navigate('/login', { replace: true })
  }

  const handleLinkClick = () => {
    if (onNavigate) onNavigate()
    if (onClose) onClose()
  }

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

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
              aria-label="Cerrar menú lateral"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-5 space-y-1.5">
          <div className="px-3 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Menú Principal</p>
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#e41d28] text-white shadow-lg shadow-red-900/40 translate-x-1'
                    : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#e41d28]'
                    }`}
                  />
                  <span className="flex-1 tracking-wide truncate">{label}</span>
                  {isActive ? (
                    <ChevronRight size={15} className="text-white/80 shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#e41d28] transition-all shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 mx-2 mb-3 border-t border-[#242424] space-y-2">
        {/* User Card */}
        {user && (
          <div className="p-3 rounded-2xl bg-[#1a1a1a] border border-[#292929] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121212] border border-[#333] text-[#e41d28] flex items-center justify-center font-black text-xs shrink-0">
              {user.avatar || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-200 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#e41d28] border border-[#292929] hover:border-[#e41d28] transition-all cursor-pointer group shadow-sm"
          title="Cerrar sesión actual"
        >
          <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
