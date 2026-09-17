import { useState } from 'react'
import {
  Building2,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Pencil,
  Trash2,
  Sparkles,
  Dumbbell,
  AlertTriangle
} from 'lucide-react'
import { useCalendario } from '../context/CalendarioContext'
import { usePersonal } from '../context/PersonalContext'
import { salones as salonesMock } from '../data/mockData'

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// ============================================
// MODAL: CREAR / EDITAR CLASE
// ============================================
function ModalClase({ clase, onClose, onSave }) {
  const { profesores } = usePersonal()
  const [form, setForm] = useState({
    clase: clase?.clase || '',
    salon: clase?.salon || salonesMock[0]?.nombre || 'Salón Principal',
    profesor: clase?.profesor || (profesores[0] ? `${profesores[0].nombre} ${profesores[0].apellido}` : ''),
    dia: clase?.dia || 'Lunes',
    horario: clase?.horario || '08:00',
    duracion: clase?.duracion || 60,
    cupos: clase?.cupos || 20,
    tipoEvento: clase?.tipoEvento || 'Semanal Recurrente',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'duracion' || name === 'cupos' ? Number(value) : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      alert('Error al guardar la clase: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#e41d28] rounded-xl flex items-center justify-center">
              <Dumbbell size={17} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">{clase ? 'Editar Clase' : 'Nueva Clase'}</h3>
              <p className="text-gray-400 text-xs">{clase ? `Modificando: ${clase.clase}` : 'Agregar al cronograma'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Nombre de la Clase
            </label>
            <input
              name="clase"
              required
              value={form.clase}
              onChange={handleChange}
              placeholder="Ej: Spinning Intenso, CrossFit WOD..."
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
            />
          </div>

          {/* Salón y Profesor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Salón</label>
              <select
                name="salon"
                value={form.salon}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a] font-medium"
              >
                {salonesMock.map(s => (
                  <option key={s.id} value={s.nombre}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Profesor</label>
              <select
                name="profesor"
                value={form.profesor}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a] font-bold"
              >
                {profesores.map(p => {
                  const nombre = `${p.nombre} ${p.apellido}`
                  return <option key={p._id || p.id} value={nombre}>{nombre}</option>
                })}
                {profesores.length === 0 && (
                  <option value="">Sin profesores disponibles</option>
                )}
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
                {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Horario</label>
              <input
                name="horario"
                type="time"
                value={form.horario}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#e41d28] font-bold text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Duración</label>
              <select
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a]"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={75}>75 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
          </div>

          {/* Cupos */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Cupo Máximo</label>
            <input
              name="cupos"
              type="number"
              min="1"
              required
              value={form.cupos}
              onChange={handleChange}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] text-[#1a1a1a] font-bold"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-3 text-sm font-bold hover:bg-[#f1f3f5] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#e41d28] text-white rounded-xl py-3 text-sm font-black hover:bg-[#c71620] shadow-lg shadow-red-600/30 uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Guardando...' : clase ? 'Guardar Cambios' : 'Crear Clase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// MODAL: CONFIRMAR ELIMINACIÓN
// ============================================
function ModalConfirmarEliminar({ clase, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false)
  const handleConfirm = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-[#e0e0e0]">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-[#fde8e9] rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={26} className="text-[#e41d28]" />
          </div>
          <div>
            <h3 className="font-black text-[#1a1a1a] text-lg">¿Eliminar clase?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Eliminás <strong>"{clase.clase}"</strong> del cronograma. Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-2.5 text-sm font-bold hover:bg-[#f1f3f5] cursor-pointer">
              Cancelar
            </button>
            <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-[#e41d28] text-white rounded-xl py-2.5 text-sm font-black hover:bg-[#c71620] disabled:opacity-50 cursor-pointer">
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CARD: CLASE
// ============================================
function ClaseCard({ clase, onEdit, onDelete }) {
  const pct = clase.cupos > 0 ? Math.round((clase.inscriptos / clase.cupos) * 100) : 0
  const isHigh = pct >= 90
  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm p-5 hover:shadow-md hover:border-[#e41d28]/30 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#e41d28] bg-[#fde8e9] px-2.5 py-0.5 rounded-full">
              {clase.salon}
            </span>
            <h4 className="font-black text-[#1a1a1a] text-base mt-1.5">{clase.clase}</h4>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-[#f1f3f5] border border-[#e0e0e0] px-2.5 py-1 rounded-xl shrink-0">
            <Clock size={12} className="text-[#e41d28]" />
            <span>{clase.horario}</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e41d28]"></span>
          Prof. {clase.profesor}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#f8f9fa] text-gray-700 border border-[#e0e0e0]">
            {clase.dia}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#f8f9fa] text-gray-700 border border-[#e0e0e0]">
            {clase.duracion} min
          </span>
        </div>
      </div>

      {/* Ocupación + Acciones */}
      <div className="pt-3 border-t border-[#e0e0e0]">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-gray-500 font-medium">Ocupación de Cupos</span>
          <span className="font-bold text-[#1a1a1a]">
            {clase.inscriptos} <span className="text-gray-400 font-normal">/ {clase.cupos}</span>
          </span>
        </div>
        <div className="h-2 bg-[#f1f3f5] rounded-full overflow-hidden border border-[#e0e0e0]">
          <div
            className={`h-full rounded-full transition-all ${isHigh ? 'bg-[#e41d28]' : pct >= 70 ? 'bg-[#e41d28]/80' : 'bg-[#1a1a1a]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 mb-3">
          <span>{pct}% ocupado</span>
          {isHigh && <span className="text-[#e41d28] font-bold">¡Cupo casi agotado!</span>}
        </div>

        {/* Botones CRUD */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(clase)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#e0e0e0] text-xs font-bold text-gray-700 hover:bg-[#f1f3f5] cursor-pointer transition-colors"
          >
            <Pencil size={12} />
            Editar
          </button>
          <button
            onClick={() => onDelete(clase)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#fde8e9] bg-[#fde8e9] text-xs font-bold text-[#e41d28] hover:bg-red-100 cursor-pointer transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CARD: SALÓN (con clases del salón)
// ============================================
function SalonCard({ salon, clases }) {
  const clasesDelSalon = clases.filter(c => c.salon === salon.nombre)
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden transition-all">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#121212] rounded-2xl flex items-center justify-center text-[#e41d28] shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="font-black text-[#1a1a1a] text-base">{salon.nombre}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{salon.equipamiento}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-[#f1f3f5] px-3 py-1.5 rounded-xl border border-[#e0e0e0]">
            <Users size={14} className="text-[#e41d28]" />
            <span>Capacidad: <strong>{salon.capacidad} pers.</strong></span>
          </div>
          <span className="text-xs bg-[#fde8e9] text-[#e41d28] font-bold px-3 py-1 rounded-full border border-[#e41d28]/20">
            {clasesDelSalon.length} Clases
          </span>
          <div className="text-gray-400 p-1">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#e0e0e0] bg-[#f8f9fa] px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Actividades Asignadas a este Espacio
          </p>
          {clasesDelSalon.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clasesDelSalon.map(c => (
                <div key={c.id} className="bg-white rounded-xl p-3.5 border border-[#e0e0e0] shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#1a1a1a]">{c.clase}</p>
                    <span className="text-xs font-bold text-[#e41d28] bg-[#fde8e9] px-2 py-0.5 rounded-md">
                      {c.horario}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Prof. {c.profesor} · {c.duracion} min</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.dia}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-2">No hay clases asignadas a este salón actualmente.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL: CLASES & SALONES
// ============================================
export default function Clases() {
  const { eventos: clases, addEvento, updateEvento, deleteEvento, loading } = useCalendario()
  const [tab, setTab] = useState('clases')
  const [modalCrear, setModalCrear] = useState(false)
  const [claseEditar, setClaseEditar] = useState(null)
  const [claseEliminar, setClaseEliminar] = useState(null)
  const [toast, setToast] = useState(null)

  const mostrarToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleCrear = async (formData) => {
    await addEvento(formData)
    mostrarToast(`✅ Clase "${formData.clase}" creada.`)
  }

  const handleEditar = async (formData) => {
    await updateEvento(claseEditar.id, formData)
    mostrarToast(`✏️ Clase "${formData.clase}" actualizada.`)
    setClaseEditar(null)
  }

  const handleEliminar = async () => {
    await deleteEvento(claseEliminar.id)
    mostrarToast(`🗑️ Clase "${claseEliminar.clase}" eliminada.`)
    setClaseEliminar(null)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white border border-[#242424] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles size={18} className="text-[#e41d28]" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      {/* Modales */}
      {modalCrear && (
        <ModalClase onClose={() => setModalCrear(false)} onSave={handleCrear} />
      )}
      {claseEditar && (
        <ModalClase clase={claseEditar} onClose={() => setClaseEditar(null)} onSave={handleEditar} />
      )}
      {claseEliminar && (
        <ModalConfirmarEliminar
          clase={claseEliminar}
          onConfirm={handleEliminar}
          onClose={() => setClaseEliminar(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fde8e9] text-[#e41d28]">
              <Dumbbell size={18} />
            </span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Clases y Salones</h2>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? 'Cargando...' : `${clases.length} clases programadas · ${salonesMock.length} salones equipados`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Toggle */}
          <div className="flex bg-[#f1f3f5] p-1 rounded-2xl border border-[#e0e0e0]">
            <button
              onClick={() => setTab('clases')}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all ${
                tab === 'clases'
                  ? 'bg-[#121212] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1a1a1a]'
              }`}
            >
              📋 Clases ({clases.length})
            </button>
            <button
              onClick={() => setTab('salones')}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all ${
                tab === 'salones'
                  ? 'bg-[#121212] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1a1a1a]'
              }`}
            >
              🏢 Salones ({salonesMock.length})
            </button>
          </div>

          {tab === 'clases' && (
            <button
              onClick={() => setModalCrear(true)}
              className="flex items-center gap-1.5 bg-[#e41d28] text-white px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider cursor-pointer"
            >
              <Plus size={15} className="stroke-[3]" />
              Nueva Clase
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      {tab === 'clases' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-[#e0e0e0] h-64 animate-pulse" />
              ))}
            </div>
          ) : clases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#e0e0e0]">
              <Dumbbell size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold text-lg">No hay clases programadas</p>
              <p className="text-gray-400 text-sm mt-1">Creá la primera clase del cronograma</p>
              <button
                onClick={() => setModalCrear(true)}
                className="mt-4 inline-flex items-center gap-2 bg-[#e41d28] text-white px-6 py-2.5 rounded-2xl text-sm font-black hover:bg-[#c71620] cursor-pointer"
              >
                <Plus size={16} className="stroke-[3]" />
                Nueva Clase
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {clases.map(c => (
                <ClaseCard
                  key={c.id}
                  clase={c}
                  onEdit={setClaseEditar}
                  onDelete={setClaseEliminar}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'salones' && (
        <div className="space-y-4">
          {salonesMock.map(s => (
            <SalonCard key={s.id} salon={s} clases={clases} />
          ))}
        </div>
      )}
    </div>
  )
}
