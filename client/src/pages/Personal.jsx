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
  CalendarPlus,
  FileText
} from 'lucide-react'
import { usePersonal } from '../context/PersonalContext'
import { useCalendario } from '../context/CalendarioContext'
import { useSocios } from '../context/SociosContext'

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
// MODAL: PROGRAMAR CONSULTA ACORDADA
// ============================================
function ModalProgramarConsulta({ profesor, onClose, onSave }) {
  const { socios } = useSocios()
  const [form, setForm] = useState({
    socioNombre: socios[0] ? `${socios[0].nombre} ${socios[0].apellido}` : '',
    socioId: socios[0]?.id || null,
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:00',
    motivo: profesor.rol === 'Nutricionista' ? 'Plan Nutricional' : 'Evaluación Física',
    notas: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(profesor.id, form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0]">
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white">
              <CalendarPlus size={18} />
            </div>
            <div>
              <h3 className="font-black text-lg">Programar Consulta / Evaluación</h3>
              <p className="text-xs text-gray-400">Prof. {profesor.nombre} {profesor.apellido} ({profesor.especialidad})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Socio Destinatario</label>
            <select
              value={form.socioNombre}
              onChange={e => {
                const s = socios.find(soc => `${soc.nombre} ${soc.apellido}` === e.target.value)
                setForm(prev => ({
                  ...prev,
                  socioNombre: e.target.value,
                  socioId: s ? s.id : null
                }))
              }}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1a1a1a]"
            >
              {socios.map(s => (
                <option key={s.id} value={`${s.nombre} ${s.apellido}`}>
                  {s.nombre} {s.apellido} ({s.dni || s.telefono})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Tipo de Evaluación</label>
            <select
              value={form.motivo}
              onChange={e => setForm(prev => ({ ...prev, motivo: e.target.value }))}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1a1a1a]"
            >
              <option value="Evaluación Física">Evaluación Física & Fuerza</option>
              <option value="Plan Nutricional">Plan Nutricional Deportivo</option>
              <option value="Control Antropométrico">Control Antropométrico</option>
              <option value="Rutina Personalizada">Armado de Rutina Personalizada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Fecha</label>
              <input
                type="date"
                required
                value={form.fecha}
                onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2 text-xs font-bold text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Horario</label>
              <input
                type="time"
                required
                value={form.hora}
                onChange={e => setForm(prev => ({ ...prev, hora: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2 text-xs font-bold text-[#1a1a1a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Notas u Objetivos</label>
            <textarea
              rows={2}
              value={form.notas}
              onChange={e => setForm(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Ej: Medición de porcentaje graso, armado de dieta para volumen..."
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl p-3 text-xs text-[#1a1a1a]"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#e0e0e0] text-gray-600 rounded-xl text-xs font-bold hover:bg-[#f1f3f5]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#e41d28] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md shadow-red-600/30"
            >
              Agendar Turno
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

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
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white font-bold">
              {profesor ? '✏️' : '👤'}
            </div>
            <div>
              <h3 className="font-black text-lg tracking-wide">
                {profesor ? 'Editar Profesor / Staff' : 'Nuevo Profesor / Entrenador'}
              </h3>
              <p className="text-gray-400 text-xs">Gestión del equipo profesional de Sonnos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

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
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
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
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white text-[#1a1a1a] font-bold"
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
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] font-medium"
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
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28]"
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
                placeholder="114500XXXX"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28]"
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
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-3 text-sm font-bold hover:bg-[#f1f3f5]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#e41d28] text-white rounded-xl py-3 text-sm font-black hover:bg-[#c71620] shadow-lg shadow-red-600/30 uppercase tracking-wider"
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
// PÁGINA PRINCIPAL: PERSONAL & CONSULTAS
// ============================================
export default function Personal() {
  const { profesores, addProfesor, updateProfesor, deleteProfesor, programarConsulta } = usePersonal()
  const { getClasesPorProfesor } = useCalendario()

  const [modalProfData, setModalProfData] = useState(null)
  const [profParaConsulta, setProfParaConsulta] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const mostrarToast = msg => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const activos = profesores.filter(p => p.activo)

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
      {modalProfData !== null && (
        <ModalProfesor
          profesor={modalProfData?.id ? modalProfData : null}
          onClose={() => setModalProfData(null)}
          onSave={async (datos) => {
            if (modalProfData?.id) {
              await updateProfesor(modalProfData.id, datos)
              mostrarToast(`✏️ Profesor "${datos.nombre} ${datos.apellido}" actualizado.`)
            } else {
              await addProfesor(datos)
              mostrarToast(`✅ Profesor registrado exitosamente.`)
            }
          }}
        />
      )}

      {profParaConsulta && (
        <ModalProgramarConsulta
          profesor={profParaConsulta}
          onClose={() => setProfParaConsulta(null)}
          onSave={async (profId, cData) => {
            await programarConsulta(profId, cData)
            mostrarToast(`📅 Consulta programada con éxito para ${cData.socioNombre}.`)
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Staff & Entrenadores</h2>
          <p className="text-gray-500 text-sm mt-1">
            Equipo profesional · {activos.length} activos · Consultas y evaluaciones físicas
          </p>
        </div>

        <button
          onClick={() => setModalProfData({})}
          className="flex items-center gap-2 bg-[#e41d28] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-lg shadow-red-600/30 cursor-pointer"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Nuevo Profesor</span>
        </button>
      </div>

      {/* Grid de Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {activos.map(p => {
          const clasesAsignadas = getClasesPorProfesor(p.nombre)
          const consultas = p.consultasAcordadas || []

          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm p-6 hover:shadow-md hover:border-[#e41d28]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Info Principal */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#121212] text-[#e41d28] border border-[#242424] flex items-center justify-center text-xl font-black shadow-md shrink-0">
                    {p.nombre[0]}{p.apellido[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-[#1a1a1a] text-base truncate">{p.nombre} {p.apellido}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Activo
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md mt-1 bg-[#f1f3f5] text-gray-700">
                      {ROL_ICONS[p.rol] || '🏋️'} {p.rol}
                    </span>
                  </div>
                </div>

                {/* Especialidad */}
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e0e0e0]">
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Star size={13} className="text-[#e41d28] fill-[#e41d28]" />
                    <span>{p.especialidad}</span>
                  </p>
                </div>

                {/* Contacto */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#e41d28]" />
                    <span className="truncate">{p.email || 'Sin email'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#e41d28]" />
                    <span>{p.telefono || 'Sin teléfono'}</span>
                  </div>
                </div>

                {/* Consultas Acordadas */}
                <div className="p-3 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0]/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                      <FileText size={12} className="text-[#e41d28]" /> Consultas Acordadas ({consultas.length})
                    </span>
                    <button
                      onClick={() => setProfParaConsulta(p)}
                      className="text-[10px] font-black text-[#e41d28] hover:underline cursor-pointer"
                    >
                      + Agendar Turno
                    </button>
                  </div>

                  {consultas.length > 0 ? (
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {consultas.slice(0, 3).map((c, i) => (
                        <div key={i} className="text-[11px] bg-white p-2 rounded-lg border border-[#e0e0e0] flex items-center justify-between">
                          <span className="font-bold truncate max-w-[120px]">{c.socioNombre}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{c.fecha} {c.hora}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">Sin turnos pendientes.</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="pt-4 mt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400">ID #{p.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalProfData(p)}
                    className="p-1.5 rounded-lg border border-[#e0e0e0] text-gray-600 hover:bg-gray-100 cursor-pointer"
                    title="Editar"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar al profesor ${p.nombre}?`)) deleteProfesor(p.id)
                    }}
                    className="p-1.5 rounded-lg border border-[#e0e0e0] text-gray-400 hover:text-[#e41d28] hover:bg-[#fde8e9] cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
