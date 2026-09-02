import { useState } from 'react'
import { Menu, Flame, ShieldCheck, User, ScanLine } from 'lucide-react'
import Sidebar from './Sidebar'
import CheckinModal from './CheckinModal'
import { useAuth } from '../context/AuthContext'
import { useSocios } from '../context/SociosContext'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checkinOpen, setCheckinOpen] = useState(false)
  const { user } = useAuth()
  const { registrarPago } = useSocios()

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-[#f8f9fa] text-[#1a1a1a]">
      {/* Global Checkin Modal */}
      <CheckinModal
        isOpen={checkinOpen}
        onClose={() => setCheckinOpen(false)}
        onOpenCobro={(socio) => {
          // Si el usuario confirma cobro desde checkin
          const precio = 18000
          const nuevaFechaVto = new Date()
          nuevaFechaVto.setMonth(nuevaFechaVto.getMonth() + 1)
          registrarPago(socio.id, {
            monto: precio,
            metodoPago: 'Mercado Pago',
            nuevaFechaVto: nuevaFechaVto.toISOString().split('T')[0]
          })
        }}
      />

      {/* Mobile Top Header (< 1024px) */}
      <header className="lg:hidden h-14 bg-[#121212] border-b border-[#242424] px-4 flex items-center justify-between shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#e41d28] rounded-xl flex items-center justify-center text-white shadow-sm shadow-red-600/30">
            <Flame size={18} />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-wider leading-none">
              SON<span className="text-[#e41d28]">NOS</span>
            </span>
            <span className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.2em] block leading-none">
              Gestor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCheckinOpen(true)}
            className="p-2 rounded-xl bg-[#e41d28] text-white shadow-sm cursor-pointer"
            title="Fichaje de Ingreso"
          >
            <ScanLine size={17} />
          </button>

          {user && (
            <div className="w-8 h-8 rounded-xl bg-[#1a1a1a] border border-[#333] text-[#e41d28] flex items-center justify-center font-black text-xs">
              {user.avatar || 'AD'}
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Overlay (Backdrop) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer (Mobile) & Fixed Sidebar (Desktop) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          onClose={() => setMobileMenuOpen(false)}
          onNavigate={() => setMobileMenuOpen(false)}
          onOpenCheckin={() => setCheckinOpen(true)}
        />
      </div>

      {/* Main Content Area - Native Desktop App Feel (Single Controlled Scroll) */}
      <main className="flex-1 h-[calc(100vh-3.5rem)] lg:h-screen overflow-y-auto overflow-x-hidden bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
