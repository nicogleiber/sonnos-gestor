import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  X,
  ArrowRight,
  Wallet,
  Calendar,
  Layers
} from 'lucide-react'
import { useSocios } from '../context/SociosContext'
import { useTarifas } from '../context/TarifasContext'
import { useCalendario } from '../context/CalendarioContext'
import { getEstadoPago } from '../utils/paymentUtils'

// ============================================
// MODAL: DESGLOSE COMPLETO DE SOCIOS
// ============================================
function ModalDesgloseSocios({ isOpen, onClose, socios }) {
  const navigate = useNavigate()
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
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
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
          <button
            onClick={() => {
              onClose()
              navigate('/socios')
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#e41d28] hover:underline cursor-pointer"
          >
            <span>Ver listado completo en Socios</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#121212] text-white text-xs font-bold hover:bg-[#242424] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MODAL: DESGLOSE DE INGRESOS ESTIMADOS
// ============================================
function ModalDesgloseIngresos({ isOpen, onClose, socios, planes, ingresosTotal }) {
  const navigate = useNavigate()
  if (!isOpen) return null

  // Agrupación por plan
  const desglosePlanes = {}
  socios.forEach(s => {
    const estado = getEstadoPago(s.fechaVencimiento || s.fechaVto)
    if (estado.key === 'al-dia' || estado.key === 'cobro') {
      const planNombre = s.tipoSuscripcion || s.suscripcion || 'Pase Libre Mensual'
      if (!desglosePlanes[planNombre]) {
        const planObj = planes.find(p => p.nombre?.toLowerCase() === planNombre.toLowerCase())
        desglosePlanes[planNombre] = {
          nombre: planNombre,
          cantidad: 0,
          precioUnitario: planObj?.precio || 18000,
          total: 0
        }
      }
      desglosePlanes[planNombre].cantidad += 1
      desglosePlanes[planNombre].total += desglosePlanes[planNombre].precioUnitario
    }
  })

  const listaPlanes = Object.values(desglosePlanes)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#e0e0e0] flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Desglose de Ingresos Estimados</h3>
              <p className="text-xs text-gray-400">Proyección mensual según membresías activas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Banner Total */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121212] to-[#242424] text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recaudación Estimada Mensual</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                ${ingresosTotal.toLocaleString('es-AR')}
              </p>
            </div>
            <button
              onClick={() => {
                onClose()
                navigate('/caja')
              }}
              className="flex items-center gap-2 bg-[#e41d28] text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md transition-all cursor-pointer"
            >
              <Wallet size={14} />
              <span>Ver Caja</span>
            </button>
          </div>

          {/* Lista de planes activos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Desglose por Plan de Membresía
            </h4>

            <div className="space-y-2">
              {listaPlanes.map(item => (
                <div
                  key={item.nombre}
                  className="p-4 rounded-2xl border border-[#e0e0e0] bg-[#f8f9fa] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-[#e0e0e0] text-[#e41d28]">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#1a1a1a]">{item.nombre}</h5>
                      <p className="text-xs text-gray-500">
                        {item.cantidad} socios activos (${item.precioUnitario.toLocaleString('es-AR')} c/u)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#1a1a1a]">
                      ${item.total.toLocaleString('es-AR')}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {Math.round((item.total / (ingresosTotal || 1)) * 100)}% del total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Calculado en base a socios al día y en fecha de cobro.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#121212] text-white text-xs font-bold hover:bg-[#242424] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MODAL: DETALLE DE CLASES DE HOY
// ============================================
function ModalClasesHoy({ isOpen, onClose, clases, diaNombre }) {
  const navigate = useNavigate()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#e0e0e0] flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Clases Programadas para Hoy</h3>
              <p className="text-xs text-gray-400">
                Cronograma activo ({diaNombre}) · {clases.length} actividades programadas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Listado de Clases */}
        <div className="p-6 space-y-3 overflow-y-auto max-h-[70vh]">
          {clases.length === 0 ? (
            <div className="p-8 text-center bg-[#f8f9fa] rounded-2xl border border-dashed border-[#e0e0e0]">
              <CalendarCheck size={36} className="text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-700">No hay clases programadas para hoy</p>
              <p className="text-xs text-gray-400 mt-1">
                Consulta el calendario para verificar las actividades de los próximos días.
              </p>
            </div>
          ) : (
            clases.map(clase => {
              const inscriptos = clase.inscriptos || 0
              const cupos = clase.cupos || 20
              const pct = Math.min(100, Math.round((inscriptos / cupos) * 100))
              const isHigh = pct >= 90
              const isFull = inscriptos >= cupos

              return (
                <div
                  key={clase.id}
                  className="p-4 rounded-2xl border border-[#e0e0e0] bg-[#f8f9fa] hover:bg-white hover:border-[#e41d28]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 text-center shrink-0">
                      <span className="text-xs font-black text-[#e41d28] bg-[#fde8e9] px-2.5 py-1.5 rounded-xl block">
                        {clase.horario}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-[#1a1a1a]">{clase.clase}</h4>
                        {isFull ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Agotado
                          </span>
                        ) : isHigh ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Últimos cupos
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Cupos disponibles
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Prof. <strong className="text-gray-700">{clase.profesor}</strong> · <span className="text-gray-500">{clase.salon}</span>
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                    <span className="text-xs font-black text-[#1a1a1a]">
                      {inscriptos}/{cupos} <span className="text-gray-400 font-normal text-[10px]">inscriptos</span>
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between">
          <button
            onClick={() => {
              onClose()
              navigate('/calendario')
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#e41d28] hover:underline cursor-pointer"
          >
            <span>Ver cronograma completo en Calendario</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#121212] text-white text-xs font-bold hover:bg-[#242424] transition-colors cursor-pointer"
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
  const navigate = useNavigate()
  const { socios } = useSocios()
  const { planes, getPlanByName } = useTarifas()
  const { eventos } = useCalendario()

  const [modalDesgloseOpen, setModalDesgloseOpen] = useState(false)
  const [modalIngresosOpen, setModalIngresosOpen] = useState(false)
  const [modalClasesHoyOpen, setModalClasesHoyOpen] = useState(false)

  const sociosAlDia = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'al-dia')
  const sociosEnCobro = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'cobro')
  const sociosInactivos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'inactivo')

  const sociosActivosCount = sociosAlDia.length + sociosEnCobro.length

  // Recaudación real y proyectada
  const ingresosMensuales = socios.reduce((acc, s) => {
    const estado = getEstadoPago(s.fechaVencimiento || s.fechaVto)
    const plan = getPlanByName(s.tipoSuscripcion || s.suscripcion)
    const precio = plan?.precio || 18000
    return (estado.key === 'al-dia' || estado.key === 'cobro') ? acc + precio : acc
  }, 0)

  // Clases del día actual
  const diasSemanaNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const hoyDiaNombre = diasSemanaNombres[new Date().getDay()] || 'Lunes'
  const clasesHoy = eventos.filter(c => c.dia === hoyDiaNombre || c.dia === 'Lunes').sort((a, b) => a.horario.localeCompare(b.horario))

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Modal 1: Desglose de Socios */}
      <ModalDesgloseSocios
        isOpen={modalDesgloseOpen}
        onClose={() => setModalDesgloseOpen(false)}
        socios={socios}
      />

      {/* Modal 2: Desglose de Ingresos */}
      <ModalDesgloseIngresos
        isOpen={modalIngresosOpen}
        onClose={() => setModalIngresosOpen(false)}
        socios={socios}
        planes={planes || []}
        ingresosTotal={ingresosMensuales}
      />

      {/* Modal 3: Clases de Hoy */}
      <ModalClasesHoy
        isOpen={modalClasesHoyOpen}
        onClose={() => setModalClasesHoyOpen(false)}
        clases={clasesHoy}
        diaNombre={hoyDiaNombre}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#242424] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-[#242424]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#e41d28] text-white">
              Panel de Control Master
            </span>
            <span className="text-gray-400 text-xs font-medium">Gestión Integral del Gimnasio</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Bienvenido a <span className="text-[#e41d28]">Sonnos Gestor</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
            Métricas de socios en tiempo real, asistencia a clases, planes y control operativo.
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

      {/* Metric Cards Grid: TODAS LAS CARDS SON INTERACTIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* 1. Socios Activos (INTERACTIVA - Abre Modal Desglose) */}
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

        {/* 2. Ingresos Estimados (INTERACTIVA - Abre Modal Desglose Ingresos) */}
        <div
          onClick={() => setModalIngresosOpen(true)}
          className="bg-white rounded-3xl border border-[#e41d28]/40 ring-2 ring-[#e41d28]/20 transition-all duration-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ingresos Estimados</p>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">
                ${ingresosMensuales.toLocaleString('es-AR')}
              </p>
              <p className="text-[11px] text-[#e41d28] font-black mt-2 flex items-center gap-1">
                Ver detalle de ingresos →
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#e41d28] text-white shadow-md shadow-red-500/30 group-hover:rotate-6 transition-transform">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* 3. Clases Hoy (INTERACTIVA - Abre Modal Clases Hoy) */}
        <div
          onClick={() => setModalClasesHoyOpen(true)}
          className="bg-white rounded-3xl border border-[#e41d28]/40 ring-2 ring-[#e41d28]/20 transition-all duration-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Clases Hoy</p>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{clasesHoy.length}</p>
              <p className="text-[11px] text-[#e41d28] font-black mt-2 flex items-center gap-1">
                Ver cronograma de hoy →
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#e41d28] text-white shadow-md shadow-red-500/30 group-hover:rotate-6 transition-transform">
              <CalendarCheck size={22} />
            </div>
          </div>
        </div>

        {/* 4. Padrón Total (INTERACTIVA - Navega al Padrón de Socios) */}
        <div
          onClick={() => navigate('/socios')}
          className="bg-white rounded-3xl border border-[#e41d28]/40 ring-2 ring-[#e41d28]/20 transition-all duration-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Padrón Total</p>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{socios.length}</p>
              <p className="text-[11px] text-[#e41d28] font-black mt-2 flex items-center gap-1">
                Ir al padrón de socios →
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#e41d28] text-white shadow-md shadow-red-500/30 group-hover:rotate-6 transition-transform">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


