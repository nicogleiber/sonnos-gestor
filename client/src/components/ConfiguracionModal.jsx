import { useState, useEffect } from 'react'
import {
  Settings,
  X,
  Building2,
  Clock,
  Calendar,
  Save,
  Check,
  Sparkles
} from 'lucide-react'
import { configuracionApi } from '../api/dashboardApi'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function ConfiguracionModal({ isOpen, onClose, onGuardado }) {
  const [form, setForm] = useState({
    sedeNombre: 'Sonnos Gym - Sede Central',
    diasApertura: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    horarioApertura: '06:00',
    horarioCierre: '22:00',
    capacidadMaximaGimnasio: 150,
    aliasMercadoPago: 'sonnos.gestor.mp',
    cvuTransferencia: '0000003100045892110293',
    cuit: '30-71829304-9'
  })
  const [loading, setLoading] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    if (isOpen) {
      configuracionApi.get().then(data => {
        if (data) setForm(prev => ({ ...prev, ...data }))
      }).catch(err => console.warn('Config local fallback:', err.message))
    }
  }, [isOpen])

  if (!isOpen) return null

  const toggleDia = (dia) => {
    setForm(prev => {
      const exists = prev.diasApertura.includes(dia)
      return {
        ...prev,
        diasApertura: exists
          ? prev.diasApertura.filter(d => d !== dia)
          : [...prev.diasApertura, dia]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await configuracionApi.update(form)
      setGuardadoOk(true)
      setTimeout(() => {
        setGuardadoOk(false)
        if (onGuardado) onGuardado(form)
        onClose()
      }, 1000)
    } catch (err) {
      console.warn('Guardado local:', err.message)
      if (onGuardado) onGuardado(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#e41d28] rounded-xl flex items-center justify-center text-white">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg">Configuración del Gimnasio</h3>
              <p className="text-xs text-gray-400">Horarios, días de atención y datos de sede</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Nombre de la Sede
            </label>
            <input
              value={form.sedeNombre}
              onChange={e => setForm(prev => ({ ...prev, sedeNombre: e.target.value }))}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28]/30"
            />
          </div>

          {/* Días de apertura */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              Días de Apertura
            </label>
            <div className="flex flex-wrap gap-2">
              {DIAS.map(dia => {
                const activo = form.diasApertura.includes(dia)
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDia(dia)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activo
                        ? 'bg-[#121212] text-white border border-[#121212] shadow-sm'
                        : 'bg-[#f1f3f5] text-gray-500 border border-[#e0e0e0]'
                    }`}
                  >
                    {dia}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Hora Apertura
              </label>
              <input
                type="time"
                value={form.horarioApertura}
                onChange={e => setForm(prev => ({ ...prev, horarioApertura: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Hora Cierre
              </label>
              <input
                type="time"
                value={form.horarioCierre}
                onChange={e => setForm(prev => ({ ...prev, horarioCierre: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Datos de Cobro */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e0e0e0]">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Alias Mercado Pago
              </label>
              <input
                value={form.aliasMercadoPago}
                onChange={e => setForm(prev => ({ ...prev, aliasMercadoPago: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                CUIT Empresa
              </label>
              <input
                value={form.cuit}
                onChange={e => setForm(prev => ({ ...prev, cuit: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#e0e0e0] text-gray-600 rounded-xl text-xs font-bold hover:bg-[#f1f3f5]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#e41d28] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md shadow-red-600/30 flex items-center justify-center gap-2"
            >
              {guardadoOk ? (
                <>
                  <Check size={16} />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
