import { useState } from 'react'
import {
  Bell,
  AlertCircle,
  Clock,
  UserCheck,
  Calendar,
  Gift,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldAlert
} from 'lucide-react'
import { useSocios } from '../context/SociosContext'
import { usePersonal } from '../context/PersonalContext'
import { formatearFecha } from '../utils/paymentUtils'

export default function Notificaciones() {
  const { socios } = useSocios()
  const { profesores } = usePersonal()

  const [tab, setTab] = useState('gimnasio') // 'gimnasio' | 'profesores' | 'socios'

  const sociosEnCobro = socios.filter(s => s.estadoPago === 'En Fecha de Cobro')
  const sociosVencidos = socios.filter(s => s.estadoPago === 'Vencida')
  const sociosInactivos = socios.filter(s => s.estadoPago === 'Inactivo')

  // Extraer consultas pendientes de todos los profesores
  const todasLasConsultas = []
  profesores.forEach(p => {
    (p.consultasAcordadas || []).forEach(c => {
      todasLasConsultas.push({
        ...c,
        profesorNombre: `${p.nombre} ${p.apellido}`,
        profesorEspecialidad: p.especialidad
      })
    })
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fde8e9] text-[#e41d28]">
              <Bell size={18} />
            </span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Centro de Notificaciones & Alertas</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Monitoreo proactivo de vencimientos, consultas acordadas y novedades operativas.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#f1f3f5] p-1 rounded-2xl border border-[#e0e0e0] w-fit">
          <button
            onClick={() => setTab('gimnasio')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'gimnasio' ? 'bg-[#121212] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            🏢 Gimnasio ({sociosEnCobro.length + sociosVencidos.length})
          </button>
          <button
            onClick={() => setTab('profesores')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'profesores' ? 'bg-[#121212] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            🏋️ Profesores ({todasLasConsultas.length})
          </button>
          <button
            onClick={() => setTab('socios')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'socios' ? 'bg-[#121212] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            👥 Socios & Cumpleaños ({sociosInactivos.length})
          </button>
        </div>
      </div>

      {/* ==========================================
          PESTAÑA 1: GIMNASIO (VENCIMIENTOS Y ALERTAS)
         ========================================== */}
      {tab === 'gimnasio' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cuotas por Vencer (Próximos 7 días) */}
            <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold">
                    <Clock size={16} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#1a1a1a]">En Fecha de Cobro (Próximos 7 días)</h3>
                    <p className="text-[11px] text-gray-500">Avisar con recordatorio de renovación</p>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                  {sociosEnCobro.length} socios
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sociosEnCobro.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No hay socios en fecha de cobro inmediata.</p>
                ) : (
                  sociosEnCobro.map(s => (
                    <div key={s.id} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-[#1a1a1a]">{s.nombre} {s.apellido}</p>
                        <p className="text-[10px] text-gray-500">Plan {s.tipoSuscripcion || s.suscripcion} · Vence {formatearFecha(s.fechaVencimiento || s.fechaVto)}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        {s.telefono}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cuotas Vencidas */}
            <div className="bg-white rounded-3xl border border-red-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-red-100 text-[#e41d28] font-bold">
                    <AlertCircle size={16} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#1a1a1a]">Cuotas Vencidas Activas</h3>
                    <p className="text-[11px] text-gray-500">Requiere regularización inmediata</p>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-100 text-[#e41d28]">
                  {sociosVencidos.length} socios
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sociosVencidos.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">Todos los socios están al día.</p>
                ) : (
                  sociosVencidos.map(s => (
                    <div key={s.id} className="p-3 rounded-2xl bg-red-50/50 border border-red-200/80 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-[#1a1a1a]">{s.nombre} {s.apellido}</p>
                        <p className="text-[10px] text-gray-500">Venció: {formatearFecha(s.fechaVencimiento || s.fechaVto)}</p>
                      </div>
                      <span className="text-[10px] font-black text-[#e41d28] bg-red-100 px-2 py-0.5 rounded-md">
                        {s.telefono}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PESTAÑA 2: PROFESORES (CONSULTAS Y EVALUACIONES)
         ========================================== */}
      {tab === 'profesores' && (
        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
            <div>
              <h3 className="font-black text-base text-[#1a1a1a]">Consultas Nutricionales & Evaluaciones Físicas</h3>
              <p className="text-xs text-gray-500">Turnos acordados entre staff profesional y socios</p>
            </div>
            <span className="text-xs font-bold bg-[#f1f3f5] px-3 py-1 rounded-full">
              {todasLasConsultas.length} Programadas
            </span>
          </div>

          <div className="space-y-3">
            {todasLasConsultas.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No hay consultas acordadas registradas.</p>
            ) : (
              todasLasConsultas.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-xs text-[#1a1a1a]">{c.motivo}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {c.estado}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Socio: <strong className="text-[#1a1a1a]">{c.socioNombre}</strong> · Profesional: <strong>{c.profesorNombre}</strong> ({c.profesorEspecialidad})
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="font-bold text-[#e41d28] bg-[#fde8e9] px-2.5 py-1 rounded-lg">
                      {c.fecha} - {c.hora} hs
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          PESTAÑA 3: SOCIOS & INACTIVOS
         ========================================== */}
      {tab === 'socios' && (
        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
            <div>
              <h3 className="font-black text-base text-[#1a1a1a]">Socios Inactivos (+90 días sin abonar)</h3>
              <p className="text-xs text-gray-500">Candidatos a campaña de reactivación por WhatsApp o email</p>
            </div>
            <span className="text-xs font-bold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
              {sociosInactivos.length} Inactivos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sociosInactivos.map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-gray-800">{s.nombre} {s.apellido}</p>
                  <p className="text-[10px] text-gray-500">Último plan: {s.tipoSuscripcion || s.suscripcion} · Venció: {formatearFecha(s.fechaVencimiento || s.fechaVto)}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-md">
                  {s.telefono}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
