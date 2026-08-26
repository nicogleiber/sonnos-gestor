import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User,
  X,
  Sparkles,
  AlertTriangle,
  Flame,
  Check,
  Star,
  Repeat,
  CalendarDays,
  UserPlus,
  Trash2,
} from 'lucide-react'
import { diasSemana, salones } from '../data/mockData'
import { useCalendario } from '../context/CalendarioContext'
import { usePersonal } from '../context/PersonalContext'

const HORAS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '17:00', '18:00', '19:00', '20:00', '21:00']

// Paleta institucional coherente y deportiva
const CLASS_STYLES = {
  'Spinning Intenso': 'bg-[#121212] text-white border-l-4 border-l-[#e41d28]',
  'Spinning Nocturno': 'bg-[#1a1a1a] text-white border-l-4 border-l-[#e41d28]',
  'Yoga Matutino': 'bg-[#fde8e9] text-[#1a1a1a] border-l-4 border-l-[#e41d28]',
  'Pilates Avanzado': 'bg-[#fde8e9] text-[#1a1a1a] border-l-4 border-l-[#e41d28]',
  'Funcional Express': 'bg-[#f1f3f5] text-[#1a1a1a] border-l-4 border-l-[#121212]',
  'Cross Training': 'bg-[#121212] text-white border-l-4 border-l-gray-400',
  'Zumba': 'bg-[#fff1f2] text-[#e41d28] border-l-4 border-l-[#e41d28]',
  'Musculación Libre': 'bg-[#f8f9fa] text-[#1a1a1a] border-l-4 border-l-[#e41d28]',
  'Seminario de Levantamiento Olímpico': 'bg-[#121212] text-amber-300 border-l-4 border-l-amber-400',
}

function getClassStyle(nombre) {
  return CLASS_STYLES[nombre] || 'bg-[#f1f3f5] text-[#1a1a1a] border-l-4 border-l-[#e41d28]'
}

// ============================================
// SUBMODAL: ALTA RÁPIDA DE PROFESOR
// ============================================
function SubModalRapidoProfesor({ onClose, onProfesorCreado }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    rol: 'Entrenador Personal',
  })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    onProfesorCreado(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0]">
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#e41d28]" />
            <h4 className="text-white font-black text-sm uppercase tracking-wide">Alta Rápida de Profesor</h4>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Nombre</label>
              <input
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Lucas"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Apellido</label>
              <input
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej: Silva"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Especialidad</label>
            <input
              name="especialidad"
              required
              value={form.especialidad}
              onChange={handleChange}
              placeholder="Ej: Cross Training & Fuerza"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="011-4500-XXXX"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a]"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e0e0e0] text-gray-600 rounded-xl py-2.5 text-xs font-bold hover:bg-[#f1f3f5] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#e41d28] text-white rounded-xl py-2.5 text-xs font-black hover:bg-[#c71620] uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer"
            >
              Guardar y Asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// MODAL: CREAR / EDITAR EVENTO DE CLASE
