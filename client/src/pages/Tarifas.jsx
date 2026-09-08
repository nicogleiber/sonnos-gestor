import { useState } from 'react'
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Dumbbell,
  Sparkles,
  Users,
  Calendar,
  DollarSign,
  Layers,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react'
import { useTarifas } from '../context/TarifasContext'

// ============================================
// MODAL: CREAR / EDITAR PLAN DE MUSCULACIÓN
// ============================================
function ModalPlan({ plan, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: plan?.nombre || '',
    meses: plan?.meses || 1,
    precio: plan?.precio || '',
    estado: plan?.estado || 'Activo',
    descripcion: plan?.descripcion || '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'meses' || name === 'precio' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...form,
      precio: Number(form.precio) || 0,
      meses: Number(form.meses) || 1,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white">
              <Dumbbell size={18} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-wide">
                {plan ? 'Editar Plan de Musculación' : 'Nuevo Plan de Musculación'}
              </h3>
              <p className="text-gray-400 text-xs">Configuración de abonos y membresías</p>
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
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Nombre del Plan
            </label>
            <input
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Mensual, Trimestral Pro, Pase Anual Black"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Duración (Meses)
              </label>
              <select
                name="meses"
                value={form.meses}
                onChange={handleChange}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-medium"
              >
                <option value={1}>1 mes (Mensual)</option>
                <option value={3}>3 meses (Trimestral)</option>
                <option value={6}>6 meses (Semestral)</option>
                <option value={12}>12 meses (Anual)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Precio ($ ARS)
              </label>
              <input
                name="precio"
                type="number"
                min="0"
                step="500"
                required
                value={form.precio}
                onChange={handleChange}
                placeholder="15000"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Estado
            </label>
            <div className="flex gap-3">
              {['Activo', 'Inactivo'].map(est => (
                <button
                  type="button"
                  key={est}
                  onClick={() => setForm(prev => ({ ...prev, estado: est }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    form.estado === est
                      ? est === 'Activo'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-black ring-1 ring-emerald-300'
                        : 'bg-gray-200 border-gray-300 text-gray-700 font-black'
                      : 'border-[#e0e0e0] bg-[#f8f9fa] text-gray-500 hover:bg-[#f1f3f5]'
                  }`}
                >
                  {est === 'Activo' ? '🟢 Activo (Disponible)' : '⚪ Inactivo'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Descripción / Beneficios (Opcional)
            </label>
            <textarea
              name="descripcion"
              rows="2"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Ej: Acceso libre a máquinas de musculación, cardio y vestuarios."
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a]"
            />
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
              {plan ? 'Guardar Cambios' : 'Crear Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// MODAL: CREAR / EDITAR DISCIPLINA / CLASE
// ============================================
function ModalDisciplina({ disciplina, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: disciplina?.nombre || '',
    precio: disciplina?.precio || '',
    frecuencia: disciplina?.frecuencia || 'Mensual (Pase Libre)',
    capacidad: disciplina?.capacidad || 20,
    estado: disciplina?.estado || 'Activo',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'capacidad' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      ...form,
      precio: Number(form.precio) || 0,
      capacidad: Number(form.capacidad) || 20,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-wide">
                {disciplina ? 'Editar Disciplina' : 'Nueva Disciplina / Clase'}
              </h3>
              <p className="text-gray-400 text-xs">Aranceles y capacidades por actividad</p>
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
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Nombre de la Clase / Disciplina
            </label>
            <input
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Spinning Pro, CrossFit WOD, Boxeo"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Precio ($ ARS)
              </label>
              <input
                name="precio"
                type="number"
                min="0"
                step="500"
                required
                value={form.precio}
                onChange={handleChange}
                placeholder="18000"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Capacidad Máxima
              </label>
              <input
                name="capacidad"
                type="number"
                min="1"
                required
                value={form.capacidad}
                onChange={handleChange}
                placeholder="20"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Frecuencia / Tipo de Pase
            </label>
            <select
              name="frecuencia"
              value={form.frecuencia}
              onChange={handleChange}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white transition-all text-[#1a1a1a] font-medium"
            >
              <option>Mensual (Pase Libre)</option>
              <option>Mensual (3x semana)</option>
              <option>Mensual (2x semana)</option>
              <option>Por Clase / Suelto</option>
              <option>Pack 10 Clases</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Estado
            </label>
            <div className="flex gap-3">
              {['Activo', 'Inactivo'].map(est => (
                <button
                  type="button"
                  key={est}
                  onClick={() => setForm(prev => ({ ...prev, estado: est }))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    form.estado === est
                      ? est === 'Activo'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-black ring-1 ring-emerald-300'
                        : 'bg-gray-200 border-gray-300 text-gray-700 font-black'
                      : 'border-[#e0e0e0] bg-[#f8f9fa] text-gray-500 hover:bg-[#f1f3f5]'
                  }`}
                >
                  {est === 'Activo' ? '🟢 Activo (Disponible)' : '⚪ Inactivo'}
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
              {disciplina ? 'Guardar Cambios' : 'Crear Disciplina'}
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
function ModalEliminar({ item, tipo, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#fde8e9] text-[#e41d28] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-black text-[#1a1a1a]">¿Eliminar {tipo}?</h3>
        <p className="text-xs text-gray-500 mt-2">
          Estás por eliminar <strong className="text-[#1a1a1a]">"{item.nombre}"</strong>. Esta acción no se puede deshacer.
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
              onConfirm(item.id)
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
// PÁGINA PRINCIPAL: TARIFAS
// ============================================
export default function Tarifas() {
  const {
    planes,
    disciplinas,
    addPlan,
    updatePlan,
    deletePlan,
    addDisciplina,
    updateDisciplina,
    deleteDisciplina,
  } = useTarifas()

  const [tab, setTab] = useState('musculacion') // 'musculacion' | 'disciplinas'
  const [modalPlanData, setModalPlanData] = useState(null) // null = cerrado, {} = nuevo, {id...} = editar
  const [modalDiscData, setModalDiscData] = useState(null)
  const [itemAEliminar, setItemAEliminar] = useState(null) // { item, tipo: 'Plan' | 'Disciplina' }
  const [toastMessage, setToastMessage] = useState(null)

  const mostrarToast = msg => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Handlers Planes
  const handleSavePlan = planData => {
    if (modalPlanData?.id) {
      updatePlan(modalPlanData.id, planData)
      mostrarToast(`✏️ Plan "${planData.nombre}" actualizado correctamente.`)
    } else {
      addPlan(planData)
      mostrarToast(`✅ Nuevo plan "${planData.nombre}" creado exitosamente.`)
    }
  }

  const handleDeletePlan = id => {
    deletePlan(id)
    mostrarToast(`🗑️ Plan eliminado.`)
  }

  // Handlers Disciplinas
  const handleSaveDisciplina = discData => {
    if (modalDiscData?.id) {
      updateDisciplina(modalDiscData.id, discData)
      mostrarToast(`✏️ Disciplina "${discData.nombre}" actualizada.`)
    } else {
      addDisciplina(discData)
      mostrarToast(`✅ Nueva disciplina "${discData.nombre}" creada.`)
    }
  }

  const handleDeleteDisciplina = id => {
    deleteDisciplina(id)
    mostrarToast(`🗑️ Disciplina eliminada.`)
  }

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
      {modalPlanData !== null && (
        <ModalPlan
          plan={modalPlanData?.id ? modalPlanData : null}
          onClose={() => setModalPlanData(null)}
          onSave={handleSavePlan}
        />
      )}

      {modalDiscData !== null && (
        <ModalDisciplina
          disciplina={modalDiscData?.id ? modalDiscData : null}
          onClose={() => setModalDiscData(null)}
          onSave={handleSaveDisciplina}
        />
      )}

      {itemAEliminar !== null && (
        <ModalEliminar
          item={itemAEliminar.item}
          tipo={itemAEliminar.tipo}
          onClose={() => setItemAEliminar(null)}
          onConfirm={itemAEliminar.tipo === 'Plan' ? handleDeletePlan : handleDeleteDisciplina}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-[#fde8e9] text-[#e41d28]">
              <Tag size={18} />
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">
              Gestión de Tarifas y Precios
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Administración centralizada de aranceles de musculación y actividades grupales de Sonnos.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (tab === 'musculacion') setModalPlanData({})
            else setModalDiscData({})
          }}
          className="flex items-center justify-center gap-2 bg-[#e41d28] text-white px-5 py-3 rounded-2xl text-sm font-black hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 uppercase tracking-wider active:scale-95 cursor-pointer"
        >
          <Plus size={18} className="stroke-[3]" />
          {tab === 'musculacion' ? 'Nuevo Plan de Musculación' : 'Nueva Disciplina'}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#f1f3f5] p-1.5 rounded-2xl border border-[#e0e0e0] w-fit mb-8 shadow-sm">
        <button
          onClick={() => setTab('musculacion')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'musculacion'
              ? 'bg-[#121212] text-white shadow-md'
              : 'text-gray-600 hover:text-[#1a1a1a]'
          }`}
        >
          <Dumbbell size={15} />
          Pase Libre Musculación ({planes.length})
        </button>
        <button
          onClick={() => setTab('disciplinas')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'disciplinas'
              ? 'bg-[#121212] text-white shadow-md'
              : 'text-gray-600 hover:text-[#1a1a1a]'
          }`}
        >
          <Layers size={15} />
          Clases y Disciplinas ({disciplinas.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PASE LIBRE MUSCULACIÓN */}
      {/* ========================================================= */}
      {tab === 'musculacion' && (
        <div className="space-y-6">
          {/* Grid de Tarjetas de Planes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {planes.map(plan => {
              const isActivo = plan.estado === 'Activo'
              const precioMensualEquiv = Math.round(plan.precio / plan.meses)
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                    isActivo ? 'border-[#e0e0e0]' : 'border-gray-200 opacity-60 bg-gray-50'
                  }`}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f1f3f5] text-gray-700 border border-[#e0e0e0]">
                          {plan.meses} {plan.meses === 1 ? 'Mes' : 'Meses'}
                        </span>
                        <h4 className="text-xl font-black text-[#1a1a1a] mt-2 tracking-tight">
                          Plan {plan.nombre}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                          isActivo
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        {plan.estado}
                      </span>
                    </div>

                    {/* Precio */}
                    <div className="my-4 pb-4 border-b border-[#e0e0e0]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#e41d28] tracking-tight">
                          ${plan.precio.toLocaleString('es-AR')}
                        </span>
                        <span className="text-xs text-gray-400 font-bold">/ total</span>
                      </div>
                      {plan.meses > 1 && (
                        <p className="text-[11px] text-gray-500 mt-1 font-semibold">
                          Equivale a <strong className="text-[#1a1a1a]">${precioMensualEquiv.toLocaleString('es-AR')}</strong> / mes
                        </p>
                      )}
                    </div>

                    {/* Descripción */}
                    {plan.descripcion && (
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {plan.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Acciones CRUD */}
                  <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400">ID #{plan.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setModalPlanData(plan)}
                        className="p-2 rounded-xl text-gray-600 hover:bg-[#f1f3f5] hover:text-[#1a1a1a] transition-all cursor-pointer"
                        title="Editar plan"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setItemAEliminar({ item: plan, tipo: 'Plan' })}
                        className="p-2 rounded-xl text-gray-400 hover:bg-[#fde8e9] hover:text-[#e41d28] transition-all cursor-pointer"
                        title="Eliminar plan"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabla Resumen de Planes */}
          <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-[#e0e0e0] bg-[#f8f9fa] flex items-center justify-between">
              <h3 className="font-black text-sm text-[#1a1a1a] uppercase tracking-wider">
                Resumen de Aranceles — Musculación
              </h3>
              <span className="text-xs text-gray-500">
                Sincronizado con el formulario de Socios
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0e0] bg-white text-xs font-black text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-6 py-3.5">Plan</th>
                    <th className="text-left px-6 py-3.5">Duración</th>
                    <th className="text-left px-6 py-3.5">Precio Total</th>
                    <th className="text-left px-6 py-3.5">Costo Mensual</th>
                    <th className="text-left px-6 py-3.5">Estado</th>
                    <th className="text-right px-6 py-3.5">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0] text-sm">
                  {planes.map(p => (
                    <tr key={p.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-6 py-4 font-bold text-[#1a1a1a]">{p.nombre}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{p.meses} {p.meses === 1 ? 'mes' : 'meses'}</td>
                      <td className="px-6 py-4 font-black text-[#e41d28]">${p.precio.toLocaleString('es-AR')}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        ${Math.round(p.precio / p.meses).toLocaleString('es-AR')}/mes
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          p.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setModalPlanData(p)}
                            className="p-1.5 text-gray-500 hover:text-[#1a1a1a] hover:bg-[#f1f3f5] rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setItemAEliminar({ item: p, tipo: 'Plan' })}
                            className="p-1.5 text-gray-400 hover:text-[#e41d28] hover:bg-[#fde8e9] rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLASES Y DISCIPLINAS */}
      {/* ========================================================= */}
      {tab === 'disciplinas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {disciplinas.map(disc => {
              const isActivo = disc.estado === 'Activo'
              return (
                <div
                  key={disc.id}
                  className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                    isActivo ? 'border-[#e0e0e0]' : 'border-gray-200 opacity-60 bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fde8e9] text-[#e41d28] border border-[#e41d28]/20">
                          {disc.frecuencia}
                        </span>
                        <h4 className="text-lg font-black text-[#1a1a1a] mt-2 tracking-tight">
                          {disc.nombre}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                          isActivo
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        {disc.estado}
                      </span>
                    </div>

                    <div className="my-4 pb-4 border-b border-[#e0e0e0]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#1a1a1a] tracking-tight">
                          ${disc.precio.toLocaleString('es-AR')}
                        </span>
                        <span className="text-xs text-gray-400 font-bold">/ arancel</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-[#f8f9fa] p-3 rounded-xl border border-[#e0e0e0] mb-4">
                      <Users size={15} className="text-[#e41d28]" />
                      <span>Capacidad máxima de sala: <strong>{disc.capacidad} alumnos</strong></span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400">ID #{disc.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setModalDiscData(disc)}
                        className="p-2 rounded-xl text-gray-600 hover:bg-[#f1f3f5] hover:text-[#1a1a1a] transition-all cursor-pointer"
                        title="Editar disciplina"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setItemAEliminar({ item: disc, tipo: 'Disciplina' })}
                        className="p-2 rounded-xl text-gray-400 hover:bg-[#fde8e9] hover:text-[#e41d28] transition-all cursor-pointer"
                        title="Eliminar disciplina"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabla de Disciplinas */}
          <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-[#e0e0e0] bg-[#f8f9fa] flex items-center justify-between">
              <h3 className="font-black text-sm text-[#1a1a1a] uppercase tracking-wider">
                Padrón de Disciplinas y Actividades
              </h3>
              <span className="text-xs text-gray-500">
                {disciplinas.length} actividades registradas
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0e0] bg-white text-xs font-black text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-6 py-3.5">Disciplina</th>
                    <th className="text-left px-6 py-3.5">Modalidad / Pase</th>
                    <th className="text-left px-6 py-3.5">Precio ($ ARS)</th>
                    <th className="text-left px-6 py-3.5">Capacidad</th>
                    <th className="text-left px-6 py-3.5">Estado</th>
                    <th className="text-right px-6 py-3.5">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e0e0] text-sm">
                  {disciplinas.map(d => (
                    <tr key={d.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-6 py-4 font-bold text-[#1a1a1a]">{d.nombre}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{d.frecuencia}</td>
                      <td className="px-6 py-4 font-black text-[#1a1a1a]">${d.precio.toLocaleString('es-AR')}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{d.capacidad} personas</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          d.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
                          {d.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setModalDiscData(d)}
                            className="p-1.5 text-gray-500 hover:text-[#1a1a1a] hover:bg-[#f1f3f5] rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setItemAEliminar({ item: d, tipo: 'Disciplina' })}
                            className="p-1.5 text-gray-400 hover:text-[#e41d28] hover:bg-[#fde8e9] rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
