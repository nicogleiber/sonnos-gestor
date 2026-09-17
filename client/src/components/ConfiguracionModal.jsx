import { useState, useEffect } from 'react'
import {
  Settings,
  X,
  Building2,
  Clock,
  Save,
  Check,
  Plus,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Mail,
  Globe,
  CreditCard,
  AlertTriangle,
  Star
} from 'lucide-react'
import { useGym } from '../context/GymContext'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// ── Sub-modal: Crear / Editar Sede ────────────────────
function ModalSede({ sede, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: sede?.nombre || '',
    direccion: sede?.direccion || '',
    telefono: sede?.telefono || '',
    principal: sede?.principal || false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      alert('Error al guardar la sede: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0]">
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 size={18} className="text-[#e41d28]" />
            <h4 className="text-white font-black text-base">{sede ? 'Editar Sede' : 'Nueva Sede'}</h4>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre de la Sede *</label>
            <input
              required
              value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Sede Norte (Palermo)"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Dirección</label>
            <input
              value={form.direccion}
              onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))}
              placeholder="Av. Corrientes 1234, CABA"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teléfono</label>
            <input
              value={form.telefono}
              onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
              placeholder="011-4500-0000"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white"
            />
          </div>
          <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0] cursor-pointer hover:bg-[#f1f3f5]">
            <input
              type="checkbox"
              checked={form.principal}
              onChange={e => setForm(p => ({ ...p, principal: e.target.checked }))}
              className="w-4 h-4 accent-[#e41d28]"
            />
            <div>
              <p className="text-xs font-bold text-[#1a1a1a]">Marcar como sede principal</p>
              <p className="text-[10px] text-gray-500">La sede principal aparece seleccionada por defecto</p>
            </div>
          </label>

          <div className="flex gap-3 pt-2 border-t border-[#e0e0e0]">
            <button type="button" onClick={onClose} className="flex-1 border border-[#e0e0e0] text-gray-600 rounded-xl py-2.5 text-xs font-bold hover:bg-[#f1f3f5] cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#e41d28] text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md shadow-red-600/30 disabled:opacity-50 cursor-pointer">
              {loading ? 'Guardando...' : sede ? 'Actualizar' : 'Crear Sede'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal de Confirmación Eliminar Sede ────────────────
function ModalConfirmarEliminarSede({ sede, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false)
  const handleConfirm = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-[#e0e0e0]">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-[#fde8e9] rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={26} className="text-[#e41d28]" />
          </div>
          <div>
            <h3 className="font-black text-[#1a1a1a] text-lg">¿Eliminar sede?</h3>
            <p className="text-sm text-gray-500 mt-1">Se eliminará <strong>"{sede?.nombre}"</strong>. Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-[#e0e0e0] text-gray-700 rounded-xl py-2.5 text-sm font-bold hover:bg-[#f1f3f5] cursor-pointer">Cancelar</button>
            <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-[#e41d28] text-white rounded-xl py-2.5 text-sm font-black hover:bg-[#c71620] disabled:opacity-50 cursor-pointer">
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sección de Sedes ───────────────────────────────────
function SeccionSedes() {
  const { sedes, addSede, updateSede, deleteSede } = useGym()
  const [modalSede, setModalSede] = useState(null)  // null | 'nueva' | sedeObj
  const [sedeEliminar, setSedeEliminar] = useState(null)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-[#1a1a1a]">Gestión de Sedes</h4>
          <p className="text-[10px] text-gray-500">
            Con 1 sede: se muestra el nombre estático. Con 2+: aparece el selector en el sidebar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalSede('nueva')}
          className="flex items-center gap-1.5 bg-[#121212] text-white px-3.5 py-2 rounded-xl text-xs font-black hover:bg-[#242424] cursor-pointer"
        >
          <Plus size={13} className="stroke-[3]" />
          Nueva Sede
        </button>
      </div>

      {sedes.length === 0 ? (
        <div className="py-6 text-center bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0]">
          <Building2 size={30} className="text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">No hay sedes registradas. Creá la primera.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sedes.map(sede => (
            <div key={sede._id || sede.id || sede.nombre} className="flex items-center justify-between p-3.5 bg-[#f8f9fa] rounded-2xl border border-[#e0e0e0]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-[#121212] rounded-xl flex items-center justify-center shrink-0">
                  <Building2 size={14} className="text-[#e41d28]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#1a1a1a] truncate">{sede.nombre}</p>
                    {sede.principal && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md flex items-center gap-0.5 shrink-0">
                        <Star size={9} className="fill-amber-500 text-amber-500" /> Principal
                      </span>
                    )}
                  </div>
                  {sede.direccion && <p className="text-[10px] text-gray-500 truncate">{sede.direccion}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalSede(sede)}
                  className="p-2 rounded-xl border border-[#e0e0e0] text-gray-600 hover:bg-white cursor-pointer"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setSedeEliminar(sede)}
                  className="p-2 rounded-xl border border-[#fde8e9] bg-[#fde8e9] text-[#e41d28] hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-modales de sede */}
      {modalSede && modalSede !== 'nueva' && (
        <ModalSede
          sede={modalSede}
          onClose={() => setModalSede(null)}
          onSave={(data) => updateSede(modalSede._id || modalSede.id, data)}
        />
      )}
      {modalSede === 'nueva' && (
        <ModalSede
          onClose={() => setModalSede(null)}
          onSave={(data) => addSede(data)}
        />
      )}
      {sedeEliminar && (
        <ModalConfirmarEliminarSede
          sede={sedeEliminar}
          onConfirm={() => deleteSede(sedeEliminar._id || sedeEliminar.id)}
          onClose={() => setSedeEliminar(null)}
        />
      )}
    </div>
  )
}

// ── MODAL PRINCIPAL ────────────────────────────────────
export default function ConfiguracionModal({ isOpen, onClose, onGuardado }) {
  const { perfil, updatePerfil, loading } = useGym()
  const [form, setForm] = useState({ ...perfil })
  const [tabActiva, setTabActiva] = useState('perfil')
  const [guardadoOk, setGuardadoOk] = useState(false)
  const [saving, setSaving] = useState(false)

  // Sincronizar form cuando cambie el perfil del contexto
  useEffect(() => {
    setForm({ ...perfil })
  }, [perfil, isOpen])

  if (!isOpen) return null

  const toggleDia = (dia) => {
    setForm(prev => {
      const exists = prev.diasApertura?.includes(dia)
      return {
        ...prev,
        diasApertura: exists
          ? prev.diasApertura.filter(d => d !== dia)
          : [...(prev.diasApertura || []), dia]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updatePerfil(form)
      setGuardadoOk(true)
      setTimeout(() => {
        setGuardadoOk(false)
        if (onGuardado) onGuardado(form)
        onClose()
      }, 1000)
    } catch (err) {
      // Aún con error guardamos localmente (fallback)
      setGuardadoOk(true)
      setTimeout(() => {
        setGuardadoOk(false)
        if (onGuardado) onGuardado(form)
        onClose()
      }, 1000)
    } finally {
      setSaving(false)
    }
  }

  const inp = (field, extra = {}) => ({
    value: form[field] || '',
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
    className: 'w-full border border-[#e0e0e0] bg-[#f8f9fa] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28]/30',
    ...extra
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#e0e0e0] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#e41d28] rounded-xl flex items-center justify-center">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="font-black text-lg">Configuración del Gimnasio</h3>
              <p className="text-xs text-gray-400">{form.name || 'Sonnos Gym'} · Perfil y Sedes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#f8f9fa] border-b border-[#e0e0e0] px-6 shrink-0">
          {[
            { key: 'perfil', label: '🏋️ Perfil del Gimnasio' },
            { key: 'horarios', label: '🕐 Horarios y Atención' },
            { key: 'cobros', label: '💳 Datos de Cobro' },
            { key: 'sedes', label: '🏢 Sedes' },
          ].map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTabActiva(t.key)}
              className={`px-4 py-3 text-xs font-black uppercase tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                tabActiva === t.key
                  ? 'border-[#e41d28] text-[#e41d28]'
                  : 'border-transparent text-gray-500 hover:text-[#1a1a1a]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">

            {/* ─── TAB: PERFIL ─────────────────────── */}
            {tabActiva === 'perfil' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre del Gimnasio</label>
                  <input {...inp('name')} placeholder="Ej: Sonnos Gym" className={inp('name').className + ' font-bold'} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <Phone size={11} /> Teléfono
                    </label>
                    <input {...inp('telefono')} placeholder="011-4500-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <Mail size={11} /> Email de Contacto
                    </label>
                    <input {...inp('email')} type="email" placeholder="info@sonnos.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin size={11} /> Dirección Principal
                  </label>
                  <input {...inp('direccion')} placeholder="Av. Corrientes 1234, CABA" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <Globe size={11} /> Sitio Web
                  </label>
                  <input {...inp('sitioWeb')} placeholder="https://sonnos.com.ar" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Capacidad Máxima del Gimnasio</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacidadMaxima || 150}
                    onChange={e => setForm(p => ({ ...p, capacidadMaxima: Number(e.target.value) }))}
                    className={inp('capacidadMaxima').className}
                  />
                </div>
              </>
            )}

            {/* ─── TAB: HORARIOS ──────────────────── */}
            {tabActiva === 'horarios' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Días de Apertura</label>
                  <div className="flex flex-wrap gap-2">
                    {DIAS.map(dia => {
                      const activo = form.diasApertura?.includes(dia)
                      return (
                        <button
                          key={dia}
                          type="button"
                          onClick={() => toggleDia(dia)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activo
                              ? 'bg-[#121212] text-white border border-[#121212] shadow-sm'
                              : 'bg-[#f1f3f5] text-gray-500 border border-[#e0e0e0] hover:bg-[#e8e8e8]'
                          }`}
                        >
                          {dia}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock size={11} /> Hora de Apertura
                    </label>
                    <input type="time" value={form.horarioApertura || '06:00'} onChange={e => setForm(p => ({ ...p, horarioApertura: e.target.value }))} className={inp('horarioApertura').className + ' font-bold'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock size={11} /> Hora de Cierre
                    </label>
                    <input type="time" value={form.horarioCierre || '22:00'} onChange={e => setForm(p => ({ ...p, horarioCierre: e.target.value }))} className={inp('horarioCierre').className + ' font-bold'} />
                  </div>
                </div>
              </>
            )}

            {/* ─── TAB: DATOS DE COBRO ────────────── */}
            {tabActiva === 'cobros' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                    <CreditCard size={11} /> CUIT Empresa
                  </label>
                  <input {...inp('cuit')} placeholder="30-71829304-9" className={inp('cuit').className + ' font-mono'} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Alias Mercado Pago</label>
                  <input {...inp('aliasMercadoPago')} placeholder="sonnos.gym.mp" className={inp('aliasMercadoPago').className + ' font-mono'} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">CVU / CBU Transferencia</label>
                  <input {...inp('cvuTransferencia')} placeholder="0000003100045892110293" className={inp('cvuTransferencia').className + ' font-mono text-xs'} />
                </div>
              </>
            )}

            {/* ─── TAB: SEDES ─────────────────────── */}
            {tabActiva === 'sedes' && <SeccionSedes />}
          </div>

          {/* Footer (solo visible en tabs con formulario) */}
          {tabActiva !== 'sedes' && (
            <div className="px-6 pb-6 flex gap-3 border-t border-[#e0e0e0] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-[#e0e0e0] text-gray-600 rounded-xl text-xs font-bold hover:bg-[#f1f3f5] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || loading}
                className="flex-1 py-3 bg-[#e41d28] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {guardadoOk ? (
                  <><Check size={16} /><span>¡Guardado!</span></>
                ) : (
                  <><Save size={16} /><span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span></>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
