import { useState } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
  X,
  Sparkles,
  ReceiptText,
  BadgeCheck,
  Building2,
  CalendarDays,
  MessageSquare,
  History,
  CheckSquare,
  Square,
  User,
  Trash2,
  Edit2
} from 'lucide-react'
import { useSocios } from '../context/SociosContext'
import { useTarifas } from '../context/TarifasContext'
import { getEstadoPago, formatearFecha } from '../utils/paymentUtils'
import WhatsAppModal from '../components/WhatsAppModal'

// ============================================
// MODAL: NUEVO SOCIO
// ============================================
function ModalNuevoSocio({ onClose, onSave }) {
  const { planesActivos, calcularVencimientoPorPlan } = useTarifas()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    dni: '',
    genero: 'Prefiero no decirlo',
    suscripcion: planesActivos[0]?.nombre || 'Pase Libre Mensual',
    observaciones: '',
  })

  const fechaVencimientoCalculada = calcularVencimientoPorPlan(new Date(), form.suscripcion)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      tipoSuscripcion: form.suscripcion,
      fechaVencimiento: fechaVencimientoCalculada,
      fechaVto: fechaVencimientoCalculada,
      fechaAlta: new Date().toISOString(),
      estadoPago: 'Al Día',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        {/* Header Modal */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white font-bold">
              +
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-wide">Nuevo Socio</h3>
              <p className="text-gray-400 text-xs">Ingreso y cálculo automático de vencimiento</p>
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
                placeholder="Ej: Marcos"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Apellido</label>
              <input
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej: Rossi"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">DNI / Documento</label>
              <input
                name="dni"
                value={form.dni}
                onChange={handleChange}
                placeholder="Ej: 38192831"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Género</label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-medium"
              >
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teléfono (WhatsApp)</label>
              <input
                name="telefono"
                required
                value={form.telefono}
                onChange={handleChange}
                placeholder="11XXXXXXXX"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="socio@email.com"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Tipo de Suscripción</label>
            <select
              name="suscripcion"
              value={form.suscripcion}
              onChange={handleChange}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-medium"
            >
              {planesActivos.map(p => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre} ({p.meses} {p.meses === 1 ? 'mes' : 'meses'} - ${p.precio.toLocaleString('es-AR')})
                </option>
              ))}
            </select>
          </div>

          {/* Campo Informativo: Fecha de Vencimiento Calculada */}
          <div className="p-4 rounded-2xl bg-[#fde8e9] border border-[#e41d28]/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#e41d28] uppercase tracking-wide">Fecha de Vencimiento Calculada</p>
              <p className="text-base font-black text-[#1a1a1a] mt-0.5">
                {formatearFecha(fechaVencimientoCalculada)}
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#e41d28] border border-[#e41d28]/30 shadow-xs">
              Automático ⚡
            </span>
          </div>

          {/* Botones */}
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
  const [metodo, setMetodo] = useState('mp')

  const planInfo = getPlanByName(socio.suscripcion || socio.tipoSuscripcion)
  const nuevaFechaVto = calcularVencimientoPorPlan(new Date(), socio.suscripcion || socio.tipoSuscripcion)
  const estadoActual = getEstadoPago(socio.fechaVencimiento || socio.fechaVto)

  const handleConfirmarPago = () => {
    onMarcarPagado(socio.id, nuevaFechaVto, metodo, planInfo?.precio || 18000)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0]">
        {/* Header Modal */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Cobrar Cuota</h3>
              <p className="text-xs text-gray-400">Renovación de membresía Sonnos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Resumen Socio */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] flex items-center justify-between">
            <div>
              <h4 className="font-black text-base text-[#1a1a1a]">{socio.nombre} {socio.apellido}</h4>
              <p className="text-xs text-gray-500 mt-0.5">Plan {socio.tipoSuscripcion || socio.suscripcion}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Total a Cobrar</p>
              <p className="text-xl font-black text-[#e41d28]">
                ${(planInfo?.precio || 18000).toLocaleString('es-AR')}
              </p>
            </div>
          </div>

          {/* Selector de Método */}
          <div className="grid grid-cols-2 gap-2 bg-[#f1f3f5] p-1 rounded-2xl border border-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setMetodo('mp')}
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                metodo === 'mp' ? 'bg-[#009ee3] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
              }`}
            >
              📱 Mercado Pago
            </button>
            <button
              type="button"
              onClick={() => setMetodo('efectivo')}
              className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                metodo === 'efectivo' ? 'bg-[#121212] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
              }`}
            >
              💵 Efectivo / Transf.
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirmarPago}
            className="w-full flex items-center justify-center gap-2 bg-[#e41d28] text-white py-3.5 px-4 rounded-2xl text-sm font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider cursor-pointer"
          >
            <BadgeCheck size={18} />
            Confirmar y Registrar Pago
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL: SOCIOS
// ============================================
export default function Socios() {
  const { socios, addSocio, deleteSocio, registrarPago } = useSocios()
  const { planes } = useTarifas()

  const [busqueda, setBusqueda] = useState('')
  const [filtroSub, setFiltroSub] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroDesde, setFiltroDesde] = useState('')
  const [filtroHasta, setFiltroHasta] = useState('')
  const [filtroAbandonos, setFiltroAbandonos] = useState(false)

  const [showModalNuevo, setShowModalNuevo] = useState(false)
  const [socioACobrar, setSocioACobrar] = useState(null)
  const [sociosSeleccionados, setSociosSeleccionados] = useState([])
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const mostrarToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Checkbox handlers
  const toggleSelectSocio = (id) => {
    setSociosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (filteredList) => {
    if (sociosSeleccionados.length === filteredList.length) {
      setSociosSeleccionados([])
    } else {
      setSociosSeleccionados(filteredList.map(s => s.id))
    }
  }

  // Filtrado
  const filtered = socios.filter(s => {
    const matchBusqueda = `${s.nombre} ${s.apellido} ${s.email} ${s.telefono} ${s.dni || ''}`.toLowerCase().includes(busqueda.toLowerCase())
    const subActual = s.tipoSuscripcion || s.suscripcion
    const matchSub = filtroSub === 'Todos' || subActual === filtroSub

    const estadoInfo = getEstadoPago(s.fechaVencimiento || s.fechaVto)
    let matchEstado = true
    if (filtroEstado !== 'Todos') {
      matchEstado = estadoInfo.label.toLowerCase() === filtroEstado.toLowerCase()
    }

    // Filtro por fecha de alta
    let matchFechas = true
    if (filtroDesde && s.fechaAlta) {
      matchFechas = matchFechas && new Date(s.fechaAlta) >= new Date(filtroDesde)
    }
    if (filtroHasta && s.fechaAlta) {
      const h = new Date(filtroHasta)
      h.setHours(23, 59, 59)
      matchFechas = matchFechas && new Date(s.fechaAlta) <= h
    }

    // Filtro rápido: Abandonos Históricos (+6 meses / 180 días)
    if (filtroAbandonos) {
      const hace6Meses = new Date()
      hace6Meses.setDate(hace6Meses.getDate() - 180)
      const vto = new Date(s.fechaVencimiento || s.fechaVto)
      return vto <= hace6Meses
    }

    return matchBusqueda && matchSub && matchEstado && matchFechas
  })

  // Contadores para chips
  const totalAlDia = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'al-dia').length
  const totalEnCobro = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'cobro').length
  const totalVencidos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'vencido').length
  const totalInactivos = socios.filter(s => getEstadoPago(s.fechaVencimiento || s.fechaVto).key === 'inactivo').length

  const handleConfirmarCobro = async (id, nuevaFechaVto, metodo, monto) => {
    const metodoLabel = metodo === 'mp' ? 'Mercado Pago' : 'Efectivo / Transferencia'
    await registrarPago(id, {
      monto,
      metodoPago: metodo === 'mp' ? 'Mercado Pago' : 'Efectivo',
      nuevaFechaVto
    })
    mostrarToast(`🎉 ¡Pago registrado vía ${metodoLabel}! Cuota renovada al día.`)
  }

  const listaOpcionesPlanes = ['Todos', ...planes.map(p => p.nombre)]

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative space-y-6">
      {/* Toast */}
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
          onSave={async (nuevo) => {
            await addSocio(nuevo)
            mostrarToast('✅ Socio registrado exitosamente en MongoDB Atlas.')
          }}
        />
      )}

      {socioACobrar && (
        <ModalCobro
          socio={socioACobrar}
          onClose={() => setSocioACobrar(null)}
          onMarcarPagado={handleConfirmarCobro}
        />
      )}

      {showWhatsAppModal && (
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          sociosSeleccionados={socios.filter(s => sociosSeleccionados.includes(s.id))}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fde8e9] text-[#e41d28]">
              <Users size={18} />
            </span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Gestión de Socios</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Padrón de {socios.length} socios registrados · Conexión directa a MongoDB
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {sociosSeleccionados.length > 0 && (
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/30 cursor-pointer animate-in fade-in"
            >
              <MessageSquare size={16} />
              <span>Mensaje WhatsApp ({sociosSeleccionados.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowModalNuevo(true)}
            className="flex items-center gap-2 bg-[#e41d28] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
          >
            <UserPlus size={16} className="stroke-[3]" />
            <span>Nuevo Socio</span>
          </button>
        </div>
      </div>

      {/* Chips Interactivos de Estado de Pago (Filtrado con 1 Clic) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Al Día', count: totalAlDia, key: 'Al día', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
          { label: 'En Fecha de Cobro', count: totalEnCobro, key: 'En Fecha de Cobro', color: 'border-amber-200 bg-amber-50 text-amber-900' },
          { label: 'Cuota Vencida', count: totalVencidos, key: 'Cuota Vencida', color: 'border-red-200 bg-red-50 text-red-700' },
          { label: 'Inactivos (+90d)', count: totalInactivos, key: 'Inactivo', color: 'border-gray-300 bg-gray-100 text-gray-700' },
        ].map(chip => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              setFiltroAbandonos(false)
              setFiltroEstado(prev => prev === chip.key ? 'Todos' : chip.key)
            }}
            className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex items-center justify-between ${
              filtroEstado === chip.key
                ? `${chip.color} ring-2 ring-current font-black shadow-sm`
                : 'bg-white border-[#e0e0e0] hover:bg-[#f8f9fa]'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">{chip.label}</p>
              <p className="text-2xl font-black text-[#1a1a1a] mt-0.5">{chip.count}</p>
            </div>
            <span className="text-[10px] font-bold text-gray-400">Filtrar</span>
          </button>
        ))}
      </div>

      {/* Barra de Filtros y Rango de Fechas */}
      <div className="bg-white rounded-3xl border border-[#e0e0e0] p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Buscador */}
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, DNI, teléfono o email..."
              className="w-full bg-[#f8f9fa] border border-[#e0e0e0] focus:bg-white focus:border-[#e41d28] rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-[#1a1a1a]"
            />
          </div>

          {/* Selector de Plan */}
          <div>
            <select
              value={filtroSub}
              onChange={e => setFiltroSub(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#e0e0e0] rounded-2xl px-3 py-2 text-xs font-bold text-[#1a1a1a]"
            >
              {listaOpcionesPlanes.map(p => (
                <option key={p} value={p}>{p === 'Todos' ? 'Todos los planes' : p}</option>
              ))}
            </select>
          </div>

          {/* Filtro Rápido: Abandonos Históricos (+6 meses) */}
          <div>
            <button
              type="button"
              onClick={() => {
                setFiltroAbandonos(prev => !prev)
                setFiltroEstado('Todos')
              }}
              className={`w-full py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                filtroAbandonos
                  ? 'bg-[#121212] text-white shadow-sm'
                  : 'bg-[#f8f9fa] text-gray-600 border border-[#e0e0e0] hover:bg-[#f1f3f5]'
              }`}
            >
              <History size={14} className={filtroAbandonos ? 'text-[#e41d28]' : ''} />
              <span>Abandonos (+6 meses)</span>
            </button>
          </div>
        </div>

        {/* Rango de Fechas de Alta */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#e0e0e0] text-xs text-gray-500">
          <span className="font-bold flex items-center gap-1">
            <Calendar size={13} /> Alta desde:
          </span>
          <input
            type="date"
            value={filtroDesde}
            onChange={e => setFiltroDesde(e.target.value)}
            className="border border-[#e0e0e0] rounded-xl px-2.5 py-1 text-xs bg-white font-medium"
          />
          <span className="font-bold">Hasta:</span>
          <input
            type="date"
            value={filtroHasta}
            onChange={e => setFiltroHasta(e.target.value)}
            className="border border-[#e0e0e0] rounded-xl px-2.5 py-1 text-xs bg-white font-medium"
          />
          {(filtroDesde || filtroHasta) && (
            <button
              onClick={() => { setFiltroDesde(''); setFiltroHasta('') }}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Limpiar fechas
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Socios con Checkboxes */}
      <div className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e0e0e0] text-gray-500 font-bold uppercase tracking-wider">
                <th className="p-4 w-10">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(filtered)}
                    className="p-1 text-gray-500 hover:text-black"
                  >
                    {sociosSeleccionados.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare size={16} className="text-[#e41d28]" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="p-4">Socio / DNI</th>
                <th className="p-4">Contacto (Tel / Email)</th>
                <th className="p-4">Suscripción</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No se encontraron socios con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map(s => {
                  const estado = getEstadoPago(s.fechaVencimiento || s.fechaVto)
                  const isSelected = sociosSeleccionados.includes(s.id)

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-[#f8f9fa] transition-colors ${isSelected ? 'bg-[#fde8e9]/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleSelectSocio(s.id)}
                          className="p-1 text-gray-500"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-[#e41d28]" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Socio */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#121212] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {s.nombre[0]}{s.apellido[0]}
                          </div>
                          <div>
                            <p className="font-black text-[#1a1a1a] text-xs">{s.nombre} {s.apellido}</p>
                            <p className="text-[10px] text-gray-400">DNI: {s.dni || 'S/D'} · {s.genero || 'N/E'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="p-4">
                        <p className="font-bold text-[#1a1a1a]">{s.telefono}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{s.email}</p>
                      </td>

                      {/* Suscripción */}
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f1f3f5] font-bold text-gray-700">
                          {s.tipoSuscripcion || s.suscripcion}
                        </span>
                      </td>

                      {/* Vencimiento */}
                      <td className="p-4 font-bold text-gray-700">
                        {formatearFecha(s.fechaVencimiento || s.fechaVto)}
                      </td>

                      {/* Chip de Estado */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${estado.badgeClass}`}>
                          {estado.label}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSocioACobrar(s)}
                          className="px-3 py-1.5 rounded-xl bg-[#e41d28] text-white font-bold text-[11px] hover:bg-[#c71620] shadow-sm cursor-pointer"
                        >
                          Cobrar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar socio ${s.nombre} ${s.apellido}?`)) {
                              deleteSocio(s.id)
                            }
                          }}
                          className="p-1.5 rounded-lg border border-[#e0e0e0] text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
