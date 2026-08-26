import { useState, useEffect } from 'react'
import {
  UserPlus,
  Search,
  X,
  Check,
  ChevronDown,
  CreditCard,
  QrCode,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  ReceiptText,
  BadgeCheck,
  DollarSign,
} from 'lucide-react'
import { socios as initialSocios } from '../data/mockData'
import { formatearFecha, getEstadoPago } from '../utils/paymentUtils'
import { useTarifas } from '../context/TarifasContext'

// ============================================
// COMPONENTE: INSIGNIA / CHIP DE ESTADO DINÁMICO
// ============================================
function StateBadge({ socio, onOpenCobro }) {
  const estadoInfo = getEstadoPago(socio.fechaVto)

  if (estadoInfo.key === 'al-dia') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Check size={13} className="stroke-[3]" />
        Al Día
        <span className="text-[10px] text-emerald-600 font-medium">({estadoInfo.diasRestantes}d)</span>
      </span>
    )
  }

  if (estadoInfo.key === 'cobro') {
    return (
      <button
        onClick={() => onOpenCobro(socio)}
        className="group inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
        title="Hacé clic para cobrar la cuota"
      >
        <Clock size={13} className="text-amber-600 animate-pulse" />
        En Fecha de Cobro
        <span className="text-[10px] bg-amber-200/80 text-amber-800 px-1.5 py-0.2 rounded font-black uppercase">
          Cobrar
        </span>
      </button>
    )
  }

  // Cuota Vencida
  return (
    <button
      onClick={() => onOpenCobro(socio)}
      className="group inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#fde8e9] text-[#e41d28] border border-[#e41d28]/30 hover:bg-[#fbd3d5] hover:border-[#e41d28] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
      title="Hacé clic para cobrar la cuota"
    >
      <AlertTriangle size={13} className="text-[#e41d28]" />
      Cuota Vencida
      <span className="text-[10px] bg-[#e41d28] text-white px-1.5 py-0.2 rounded font-black uppercase">
        Cobrar
      </span>
    </button>
  )
}