// ============================================
function ModalClaseEvento({ evento, prefill, onClose, onSave, onDelete }) {
  const { profesores, addProfesor } = usePersonal()
  const [showSubModalProf, setShowSubModalProf] = useState(false)

  const [form, setForm] = useState({
    clase: evento?.clase || '',
    salon: evento?.salon || salones[0]?.nombre || 'Salón Principal',
    profesor: evento?.profesor || (profesores[0] ? `${profesores[0].nombre} ${profesores[0].apellido}` : 'Carlos Vega'),
    dia: evento?.dia || prefill?.dia || 'Lunes',
    horario: evento?.horario || prefill?.horario || '08:00',
    duracion: evento?.duracion || 60,
    cupos: evento?.cupos || 20,
    inscriptos: evento?.inscriptos || 0,
    tipoEvento: evento?.tipoEvento || 'Semanal',
    fechaEspecifica: evento?.fechaEspecifica || prefill?.fechaEspecifica || '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'duracion' || name === 'cupos' || name === 'inscriptos' ? Number(value) : value,
    }))
  }

  const handleProfesorCreadoRapido = nuevoProfData => {
    const profCreado = addProfesor(nuevoProfData)
    const nombreCompleto = `${profCreado.nombre} ${profCreado.apellido}`
    setForm(prev => ({ ...prev, profesor: nombreCompleto }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <>
      {showSubModalProf && (
        <SubModalRapidoProfesor
          onClose={() => setShowSubModalProf(false)}
          onProfesorCreado={handleProfesorCreadoRapido}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
          {/* Header */}
          <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white font-bold">
                <CalendarDays size={18} />
              </div>
              <div>
                <h3 className="text-white font-black text-lg tracking-wide">
                  {evento ? 'Editar Clase / Actividad' : 'Nueva Clase / Evento'}
                </h3>
                <p className="text-gray-400 text-xs">
                  {form.dia} a las {form.horario} hs · {form.tipoEvento}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#242424] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Tipo de Evento (Recurrencia) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Tipo de Evento / Frecuencia
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, tipoEvento: 'Semanal' }))}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                    form.tipoEvento === 'Semanal'
                      ? 'bg-[#121212] text-white border-[#121212] shadow-md ring-2 ring-[#e41d28]'
                      : 'border-[#e0e0e0] bg-[#f8f9fa] text-gray-600 hover:bg-[#f1f3f5]'
                  }`}
                >
                  <Repeat size={14} className={form.tipoEvento === 'Semanal' ? 'text-[#e41d28]' : ''} />
                  Semanal (Recurrente)
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, tipoEvento: 'Evento Único' }))}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                    form.tipoEvento === 'Evento Único'
                      ? 'bg-[#121212] text-white border-[#121212] shadow-md ring-2 ring-[#e41d28]'
                      : 'border-[#e0e0e0] bg-[#f8f9fa] text-gray-600 hover:bg-[#f1f3f5]'
                  }`}
                >
                  <Star size={14} className={form.tipoEvento === 'Evento Único' ? 'text-amber-400 fill-amber-400' : ''} />
                  Evento Único / Especial
                </button>
              </div>
            </div>

            {/* Nombre de la clase */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Nombre de la Clase / Taller
              </label>
              <input
                name="clase"
                required
                value={form.clase}
                onChange={handleChange}
                placeholder="Ej: Spinning Intenso, CrossFit WOD, Masterclass"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
              />
            </div>

            {/* Salón y Profesor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Espacio / Salón
                </label>
                <select
                  name="salon"
                  value={form.salon}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-medium"
                >
                  {salones.map(s => (
                    <option key={s.id} value={s.nombre}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Profesor a Cargo
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSubModalProf(true)}
                    className="text-[11px] font-black text-[#e41d28] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus size={11} className="stroke-[3]" /> Nuevo Prof.
                  </button>
                </div>
                <select
                  name="profesor"
                  value={form.profesor}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
                >
                  {profesores.map(p => {
                    const nombreComp = `${p.nombre} ${p.apellido}`
                    return (
                      <option key={p.id} value={nombreComp}>
                        {nombreComp} ({p.especialidad})
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            {/* Día, Horario y Duración */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Día</label>
                <select
                  name="dia"
                  value={form.dia}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#e41d28] font-bold text-[#1a1a1a]"
                >
                  {diasSemana.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Horario</label>
                <select
                  name="horario"
                  value={form.horario}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#e41d28] font-black text-[#1a1a1a]"
                >
                  {HORAS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Duración</label>
                <select
                  name="duracion"
                  value={form.duracion}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a]"
                >
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={75}>75 min</option>
                  <option value={90}>90 min</option>
                  <option value={120}>120 min</option>
                </select>
              </div>
            </div>

            {/* Cupos e Inscriptos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Cupo Máximo
                </label>
                <input
                  name="cupos"
                  type="number"
                  min="1"
                  required
                  value={form.cupos}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Inscriptos Actuales
                </label>
                <input
                  name="inscriptos"
                  type="number"
                  min="0"
                  max={form.cupos}
                  value={form.inscriptos}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a] font-bold"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#e0e0e0]">
              {evento && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(evento.id)
                    onClose()
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 border border-[#e41d28]/30 bg-[#fde8e9] text-[#e41d28] rounded-xl text-xs font-black hover:bg-[#fbd3d5] transition-colors cursor-pointer"
                  title="Cancelar y eliminar clase agendada"
                >
                  <Trash2 size={15} />
                  Eliminar Clase
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-3 text-sm font-bold hover:bg-[#f1f3f5] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#e41d28] text-white rounded-xl py-3 text-sm font-black hover:bg-[#c71620] transition-colors shadow-lg shadow-red-600/30 uppercase tracking-wider cursor-pointer"
              >
                {evento ? 'Guardar Cambios' : 'Agendar Clase'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ============================================
// PÁGINA PRINCIPAL: CALENDARIO
// ============================================
export default function Calendario() {
  const { eventos, addEvento, updateEvento, deleteEvento } = useCalendario()
  const [semanaOffset, setSemanaOffset] = useState(0)

  const [modalClaseData, setModalClaseData] = useState(null) // null = cerrado, { ...evento } = editar
  const [prefillCelda, setPrefillCelda] = useState(null) // { dia, horario, fechaEspecifica } = nuevo desde celda
  const [toastMessage, setToastMessage] = useState(null)

  const mostrarToast = msg => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Generate date labels for the week
  const today = new Date(2026, 7, 24) // Lunes 24 agosto 2026
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() + semanaOffset * 7)

  const weekDates = diasSemana.map((dia, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return { dia, date: d, fechaStr: `${yyyy}-${mm}-${dd}` }
  })

  const isToday = date => {
    const now = new Date()
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }

  // Manejador de click en celda vacía
  const handleCeldaClick = (dia, hora, fechaStr) => {
    setPrefillCelda({ dia, horario: hora, fechaEspecifica: fechaStr })
    setModalClaseData(null)
  }

  // Guardar creación / edición
  const handleSaveEvento = datos => {
    if (modalClaseData?.id) {
      updateEvento(modalClaseData.id, datos)
      mostrarToast(`✏️ Clase "${datos.clase}" actualizada correctamente.`)
    } else {
      addEvento(datos)
      mostrarToast(`✅ Clase "${datos.clase}" agendada en el cronograma.`)
    }
  }

  const handleDeleteEvento = id => {
    deleteEvento(id)
    mostrarToast(`🗑️ Clase cancelada del cronograma.`)
  }

  return (
    <div className="p-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white border border-[#242424] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles size={18} className="text-[#e41d28]" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Modal de Clase (Creación / Edición) */}
      {(modalClaseData !== null || prefillCelda !== null) && (
        <ModalClaseEvento
          evento={modalClaseData}
          prefill={prefillCelda}
          onClose={() => {
            setModalClaseData(null)
            setPrefillCelda(null)
          }}
          onSave={handleSaveEvento}
          onDelete={handleDeleteEvento}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fde8e9] text-[#e41d28]">
              <CalendarIcon size={16} />
            </span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Cronograma Semanal Interactivo</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Semana del {weekDates[0].date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} al{' '}
            {weekDates[5].date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Controls and New Event Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrefillCelda({ dia: 'Lunes', horario: '08:00', fechaEspecifica: weekDates[0].fechaStr })}
            className="flex items-center gap-1.5 bg-[#e41d28] text-white px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider active:scale-95 cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            Nueva Clase
          </button>

          {/* Week controls */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#e0e0e0] shadow-sm">
            <button
              onClick={() => setSemanaOffset(o => o - 1)}
              className="p-2 rounded-xl text-gray-600 hover:bg-[#f1f3f5] hover:text-[#1a1a1a] transition-colors cursor-pointer"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setSemanaOffset(0)}
              className="px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl bg-[#121212] text-white hover:bg-[#242424] transition-colors shadow-sm cursor-pointer"
            >
              Hoy
            </button>
            <button
              onClick={() => setSemanaOffset(o => o + 1)}
              className="p-2 rounded-xl text-gray-600 hover:bg-[#f1f3f5] hover:text-[#1a1a1a] transition-colors cursor-pointer"
              title="Semana siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="mb-4 bg-[#f8f9fa] border border-[#e0e0e0] p-3 rounded-2xl flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e41d28] animate-pulse" />
          <span>💡 <strong>Tip interactivo:</strong> Hacé clic en cualquier celda vacía para agendar una clase rápidamente, o clic sobre una tarjeta para editarla.</span>
        </div>
        <span className="text-[11px] font-bold text-[#e41d28] bg-[#fde8e9] px-2.5 py-0.5 rounded-full">
          {eventos.length} Clases Activas
        </span>
      </div>

      {/* Calendar grid container con alineación fija e ininterrumpida */}
      <div className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div
            className="grid bg-[#f8f9fa] border-b border-[#e0e0e0]"
            style={{ gridTemplateColumns: '80px repeat(6, minmax(0, 1fr))' }}
          >
            <div className="p-3 border-r border-[#e0e0e0] flex items-center justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Hora</span>
            </div>
            {weekDates.map(({ dia, date }) => {
              const current = isToday(date)
              return (
                <div key={dia} className="p-3 text-center border-r border-[#e0e0e0] last:border-r-0 min-w-0">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider">{dia}</p>
                  <div
                    className={`w-8 h-8 mx-auto mt-1 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                      current
                        ? 'bg-[#e41d28] text-white shadow-md shadow-red-500/30 scale-105'
                        : 'text-[#1a1a1a]'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time slots grid - Altura fija de fila 96px para alineación perfecta */}
          {HORAS.map(hora => (
            <div
              key={hora}
              className="grid border-b border-[#e0e0e0] last:border-0 h-[96px] max-h-[96px] min-h-[96px]"
              style={{ gridTemplateColumns: '80px repeat(6, minmax(0, 1fr))' }}
            >
              {/* Columna de hora */}
              <div className="p-2 border-r border-[#e0e0e0] flex items-center justify-center bg-[#fafafa] select-none">
                <span className="text-xs font-black text-gray-600 bg-[#f1f3f5] px-2 py-1 rounded-md">
                  {hora}
                </span>
              </div>

              {/* Celdas por día con altura fija y control de overflow */}
              {weekDates.map(({ dia, fechaStr }) => {
                const eventosDeEstaCelda = eventos.filter(e => {
                  const matchDiaHora = e.dia === dia && e.horario === hora
                  if (!matchDiaHora) return false

                  // Si es evento único, verificar fecha específica
                  if (e.tipoEvento === 'Evento Único' && e.fechaEspecifica) {
                    return e.fechaEspecifica === fechaStr
                  }
                  return true
                })

                return (
                  <div
                    key={dia}
                    onClick={() => {
                      if (eventosDeEstaCelda.length === 0) {
                        handleCeldaClick(dia, hora, fechaStr)
                      }
                    }}
                    className={`p-1.5 border-r border-[#e0e0e0] last:border-r-0 h-full max-h-full overflow-hidden transition-colors group relative ${
                      eventosDeEstaCelda.length === 0
                        ? 'hover:bg-[#fde8e9]/25 cursor-pointer'
                        : 'bg-white'
                    }`}
                    title={eventosDeEstaCelda.length === 0 ? `Clic para agendar clase el ${dia} a las ${hora}` : ''}
                  >
                    {/* Botón flotante al pasar mouse sobre celda vacía */}
                    {eventosDeEstaCelda.length === 0 && (
                      <div className="hidden group-hover:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
                        <span className="text-[10px] font-black text-[#e41d28] bg-white px-2 py-1 rounded-lg border border-[#e41d28]/30 shadow-md flex items-center gap-1">
                          <Plus size={10} className="stroke-[3]" /> Agendar
                        </span>
                      </div>
                    )}

                    {/* Tarjetas de Clases Agendadas */}
                    <div className="h-full flex flex-col justify-center">
                      {eventosDeEstaCelda.map(ev => {
                        const isUnico = ev.tipoEvento === 'Evento Único'
                        const salonCorto = ev.salon.replace('Sala de ', '').replace('Salón ', '')
                        const tooltipCompleto = `${ev.clase}\n━━━━━━━━━━━━━━━━━━━━\n👤 Profesor: ${ev.profesor}\n📍 Espacio: ${ev.salon}\n⏰ Horario: ${ev.dia} a las ${ev.horario} hs (${ev.duracion} min)\n👥 Cupos: ${ev.inscriptos}/${ev.cupos} inscriptos\n🔄 Tipo: ${isUnico ? '⭐ Evento Único Especial' : '🔁 Semanal Recurrente'}`

                        return (
                          <div
                            key={ev.id}
                            title={tooltipCompleto}
                            onClick={e => {
                              e.stopPropagation()
                              setModalClaseData(ev)
                              setPrefillCelda(null)
                            }}
                            className={`h-[82px] max-h-[82px] rounded-xl p-2 text-xs shadow-sm transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer border border-[#e0e0e0]/70 flex flex-col justify-between overflow-hidden select-none ${getClassStyle(
                              ev.clase
                            )}`}
                          >
                            {/* Título de la clase: Máximo 2 renglones con line-clamp-2 limpio */}
                            <div className="flex items-start justify-between gap-1 overflow-hidden min-h-0">
                              <p
                                className="font-black text-[11px] leading-[1.25] text-left break-words overflow-hidden"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {ev.clase}
                              </p>
                              {isUnico && (
                                <span className="text-[8px] font-black px-1 py-0.2 rounded bg-amber-400 text-black uppercase tracking-wider shrink-0">
                                  Único
                                </span>
                              )}
                            </div>

                            {/* Metadatos inferiores (Profesor y Cupos) truncados en 1 línea */}
                            <div className="pt-1 border-t border-current/15 mt-0.5 flex flex-col gap-0.5 shrink-0">
                              <div className="flex items-center justify-between text-[10px] font-medium leading-none opacity-90">
                                <span className="truncate max-w-[70%]">👤 {ev.profesor}</span>
                                <span className="font-black shrink-0">{ev.inscriptos}/{ev.cupos}</span>
                              </div>
                              <div className="flex items-center justify-between text-[9px] opacity-75 leading-none">
                                <span className="truncate max-w-[75%]">📍 {salonCorto}</span>
                                <span className="shrink-0">{ev.duracion}m</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white p-5 rounded-3xl border border-[#e0e0e0] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Referencias y Disciplinas en Cronograma
          </p>
          <span className="text-xs text-gray-400 font-medium">Frecuencia recurrente semanal y eventos especiales</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {Object.keys(CLASS_STYLES).map(nombre => (
            <div
              key={nombre}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border border-[#e0e0e0] ${getClassStyle(
                nombre
              )}`}
            >
              <span>{nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
