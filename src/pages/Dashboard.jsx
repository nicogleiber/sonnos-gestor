import { useState } from 'react'
import {
  Users,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Flame,
  CreditCard,
  X,
  CheckCircle2,
  Calendar,
  Sparkles,
  UserCheck,
  ShoppingBag,
  Activity
} from 'lucide-react'
import { useSocios } from '../context/SociosContext'
import { useTarifas } from '../context/TarifasContext'
import { useCalendario } from '../context/CalendarioContext'
import { usePersonal } from '../context/PersonalContext'
import { useCaja } from '../context/CajaContext'
import { getEstadoPago, formatearFecha } from '../utils/paymentUtils'

// ============================================
// MODAL: DESGLOSE COMPLETO DE SOCIOS
// ============================================
function ModalDesgloseSocios({ isOpen, onClose, socios }) {
  if (!isOpen) return null

  const alDia = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'al-dia')
  const enCobro = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'cobro')
  const vencidos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'vencido')
  const inactivos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'inactivo')

  const totalActivos = alDia.length + enCobro.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#e0e0e0] flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Desglose Detallado del Padrón de Socios</h3>
              <p className="text-xs text-gray-400">Total en base de datos: {socios.length} socios</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* 4 Categorías Detalladas */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Activos (Verde) */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-[11px] font-bold text-emerald-800 uppercase">Activos al Día</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{alDia.length}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Cuota al corriente</p>
            </div>

            {/* En Fecha de Cobro (Amarillo) */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-[11px] font-bold text-amber-800 uppercase">En Fecha Cobro</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{enCobro.length}</p>
              <p className="text-[10px] text-amber-600 mt-0.5">Vence en ≤ 7 días</p>
            </div>

            {/* Vencidos (Rojo) */}
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
              <p className="text-[11px] font-bold text-red-800 uppercase">Cuotas Vencidas</p>
              <p className="text-2xl font-black text-red-600 mt-1">{vencidos.length}</p>
              <p className="text-[10px] text-red-500 mt-0.5">Vencidas ≤ 90 días</p>
            </div>

            {/* Inactivos (Gris) */}
            <div className="p-4 rounded-2xl bg-gray-100 border border-gray-300">
              <p className="text-[11px] font-bold text-gray-700 uppercase">Inactivos</p>
              <p className="text-2xl font-black text-gray-700 mt-1">{inactivos.length}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">+90 días sin pago</p>
            </div>
          </div>

          {/* Lista Resumida de Socios Vencidos e Inactivos para Gestión */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Socios que Requieren Acción Inmediata ({vencidos.length + enCobro.length})
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {[...vencidos, ...enCobro].map(s => {
                const est = getEstadoPago(s.fechaVencimiento || s.fechaVto)
                return (
                  <div key={s.id} className="p-3 rounded-2xl border border-[#e0e0e0] bg-[#f8f9fa] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-[#1a1a1a]">{s.nombre} {s.apellido}</p>
                      <p className="text-[10px] text-gray-500">{s.tipoSuscripcion || s.suscripcion} · Tel: {s.telefono}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${est.badgeClass}`}>
                      {est.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Total activos continuos: <strong className="text-[#1a1a1a]">{totalActivos} socios</strong> ({Math.round((totalActivos / (socios.length || 1)) * 100)}% de retención)
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#121212] text-white text-xs font-bold hover:bg-[#242424]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL: DASHBOARD
// ============================================
export default function Dashboard() {
  const { socios } = useSocios()
  const { getPlanByName } = useTarifas()
  const { eventos } = useCalendario()
  const { profesores } = usePersonal()
  const { movimientos } = useCaja()

  const [modalDesgloseOpen, setModalDesgloseOpen] = useState(false)

  const sociosAlDia = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'al-dia')
  const sociosEnCobro = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'cobro')
  const vencimientosProximos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'vencido')
  const sociosInactivos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'inactivo')

  const sociosActivosCount = sociosAlDia.length + sociosEnCobro.length

  // Recaudación real y proyectada
  const ingresosMensuales = socios.reduce((acc, s) => {
    const estado = getEstadoPago(s.fechaVencimiento || s.fechaVto)
    const plan = getPlanByName(s.tipoSuscripcion || s.suscripcion)
    const precio = plan?.precio || 18000
    return (estado.key === 'al-dia' || estado.key === 'cobro') ? acc + precio : acc
  }, 0)

  // Clases del lunes o día actual
  const diasSemanaNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const hoyDiaNombre = diasSemanaNombres[new Date().getDay()] || 'Lunes'
  const clasesHoy = eventos.filter(c => c.dia === hoyDiaNombre || c.dia === 'Lunes').sort((a, b) => a.horario.localeCompare(b.horario))

  // Consultas nutricionales acordadas
  const consultasProgramadas = []
  profesores.forEach(p => {
    (p.consultasAcordadas || []).forEach(c => {
      if (c.estado === 'Programada') {
        consultasProgramadas.push({ ...c, prof: `${p.nombre} ${p.apellido}` })
      }
    })
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Modal de Desglose */}
      <ModalDesgloseSocios
        isOpen={modalDesgloseOpen}
        onClose={() => setModalDesgloseOpen(false)}
        socios={socios}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#242424] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-[#242424]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#e41d28] text-white">
              Panel de Control Master
            </span>
            <span className="text-gray-400 text-xs font-medium">Conectado a MongoDB Atlas</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Bienvenido a <span className="text-[#e41d28]">Sonnos Gestor</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
            Métricas de socios en tiempo real, asistencia a clases, cierre de caja e inventario.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-[#121212] border border-[#333] px-4 py-3 rounded-2xl text-center shadow-inner">
            <p className="text-xs text-gray-400 font-medium">Estado General</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span> 100% Operativo
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Socios Activos (CLICKEABLE CON MODAL DE DESGLOSE) */}
        <div
          onClick={() => setModalDesgloseOpen(true)}
          className="bg-white rounded-3xl border border-[#e41d28]/40 ring-2 ring-[#e41d28]/20 transition-all duration-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Socios Activos</p>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {sociosAlDia.length} al día
                </span>
              </div>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{sociosActivosCount}</p>
              <p className="text-[11px] text-[#e41d28] font-black mt-2 flex items-center gap-1">
                Ver desglose completo →
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#e41d28] text-white shadow-md shadow-red-500/30 group-hover:rotate-6 transition-transform">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Ingresos Estimados */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ingresos Estimados</p>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">
                ${ingresosMensuales.toLocaleString('es-AR')}
              </p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                Membresías activas de musculación
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fde8e9] text-[#e41d28]">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* Clases Hoy */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Clases Hoy</p>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{clasesHoy.length}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                Cronograma activo ({hoyDiaNombre})
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fde8e9] text-[#e41d28]">
              <CalendarCheck size={22} />
            </div>
          </div>
        </div>

        {/* Padrón Total */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Padrón Total</p>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{socios.length}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                {sociosInactivos.length} inactivos (+90d)
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fde8e9] text-[#e41d28]">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Actividades y Alertas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Clases de Hoy */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#fde8e9] text-[#e41d28]">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Clases Programadas Hoy</h3>
                <p className="text-xs text-gray-500">Horarios y nivel de ocupación en salas</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f3f5] text-gray-700">
              {clasesHoy.length} Actividades
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {clasesHoy.map(clase => {
              const pct = Math.round((clase.inscriptos / clase.cupos) * 100)
              const isHigh = pct >= 90
              return (
                <div key={clase.id} className="flex items-center gap-4 py-3 px-3 rounded-2xl hover:bg-[#f8f9fa] border border-[#e0e0e0]/70 transition-colors">
                  <div className="w-14 text-center shrink-0">
                    <span className="text-xs font-black text-[#e41d28] bg-[#fde8e9] px-2 py-1 rounded-lg">
                      {clase.horario}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-[#1a1a1a] truncate">{clase.clase}</p>
                      {isHigh && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                          Lleno
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500">Prof. {clase.profesor} · <span className="text-gray-400">{clase.salon}</span></p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#1a1a1a]">{clase.inscriptos}/{clase.cupos}</span>
                    <p className="text-[10px] text-gray-400">{pct}% cupo</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Consultas Acordadas y Alertas */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#fde8e9] text-[#e41d28]">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Consultas Nutricionales & Evaluaciones</h3>
                <p className="text-xs text-gray-500">Turnos acordados entre staff y socios</p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#e41d28] text-white">
              {consultasProgramadas.length} Turnos
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {consultasProgramadas.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No hay consultas nutricionales pendientes.</p>
            ) : (
              consultasProgramadas.map((c, i) => (
                <div key={i} className="p-3.5 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#1a1a1a]">{c.motivo}</p>
                    <p className="text-[11px] text-gray-500">Socio: <strong>{c.socioNombre}</strong> · Profesional: {c.prof}</p>
                  </div>
                  <span className="text-xs font-bold text-[#e41d28] bg-[#fde8e9] px-2.5 py-1 rounded-xl">
                    {c.fecha} - {c.hora} hs
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