// ============================================
// MODAL: NUEVO SOCIO (Conexión dinámica con Tarifas)
// ============================================
function ModalNuevoSocio({ onClose, onSave }) {
  const { planesActivos, getPlanByName, calcularVencimientoPorPlan } = useTarifas()

  const defaultPlan = planesActivos[0]?.nombre || 'Mensual'
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    suscripcion: defaultPlan,
  })

  // Fecha calculada dinámicamente según el plan seleccionado en Tarifas
  const planSeleccionado = getPlanByName(form.suscripcion)
  const fechaVtoCalculada = calcularVencimientoPorPlan(new Date(), form.suscripcion)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...form,
      fechaVto: fechaVtoCalculada,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-wide">Nuevo Socio</h3>
              <p className="text-gray-400 text-xs">Tarifas y vencimiento sincronizados en tiempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#242424] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre</label>
              <input
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
                placeholder="Ej: Marcos"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Apellido</label>
              <input
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
                placeholder="Ej: Benítez"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              placeholder="011-XXXX-XXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              placeholder="socio@email.com"
            />
          </div>

          {/* Tipo de Suscripción poblado dinámicamente desde el módulo Tarifas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Tipo de Suscripción (Planes de Musculación)
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Desde Tarifas</span>
            </div>
            <div className="relative">
              <select
                name="suscripcion"
                value={form.suscripcion}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-bold"
              >
                {planesActivos.map(p => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre} — ${p.precio.toLocaleString('es-AR')} ({p.meses} {p.meses === 1 ? 'mes' : 'meses'})
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Fecha de Vencimiento Calculada Automáticamente (Read-Only) */}
          <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#e41d28]" />
                Fecha de Vencimiento (Automática)
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Auto +{planSeleccionado.meses} {planSeleccionado.meses === 1 ? 'mes' : 'meses'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <p className="text-base font-black text-[#1a1a1a]">
                {formatearFecha(fechaVtoCalculada)}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {fechaVtoCalculada}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Calculada a partir de hoy con el arancel vigente de <strong>${planSeleccionado.precio?.toLocaleString('es-AR')}</strong>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-3 text-sm font-bold hover:bg-[#f1f3f5] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#e41d28] text-white rounded-xl py-3 text-sm font-black hover:bg-[#c71620] transition-colors shadow-lg shadow-red-600/30 uppercase tracking-wider"
            >
              Guardar Socio
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// MODAL: COBRAR CUOTA (Mercado Pago / Efectivo)
// ============================================
function ModalCobro({ socio, onClose, onMarcarPagado }) {
  const { getPlanByName, calcularVencimientoPorPlan } = useTarifas()
  const [metodo, setMetodo] = useState('mp') // 'mp' | 'efectivo'

  const planInfo = getPlanByName(socio.suscripcion)
  const nuevaFechaVto = calcularVencimientoPorPlan(new Date(), socio.suscripcion)
  const estadoActual = getEstadoPago(socio.fechaVto)

  const handleConfirmarPago = () => {
    onMarcarPagado(socio.id, nuevaFechaVto, metodo)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        {/* Header Modal */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e41d28] text-white flex items-center justify-center font-black text-base shadow-md">
              {socio.nombre[0]}{socio.apellido[0]}
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-wide">
                Cobrar Cuota — {socio.nombre} {socio.apellido}
              </h3>
              <p className="text-gray-400 text-xs">
                Plan {socio.suscripcion} · Estado actual: <span className={estadoActual.key === 'vencido' ? 'text-[#e41d28] font-bold' : 'text-amber-400 font-bold'}>{estadoActual.estado}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#242424] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Desglose del Monto */}
          <div className="bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Concepto</p>
                <p className="text-sm font-black text-[#1a1a1a]">Renovación Plan {planInfo.nombre}</p>
                <p className="text-[11px] text-gray-400">Arancel fijado en Tarifas</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Monto Total</p>
                <p className="text-2xl font-black text-[#e41d28] tracking-tight">
                  ${planInfo.precio.toLocaleString('es-AR')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Vencimiento anterior:</span>
                <span className="font-bold text-gray-700">{formatearFecha(socio.fechaVto)}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-600 block font-bold">Nuevo vencimiento:</span>
                <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  {formatearFecha(nuevaFechaVto)} (+{planInfo.meses}m)
                </span>
              </div>
            </div>
          </div>

          {/* Selector de Método de Pago */}
          <div className="flex bg-[#f1f3f5] p-1 rounded-2xl border border-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setMetodo('mp')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                metodo === 'mp'
                  ? 'bg-[#009ee3] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1a1a1a]'
              }`}
            >
              <QrCode size={15} />
              Mercado Pago QR
            </button>
            <button
              type="button"
              onClick={() => setMetodo('efectivo')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                metodo === 'efectivo'
                  ? 'bg-[#121212] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1a1a1a]'
              }`}
            >
              <DollarSign size={15} />
              Efectivo / Transferencia
            </button>
          </div>

          {/* Contenido según método */}
          {metodo === 'mp' ? (
            <div className="bg-gradient-to-b from-[#f4faff] to-[#ffffff] rounded-2xl border border-[#009ee3]/30 p-5 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#009ee3]/10 text-[#009ee3] border border-[#009ee3]/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#009ee3] animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider">Mercado Pago Oficial</span>
              </div>

              {/* QR Simulado */}
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-2 border-[#009ee3]/30 shadow-lg flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#121212]">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#009ee3" rx="2" />

                  <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#009ee3" rx="2" />

                  <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#009ee3" rx="2" />

                  <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="46" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="56" y="8" width="6" height="6" fill="currentColor" />
                  <rect x="36" y="18" width="12" height="6" fill="currentColor" />
                  <rect x="52" y="18" width="6" height="12" fill="currentColor" />

                  <rect x="8" y="36" width="6" height="12" fill="currentColor" />
                  <rect x="18" y="36" width="12" height="6" fill="currentColor" />
                  <rect x="8" y="52" width="12" height="6" fill="currentColor" />

                  <rect x="36" y="36" width="28" height="28" fill="#009ee3" rx="4" />
                  <text x="50" y="54" fontSize="11" fill="white" fontWeight="900" textAnchor="middle">MP</text>

                  <rect x="68" y="36" width="6" height="12" fill="currentColor" />
                  <rect x="78" y="42" width="14" height="6" fill="currentColor" />
                  <rect x="68" y="54" width="24" height="6" fill="currentColor" />

                  <rect x="36" y="68" width="12" height="6" fill="currentColor" />
                  <rect x="52" y="68" width="6" height="12" fill="currentColor" />
                  <rect x="62" y="78" width="12" height="6" fill="currentColor" />
                  <rect x="78" y="68" width="14" height="6" fill="currentColor" />
                  <rect x="36" y="78" width="6" height="14" fill="currentColor" />
                  <rect x="46" y="86" width="12" height="6" fill="currentColor" />
                  <rect x="62" y="86" width="14" height="6" fill="currentColor" />
                  <rect x="80" y="86" width="12" height="6" fill="currentColor" />
                </svg>
              </div>

              <p className="text-xs font-bold text-[#1a1a1a] mt-3">
                Escaneá con la app de Mercado Pago para pagar
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Alias de Cobro: <strong className="font-mono text-[#009ee3]">sonnos.gestor.mp</strong>
              </p>
            </div>
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0] p-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#121212] text-white flex items-center justify-center mx-auto mb-3">
                <ReceiptText size={26} className="text-[#e41d28]" />
              </div>
              <h4 className="font-black text-[#1a1a1a] text-sm">Cobro en Mostrador / Transferencia</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Registra el cobro manual recibido en caja en efectivo o transferencia bancaria directa.
              </p>
              <div className="mt-3 p-2.5 bg-white rounded-xl border border-[#e0e0e0] text-xs font-mono text-gray-600">
                CVU: 0000003100045892110293 · CUIT: 30-71829304-9
              </div>
            </div>
          )}

          {/* Botón Principal de Confirmación */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleConfirmarPago}
              className="w-full flex items-center justify-center gap-2 bg-[#e41d28] text-white py-3.5 px-4 rounded-2xl text-sm font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider active:scale-98 cursor-pointer"
            >
              <BadgeCheck size={18} />
              Marcar como Pagado ({metodo === 'mp' ? 'Mercado Pago' : 'Efectivo / Transf.'})
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 py-2 transition-colors cursor-pointer"
            >
              Cancelar y volver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL DE SOCIOS
// ============================================
export default function Socios() {
  const { planes } = useTarifas()
  const [socios, setSocios] = useState(initialSocios)
  const [busqueda, setBusqueda] = useState('')
  const [filtroSub, setFiltroSub] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [showModalNuevo, setShowModalNuevo] = useState(false)
  const [socioACobrar, setSocioACobrar] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Guardar nuevo socio
  const handleSaveNuevo = (form) => {
    const nuevoSocio = {
      id: Date.now(),
      ...form,
    }
    setSocios(prev => [nuevoSocio, ...prev])
    mostrarToast(`✅ Socio ${form.nombre} ${form.apellido} registrado con éxito.`)
  }

  // Marcar como pagado y renovar fecha de vencimiento
  const handleMarcarPagado = (socioId, nuevoVencimiento, metodoPago) => {
    setSocios(prev =>
      prev.map(s => {
        if (s.id === socioId) {
          return {
            ...s,
            fechaVto: nuevoVencimiento,
          }
        }
        return s
      })
    )
    const metodoLabel = metodoPago === 'mp' ? 'Mercado Pago' : 'Efectivo / Transferencia'
    mostrarToast(`🎉 ¡Pago registrado vía ${metodoLabel}! Cuota renovada al día.`)
  }

  const mostrarToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Filtrado dinámico
  const filtered = socios.filter(s => {
    const matchBusqueda = `${s.nombre} ${s.apellido} ${s.email} ${s.telefono}`.toLowerCase().includes(busqueda.toLowerCase())
    const matchSub = filtroSub === 'Todos' || s.suscripcion === filtroSub

    const estadoInfo = getEstadoPago(s.fechaVto)
    let matchEstado = true
    if (filtroEstado === 'Al día') matchEstado = estadoInfo.key === 'al-dia'
    else if (filtroEstado === 'En Fecha de Cobro') matchEstado = estadoInfo.key === 'cobro'
    else if (filtroEstado === 'Cuota Vencida') matchEstado = estadoInfo.key === 'vencido'

    return matchBusqueda && matchSub && matchEstado
  })

  // Contadores dinámicos
  const totalAlDia = socios.filter(s => getEstadoPago(s.fechaVto).key === 'al-dia').length
  const totalEnCobro = socios.filter(s => getEstadoPago(s.fechaVto).key === 'cobro').length
  const totalVencidos = socios.filter(s => getEstadoPago(s.fechaVto).key === 'vencido').length

  const listaOpcionesPlanes = ['Todos', ...planes.map(p => p.nombre)]

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white border border-[#242424] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles size={18} className="text-[#e41d28]" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Modales */}
      {showModalNuevo && (
        <ModalNuevoSocio
          onClose={() => setShowModalNuevo(false)}
          onSave={handleSaveNuevo}
        />
      )}

      {socioACobrar && (
        <ModalCobro
          socio={socioACobrar}
          onClose={() => setSocioACobrar(null)}
          onMarcarPagado={handleMarcarPagado}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Gestión de Socios</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mt-1">
            <span className="text-gray-500">{socios.length} registrados ·</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {totalAlDia} al día
            </span>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
              {totalEnCobro} por cobrar
            </span>
            <span className="text-[#e41d28] bg-[#fde8e9] px-2 py-0.5 rounded-md border border-[#e41d28]/20">
              {totalVencidos} vencidos
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowModalNuevo(true)}
          className="flex items-center justify-center gap-2 bg-[#e41d28] text-white px-5 py-3 rounded-2xl text-sm font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider active:scale-95 cursor-pointer"
        >
          <UserPlus size={17} />
          Nuevo Socio
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e0e0e0] shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, apellido, email o teléfono..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
          />
        </div>

        <div className="relative">
          <select
            value={filtroSub}
            onChange={e => setFiltroSub(e.target.value)}
            className="appearance-none bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl pl-4 pr-9 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e41d28] transition-all"
          >
            {listaOpcionesPlanes.map(t => <option key={t} value={t}>{t === 'Todos' ? 'Todos los planes' : `Plan ${t}`}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="appearance-none bg-[#f8f9fa] border border-[#e0e0e0] rounded-xl pl-4 pr-9 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e41d28] transition-all"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Al día">Al Día (Verde)</option>
            <option value="En Fecha de Cobro">En Fecha de Cobro (Amarillo)</option>
            <option value="Cuota Vencida">Cuota Vencida (Rojo)</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {(busqueda || filtroSub !== 'Todos' || filtroEstado !== 'Todos') && (
          <button
            onClick={() => { setBusqueda(''); setFiltroSub('Todos'); setFiltroEstado('Todos'); }}
            className="text-xs text-[#e41d28] font-bold px-3 py-2 hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table Component */}
      <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
                <th className="text-left text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Socio</th>
                <th className="text-left text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Teléfono</th>
                <th className="text-left text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Suscripción</th>
                <th className="text-left text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Vencimiento</th>
                <th className="text-left text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Estado de Pago</th>
                <th className="text-right text-xs font-black text-gray-500 uppercase tracking-wider px-6 py-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {filtered.map((s) => {
                return (
                  <tr key={s.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#121212] text-white flex items-center justify-center font-black text-xs shadow-sm">
                          {s.nombre[0]}{s.apellido[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1a1a1a]">{s.nombre} {s.apellido}</p>
                          <p className="text-[11px] text-gray-400">ID #{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap font-medium">{s.telefono}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{s.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-[#1a1a1a] bg-[#f1f3f5] border border-[#e0e0e0] px-3 py-1 rounded-lg">
                        {s.suscripcion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-medium">
                      {formatearFecha(s.fechaVto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StateBadge socio={s} onOpenCobro={setSocioACobrar} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSocioACobrar(s)}
                        className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#e0e0e0] text-gray-700 hover:bg-[#121212] hover:text-white hover:border-[#121212] transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <CreditCard size={13} />
                        Cobrar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-[#fde8e9] text-[#e41d28] flex items-center justify-center mx-auto mb-3">
              <Search size={22} />
            </div>
            <p className="text-base font-bold text-[#1a1a1a]">No se encontraron socios</p>
            <p className="text-xs text-gray-400 mt-1">Prueba cambiando los criterios de búsqueda o filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
