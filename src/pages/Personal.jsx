import { useState } from 'react'
import {
  Mail,
  Phone,
  BookOpen,
  Star,
  UserCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
  AlertTriangle,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { usePersonal } from '../context/PersonalContext'
import { useCalendario } from '../context/CalendarioContext'

const ROL_ICONS = {
  'Entrenador Personal': '🏋️',
  'Profesora': '🧘',
  'Nutricionista': '🥗',
  'Instructor': '🥊',
}

const ROLES_DISPONIBLES = [
  'Entrenador Personal',
  'Profesora',
  'Instructor',
  'Nutricionista',
]

// ============================================
// MODAL: CREAR / EDITAR PROFESOR
// ============================================
function ModalProfesor({ profesor, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: profesor?.nombre || '',
    apellido: profesor?.apellido || '',
    rol: profesor?.rol || 'Entrenador Personal',
    especialidad: profesor?.especialidad || '',
    email: profesor?.email || '',
    telefono: profesor?.telefono || '',
    activo: profesor?.activo !== undefined ? profesor.activo : true,
  })

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white font-bold">
              {profesor ? '✏️' : '👤'}
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-wide">
                {profesor ? 'Editar Profesor / Staff' : 'Nuevo Profesor / Entrenador'}
              </h3>
              <p className="text-gray-400 text-xs">Gestión del equipo profesional de Sonnos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#242424] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre</label>
              <input
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Laura"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Apellido</label>
              <input
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej: Mansilla"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Rol / Cargo</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-medium"
              >
                {ROLES_DISPONIBLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Especialidad</label>
              <input
                name="especialidad"
                required
                value={form.especialidad}
                onChange={handleChange}
                placeholder="Ej: Spinning & HIIT"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="011-4500-XXXX"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="profesor@sonnos.com"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Estado Activo / Inactivo */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Estado Operativo</label>
            <div className="flex gap-3">
              {[true, false].map(val => (
                <button
                  type="button"
                  key={String(val)}
                  onClick={() => setForm(prev => ({ ...prev, activo: val }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    form.activo === val
                      ? val
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-black ring-1 ring-emerald-300'
                        : 'bg-gray-200 border-gray-300 text-gray-700 font-black'
                      : 'border-[#e0e0e0] bg-[#f8f9fa] text-gray-500 hover:bg-[#f1f3f5]'
                  }`}
                >
                  {val ? '🟢 Activo en Servicio' : '⚪ En Licencia / Inactivo'}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              {profesor ? 'Guardar Cambios' : 'Registrar Profesor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// MODAL: CONFIRMACIÓN DE ELIMINACIÓN
// ============================================
function ModalEliminarProfesor({ profesor, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#fde8e9] text-[#e41d28] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-black text-[#1a1a1a]">¿Eliminar Profesor?</h3>
        <p className="text-xs text-gray-500 mt-2">
          Estás por eliminar del registro a <strong className="text-[#1a1a1a]">"{profesor.nombre} {profesor.apellido}"</strong>.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-3 text-xs font-bold hover:bg-[#f1f3f5] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(profesor.id)
              onClose()
            }}
            className="flex-1 bg-[#e41d28] text-white rounded-xl py-3 text-xs font-black hover:bg-[#c71620] transition-colors shadow-lg shadow-red-600/30 uppercase tracking-wider"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL: PERSONAL
// ============================================
export default function Personal() {
  const { profesores, addProfesor, updateProfesor, deleteProfesor } = usePersonal()
  const { getClasesPorProfesor } = useCalendario()

  const [modalProfData, setModalProfData] = useState(null) // null = cerrado, {} = nuevo, {id...} = editar
  const [profAEliminar, setProfAEliminar] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const mostrarToast = msg => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSaveProfesor = datos => {
    if (modalProfData?.id) {
      updateProfesor(modalProfData.id, datos)
      mostrarToast(`✏️ Profesor "${datos.nombre} ${datos.apellido}" actualizado.`)
    } else {
      addProfesor(datos)
      mostrarToast(`✅ Profesor "${datos.nombre} ${datos.apellido}" registrado con éxito.`)
    }
  }

  const handleDeleteProfesor = id => {
    deleteProfesor(id)
    mostrarToast(`🗑️ Profesor eliminado del registro.`)
  }

  const activos = profesores.filter(p => p.activo)
  const inactivos = profesores.filter(p => !p.activo)

  return (
    <div className="p-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white border border-[#242424] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles size={18} className="text-[#e41d28]" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Modales */}
      {modalProfData !== null && (
        <ModalProfesor
          profesor={modalProfData?.id ? modalProfData : null}
          onClose={() => setModalProfData(null)}
          onSave={handleSaveProfesor}
        />
      )}

      {profAEliminar !== null && (
        <ModalEliminarProfesor
          profesor={profAEliminar}
          onClose={() => setProfAEliminar(null)}
          onConfirm={handleDeleteProfesor}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Staff & Entrenadores</h2>
          <p className="text-gray-500 text-sm mt-1">
            Equipo profesional de Sonnos · {activos.length} activos en servicio · {profesores.length} en plantilla
          </p>
        </div>

        <button
          onClick={() => setModalProfData({})}
          className="flex items-center justify-center gap-2 bg-[#e41d28] text-white px-5 py-3 rounded-2xl text-sm font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider active:scale-95 cursor-pointer"
        >
          <Plus size={18} className="stroke-[3]" />
          Nuevo Profesor
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Entrenadores de Musculación', count: profesores.filter(p => p.rol === 'Entrenador Personal').length, icon: '🏋️' },
          { label: 'Profesoras de Clases Grupales', count: profesores.filter(p => p.rol === 'Profesora' || p.rol === 'Instructor').length, icon: '🧘' },
          { label: 'Especialistas en Nutrición', count: profesores.filter(p => p.rol === 'Nutricionista').length, icon: '🥗' },
        ].map(({ label, count, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#e0e0e0] p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-[#1a1a1a] tracking-tight">{count}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">{label}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#fde8e9] text-[#e41d28] flex items-center justify-center text-2xl shadow-sm">
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Active Staff Section */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        <h3 className="font-black text-[#1a1a1a] text-base uppercase tracking-wider">
          Personal Activo ({activos.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {activos.map(p => {
          const nombreCompleto = `${p.nombre} ${p.apellido}`
          const clasesAsignadas = getClasesPorProfesor(p.nombre)
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm p-6 hover:shadow-md hover:border-[#e41d28]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#121212] text-[#e41d28] border border-[#242424] flex items-center justify-center text-xl font-black shadow-md shrink-0">
                    {p.nombre[0]}{p.apellido[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-[#1a1a1a] text-base truncate">{nombreCompleto}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        Activo
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md mt-1 bg-[#f1f3f5] text-gray-700 border border-[#e0e0e0]">
                      {ROL_ICONS[p.rol] || '🏋️'} {p.rol}
                    </span>
                  </div>
                </div>

                {/* Especialidad */}
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e0e0e0] mb-4">
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Star size={13} className="text-[#e41d28] fill-[#e41d28]" />
                    <span>{p.especialidad}</span>
                  </p>
                </div>

                {/* Contacto */}
                <div className="space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-[#e41d28] shrink-0" />
                    <span className="truncate font-medium">{p.email || 'Sin correo asignado'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-[#e41d28] shrink-0" />
                    <span className="font-medium">{p.telefono || 'Sin teléfono'}</span>
                  </div>
                </div>

                {/* Clases asignadas en Calendario */}
                <div className="p-3 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0]/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <BookOpen size={12} className="text-[#e41d28]" /> Clases Asignadas
                    </span>
                    <span className="text-[10px] font-black text-[#e41d28] bg-[#fde8e9] px-2 py-0.5 rounded-full">
                      {clasesAsignadas.length} actividades
                    </span>
                  </div>
                  {clasesAsignadas.length > 0 ? (
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {clasesAsignadas.slice(0, 4).map(c => (
                        <div key={c.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-[#e0e0e0]">
                          <span className="font-bold text-[#1a1a1a] truncate max-w-[140px]">{c.clase}</span>
                          <span className="text-gray-500 font-medium">{c.dia.slice(0, 3)} {c.horario}</span>
                        </div>
                      ))}
                      {clasesAsignadas.length > 4 && (
                        <p className="text-[10px] text-gray-400 text-center pt-0.5">+{clasesAsignadas.length - 4} más en cronograma</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic py-1">Sin clases asignadas en el cronograma.</p>
                  )}
                </div>
              </div>

              {/* Botones de acción Editar y Eliminar */}
              <div className="pt-4 mt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400">ID #{p.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalProfData(p)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#e0e0e0] text-gray-700 hover:bg-[#f1f3f5] hover:text-[#1a1a1a] transition-all cursor-pointer"
                  >
                    <Pencil size={13} /> Editar
                  </button>
                  <button
                    onClick={() => setProfAEliminar(p)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#e0e0e0] text-gray-400 hover:bg-[#fde8e9] hover:text-[#e41d28] hover:border-[#e41d28]/30 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Inactive Staff Section */}
      {inactivos.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
            <h3 className="font-black text-gray-500 text-base uppercase tracking-wider">
              Personal En Licencia / Inactivo ({inactivos.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {inactivos.map(p => (
              <div
                key={p.id}
                className="bg-[#f8f9fa] rounded-3xl border border-[#e0e0e0] p-6 opacity-75 hover:opacity-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-200 text-gray-500 flex items-center justify-center text-lg font-black shrink-0">
                      {p.nombre[0]}{p.apellido[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-700">{p.nombre} {p.apellido}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{p.rol} · {p.especialidad}</p>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                        Inactivo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e0e0e0] flex items-center justify-end gap-2">
                  <button
                    onClick={() => setModalProfData(p)}
                    className="p-1.5 text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setProfAEliminar(p)}
                    className="p-1.5 text-gray-400 hover:text-[#e41d28] hover:bg-[#fde8e9] rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
