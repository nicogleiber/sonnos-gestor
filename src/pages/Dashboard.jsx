import { Users, DollarSign, CalendarCheck, TrendingUp, AlertCircle, Clock, ArrowUpRight, Flame, CreditCard } from 'lucide-react'
import { socios } from '../data/mockData'
import { getEstadoPago, formatearFecha } from '../utils/paymentUtils'
import { useTarifas } from '../context/TarifasContext'
import { useCalendario } from '../context/CalendarioContext'

export default function Dashboard() {
  const { getPlanByName } = useTarifas()
  const { eventos } = useCalendario()

  const sociosAlDia = socios.filter(s => getEstadoPago(s.fechaVto).key === 'al-dia')
  const sociosEnCobro = socios.filter(s => getEstadoPago(s.fechaVto).key === 'cobro')
  const vencimientosProximos = socios.filter(s => getEstadoPago(s.fechaVto).key === 'vencido')

  const sociosActivosCount = sociosAlDia.length + sociosEnCobro.length

  const ingresosMensuales = socios.reduce((acc, s) => {
    const estado = getEstadoPago(s.fechaVto)
    const plan = getPlanByName(s.suscripcion)
    const precio = plan?.precio || 15000
    return estado.key !== 'vencido' ? acc + precio : acc
  }, 0)

  // Clases del lunes calculadas dinámicamente desde el Calendario
  const clasesLunes = eventos
    .filter(c => c.dia === 'Lunes')
    .sort((a, b) => a.horario.localeCompare(b.horario))

  const clasesHoyCount = clasesLunes.length

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#242424] text-white p-7 rounded-3xl shadow-xl border border-[#242424]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#e41d28] text-white">
              Panel de Control
            </span>
            <span className="text-gray-400 text-xs font-medium">Lunes 25 de Agosto, 2026</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Bienvenido a <span className="text-[#e41d28]">Sonnos Gestor</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Monitoreo en tiempo real de socios, recaudación estimada, cronograma de clases y estado de membresías.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-[#121212] border border-[#333] px-4 py-3 rounded-2xl text-center">
            <p className="text-xs text-gray-400 font-medium">Estado General</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span> 100% Operativo
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Socios Activos */}
        <div className="bg-white rounded-2xl border border-[#e41d28]/40 ring-1 ring-[#e41d28]/20 transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Socios Activos</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fde8e9] text-[#e41d28]">
                  {sociosAlDia.length} al día
                </span>
              </div>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{sociosActivosCount}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                {sociosEnCobro.length} en fecha de cobro · {vencimientosProximos.length} vencidos
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#e41d28] text-white shadow-md shadow-red-500/30">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* Ingresos Estimados */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0] transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ingresos Estimados</p>
              </div>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">
                ${ingresosMensuales.toLocaleString('es-AR')}
              </p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                Calculado con tarifas activas
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fde8e9] text-[#e41d28]">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* Clases Hoy */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0] transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Clases Hoy</p>
              </div>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{clasesHoyCount}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                Cronograma activo para Lunes ({clasesLunes.length} clases)
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fde8e9] text-[#e41d28]">
              <CalendarCheck size={22} />
            </div>
          </div>
        </div>

        {/* Total Padrón */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0] transition-all duration-200 p-6 shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Padrón Total</p>
              </div>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{socios.length}</p>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                Socios registrados en sistema
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#fde8e9] text-[#e41d28]">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Clases del día */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#fde8e9] text-[#e41d28]">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[#1a1a1a] text-base">Clases Programadas Hoy</h3>
                <p className="text-xs text-gray-500">Horarios y niveles de ocupación en salones</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f3f5] text-gray-700">
              {clasesLunes.length} Actividades
            </span>
          </div>
          <div className="space-y-1">
            {clasesLunes.map(clase => {
              const pct = Math.round((clase.inscriptos / clase.cupos) * 100)
              const isHigh = pct >= 90
              return (
                <div key={clase.id} className="flex items-center gap-4 py-3.5 border-b border-[#e0e0e0]/70 last:border-0 hover:bg-[#f8f9fa] px-3 rounded-xl transition-colors">
                  <div className="w-16 text-center shrink-0">
                    <span className="text-sm font-black text-[#e41d28] bg-[#fde8e9] px-2.5 py-1 rounded-lg">
                      {clase.horario}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#1a1a1a] truncate">{clase.clase}</p>
                      {clase.tipoEvento === 'Evento Único' && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-black uppercase">
                          Especial
                        </span>
                      )}
                      {isHigh && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fde8e9] text-[#e41d28]">
                          Casi lleno
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{clase.profesor} · <span className="text-gray-400">{clase.salon}</span></p>
                    <div className="mt-2 h-2 bg-[#f1f3f5] rounded-full w-full max-w-xs overflow-hidden border border-[#e0e0e0]">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 90 ? 'bg-[#e41d28]' : pct >= 70 ? 'bg-[#e41d28]/80' : 'bg-[#1a1a1a]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#1a1a1a]">{clase.inscriptos}</span>
                    <span className="text-xs text-gray-400">/{clase.cupos}</span>
                    <p className="text-[10px] text-gray-400 font-medium">{pct}% cupo</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alertas de Cuotas Vencidas / Por Cobrar */}
        <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e0e0e0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#fde8e9] text-[#e41d28]">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1a1a] text-base">Alertas de Vencimiento y Cobro</h3>
                  <p className="text-xs text-gray-500">Socios que requieren renovación o aviso de cobro</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#e41d28] text-white">
                {vencimientosProximos.length + sociosEnCobro.length} Alertas
              </span>
            </div>

            <div className="space-y-3">
              {/* Cuotas vencidas primero */}
              {vencimientosProximos.map(s => {
                const estado = getEstadoPago(s.fechaVto)
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3.5 p-3.5 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0] hover:border-[#e41d28]/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#e41d28] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                      {s.nombre[0]}{s.apellido[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1a1a1a] truncate">{s.nombre} {s.apellido}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Plan {s.suscripcion} · <span className="text-[#e41d28] font-semibold">{estado.description}</span> ({formatearFecha(s.fechaVto)})
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#e41d28] bg-[#fde8e9] px-3 py-1 rounded-full border border-[#e41d28]/20 shrink-0">
                      Vencido
                    </span>
                  </div>
                )
              })}

              {/* En fecha de cobro */}
              {sociosEnCobro.map(s => {
                const estado = getEstadoPago(s.fechaVto)
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3.5 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/80 hover:border-amber-400 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                      {s.nombre[0]}{s.apellido[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1a1a1a] truncate">{s.nombre} {s.apellido}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Plan {s.suscripcion} · <span className="text-amber-800 font-semibold">{estado.description}</span> ({formatearFecha(s.fechaVto)})
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shrink-0">
                      Por Cobrar
                    </span>
                  </div>
                )
              })}

              {vencimientosProximos.length === 0 && sociosEnCobro.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm font-medium">✅ Todos los socios se encuentran al día con sus cuotas.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e0e0e0] flex items-center justify-between text-xs text-gray-500">
            <span>Sugerencia: Cobrar con Mercado Pago o Efectivo</span>
            <span className="text-[#e41d28] font-bold">Módulo de Socios sincronizado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
