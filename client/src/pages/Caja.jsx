import { useState, useEffect } from 'react'
import {
  Wallet,
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  Lock,
  Printer,
  X,
  AlertTriangle,
  CheckCircle2,
  ArrowUpCircle,
  Info,
  Sparkles
} from 'lucide-react'
import { useCaja } from '../context/CajaContext'

// ============================================
// MODAL: APERTURA DE CAJA
// ============================================
function ModalAperturaCaja({ onConfirm, onClose }) {
  const [montoInicial, setMontoInicial] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirm({ montoInicial: Number(montoInicial) || 0 })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e0e0e0]">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <ArrowUpCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg">Apertura de Caja</h3>
              <p className="text-xs text-gray-400">Ingresá el efectivo inicial en el cajón</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3">
            <Info size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              El monto inicial es el efectivo físico con el que arranca la caja hoy. Este valor se usará como base para la auditoría al cierre.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Efectivo inicial en caja ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black text-lg">$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={montoInicial}
                onChange={e => setMontoInicial(e.target.value)}
                placeholder="0"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-2xl pl-10 pr-4 py-3.5 text-xl font-black text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
              Si no hay fondo inicial, dejá en 0
            </p>
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#e0e0e0]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e0e0e0] text-gray-600 rounded-2xl py-3 text-sm font-bold hover:bg-[#f1f3f5] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white rounded-2xl py-3 text-sm font-black uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Abriendo...' : '✓ Abrir Caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// MODAL: CIERRE DE CAJA CON AUDITORÍA
// ============================================
function ModalCierreCaja({ movimientos, estadoCaja, onConfirm, onClose }) {
  const [efectivoReal, setEfectivoReal] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  // Calcular totales del día por método de pago
  const totalEfectivo = movimientos.filter(m => m.metodoPago === 'Efectivo').reduce((a, m) => a + m.monto, 0)
  const totalMercadoPago = movimientos.filter(m => m.metodoPago === 'Mercado Pago').reduce((a, m) => a + m.monto, 0)
  const totalTransferencia = movimientos.filter(m => m.metodoPago === 'Transferencia').reduce((a, m) => a + m.monto, 0)
  const totalMembresias = movimientos.filter(m => m.tipo === 'Membresía').reduce((a, m) => a + m.monto, 0)
  const totalTienda = movimientos.filter(m => m.tipo === 'Venta Tienda').reduce((a, m) => a + m.monto, 0)
  const totalDia = movimientos.reduce((a, m) => a + m.monto, 0)

  // Saldo teórico = monto inicial + efectivo cobrado en el día
  const montoInicial = estadoCaja?.montoInicial || 0
  const saldoTeorico = montoInicial + totalEfectivo

  const diferencia = efectivoReal !== '' ? Number(efectivoReal) - saldoTeorico : null
  const hayDiferencia = diferencia !== null && diferencia !== 0

  const handleAuditar = () => {
    if (efectivoReal === '') return
    setResultado({
      saldoTeorico,
      efectivoReal: Number(efectivoReal),
      diferencia,
      totalDia,
      totalEfectivo,
      totalMercadoPago,
      totalTransferencia,
      totalMembresias,
      totalTienda,
      cantidadOperaciones: movimientos.length
    })
  }

  const handleConfirmarCierre = async () => {
    if (!resultado) return
    setLoading(true)
    try {
      await onConfirm({
        efectivoReal: resultado.efectivoReal,
        justificacion,
        resumen: resultado
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#e0e0e0] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30">
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg">Cierre y Auditoría de Caja</h3>
              <p className="text-xs text-gray-400">{movimientos.length} operaciones registradas hoy</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Resumen del día */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121212] to-[#242424] text-white border border-[#333]">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Resumen del Día</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-400">${totalDia.toLocaleString('es-AR')}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">Total General</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-xl font-black text-[#e41d28]">${totalMembresias.toLocaleString('es-AR')}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">Membresías</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-sky-400">${totalTienda.toLocaleString('es-AR')}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">Tienda</p>
              </div>
            </div>
          </div>

          {/* Desglose por método de pago */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Desglose por Método de Pago
            </h4>
            <div className="space-y-2">
              {[
                { label: 'Efectivo (en cajón físico)', icon: '💵', value: totalEfectivo, color: 'emerald' },
                { label: 'Mercado Pago / QR', icon: '📱', value: totalMercadoPago, color: 'sky' },
                { label: 'Transferencia Bancaria', icon: '🏦', value: totalTransferencia, color: 'purple' },
              ].map(({ label, icon, value, color }) => (
                <div key={label} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{icon}</span>
                    <p className="text-xs font-bold text-[#1a1a1a]">{label}</p>
                  </div>
                  <span className="font-black text-sm text-[#1a1a1a]">${value.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saldo teórico */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Saldo Teórico en Caja Física</p>
                <p className="text-[10px] text-blue-600 mt-0.5">
                  Monto inicial (${montoInicial.toLocaleString('es-AR')}) + Efectivo cobrado (${totalEfectivo.toLocaleString('es-AR')})
                </p>
              </div>
              <p className="text-2xl font-black text-blue-800">${saldoTeorico.toLocaleString('es-AR')}</p>
            </div>
          </div>

          {/* Input: Efectivo real contado */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              ¿Cuánto efectivo contás físicamente en caja ahora?
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black text-lg">$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={efectivoReal}
                  onChange={e => {
                    setEfectivoReal(e.target.value)
                    setResultado(null)
                  }}
                  placeholder="0"
                  className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-2xl pl-10 pr-4 py-3 text-xl font-black text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28] focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAuditar}
                disabled={efectivoReal === ''}
                className="px-5 py-3 bg-[#121212] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#242424] disabled:opacity-40 cursor-pointer"
              >
                Auditar
              </button>
            </div>
          </div>

          {/* Resultado de Auditoría */}
          {resultado && (
            <div className={`p-5 rounded-3xl border-2 ${
              resultado.diferencia === 0
                ? 'bg-emerald-50 border-emerald-300'
                : resultado.diferencia > 0
                ? 'bg-sky-50 border-sky-300'
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {resultado.diferencia === 0
                  ? <CheckCircle2 size={18} className="text-emerald-600" />
                  : <AlertTriangle size={18} className={resultado.diferencia > 0 ? 'text-sky-600' : 'text-red-600'} />
                }
                <p className={`font-black text-sm uppercase tracking-wide ${
                  resultado.diferencia === 0 ? 'text-emerald-700' : resultado.diferencia > 0 ? 'text-sky-700' : 'text-red-700'
                }`}>
                  {resultado.diferencia === 0
                    ? '✓ Caja cuadrada perfectamente'
                    : resultado.diferencia > 0
                    ? `Sobrante detectado: +$${Math.abs(resultado.diferencia).toLocaleString('es-AR')}`
                    : `Faltante detectado: -$${Math.abs(resultado.diferencia).toLocaleString('es-AR')}`
                  }
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Teórico</p>
                  <p className="font-black text-[#1a1a1a]">${resultado.saldoTeorico.toLocaleString('es-AR')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Real</p>
                  <p className="font-black text-[#1a1a1a]">${resultado.efectivoReal.toLocaleString('es-AR')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Diferencia</p>
                  <p className={`font-black ${resultado.diferencia === 0 ? 'text-emerald-600' : resultado.diferencia > 0 ? 'text-sky-600' : 'text-red-600'}`}>
                    {resultado.diferencia > 0 ? '+' : ''}{resultado.diferencia.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>

              {/* Justificación si hay diferencia */}
              {hayDiferencia && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Justificación de diferencia (obligatorio)
                  </label>
                  <textarea
                    value={justificacion}
                    onChange={e => setJustificacion(e.target.value)}
                    required={hayDiferencia}
                    rows={2}
                    placeholder="Ej: Se realizó un gasto autorizado en efectivo por reparación de equipo..."
                    className="w-full border border-[#e0e0e0] bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28] resize-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e0e0e0] bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimir</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e0e0e0] bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarCierre}
              disabled={!resultado || (hayDiferencia && !justificacion.trim()) || loading}
              className="px-6 py-2.5 rounded-xl bg-[#e41d28] text-white text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md shadow-red-600/30 disabled:opacity-40 cursor-pointer"
            >
              {loading ? 'Cerrando...' : 'Confirmar Cierre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MODAL: REPORTE POST-CIERRE
// ============================================
function ModalReporteCierre({ data, onClose }) {
  if (!data) return null
  const { resumen, fechaStr } = data

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-[#e0e0e0] flex flex-col">
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg">Caja Cerrada Exitosamente</h3>
              <p className="text-xs text-gray-400">Fecha: {fechaStr}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Total recaudado */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] to-[#242424] text-white text-center border border-[#333]">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Recaudación Total del Día</p>
            <p className="text-4xl font-black tracking-tight text-emerald-400 mt-1">
              ${(resumen?.totalDia || 0).toLocaleString('es-AR')}
            </p>
            <p className="text-xs text-gray-400 mt-2">{resumen?.cantidadOperaciones || 0} operaciones procesadas</p>
          </div>

          {/* Desglose origen */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Desglose por Origen</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0]">
                <p className="text-xs font-bold text-gray-500">Membresías</p>
                <p className="text-xl font-black text-[#1a1a1a] mt-1">${(resumen?.totalMembresias || 0).toLocaleString('es-AR')}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0]">
                <p className="text-xs font-bold text-gray-500">Ventas Tienda</p>
                <p className="text-xl font-black text-[#1a1a1a] mt-1">${(resumen?.totalTienda || 0).toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>

          {/* Desglose métodos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Desglose por Método (Arqueo)</h4>
            <div className="space-y-2">
              {[
                { label: 'Efectivo', icon: '💵', value: resumen?.totalEfectivo || 0 },
                { label: 'Mercado Pago', icon: '📱', value: resumen?.totalMercadoPago || 0 },
                { label: 'Transferencia', icon: '🏦', value: resumen?.totalTransferencia || 0 },
              ].map(({ label, icon, value }) => (
                <div key={label} className="p-3.5 rounded-2xl bg-white border border-[#e0e0e0] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{icon}</span>
                    <p className="text-xs font-bold text-[#1a1a1a]">{label}</p>
                  </div>
                  <span className="font-black text-sm text-[#1a1a1a]">${value.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auditoría efectivo */}
          {resumen && (
            <div className={`p-4 rounded-2xl border ${
              resumen.diferencia === 0 ? 'bg-emerald-50 border-emerald-300' :
              resumen.diferencia > 0 ? 'bg-sky-50 border-sky-300' : 'bg-red-50 border-red-300'
            }`}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2 text-gray-600">Auditoría de Efectivo</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-gray-500">Teórico</p>
                  <p className="font-black text-[#1a1a1a] text-sm">${resumen.saldoTeorico.toLocaleString('es-AR')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Real</p>
                  <p className="font-black text-[#1a1a1a] text-sm">${resumen.efectivoReal.toLocaleString('es-AR')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Diferencia</p>
                  <p className={`font-black text-sm ${
                    resumen.diferencia === 0 ? 'text-emerald-600' :
                    resumen.diferencia > 0 ? 'text-sky-600' : 'text-red-600'
                  }`}>
                    {resumen.diferencia > 0 ? '+' : ''}{resumen.diferencia.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e0e0e0] bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimir Cierre</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#e41d28] text-white text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-md shadow-red-600/30 cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL: CAJA & INGRESOS
// ============================================
export default function Caja() {
  const {
    movimientos,
    fetchMovimientos,
    estadoCaja,
    fetchEstadoCaja,
    abrirCaja,
    cerrarCaja
  } = useCaja()

  const [fechaFiltro, setFechaFiltro] = useState(() => new Date().toISOString().split('T')[0])
  const [tipoFiltro, setTipoFiltro] = useState('Todos')
  const [showModalApertura, setShowModalApertura] = useState(false)
  const [showModalCierre, setShowModalCierre] = useState(false)
  const [reporteCierre, setReporteCierre] = useState(null)
  const [toast, setToast] = useState(null)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetchMovimientos(fechaFiltro)
    fetchEstadoCaja(fechaFiltro)
  }, [fechaFiltro, fetchMovimientos, fetchEstadoCaja])

  const movimientosFiltrados = movimientos.filter(m => {
    if (tipoFiltro === 'Todos') return true
    return m.tipo === tipoFiltro
  })

  const totalDia = movimientos.reduce((acc, m) => acc + m.monto, 0)
  const totalMembresias = movimientos.filter(m => m.tipo === 'Membresía').reduce((acc, m) => acc + m.monto, 0)
  const totalTienda = movimientos.filter(m => m.tipo === 'Venta Tienda').reduce((acc, m) => acc + m.monto, 0)

  // La caja está abierta si: estadoCaja es null (aún no consultado/fallback) o si abierta === true
  const cajaEstaAbierta = !estadoCaja || estadoCaja.abierta === true

  const handleAbrirCaja = async ({ montoInicial }) => {
    await abrirCaja({ montoInicial, fecha: fechaFiltro })
    mostrarToast(`✓ Caja abierta con $${montoInicial.toLocaleString('es-AR')} de fondo inicial.`)
  }

  const handleCerrarCaja = async ({ efectivoReal, justificacion, resumen }) => {
    const result = await cerrarCaja({ efectivoReal, justificacion, fecha: fechaFiltro })
    const reporteData = result || resumen
    setReporteCierre({ resumen: { ...resumen, ...reporteData }, fechaStr: fechaFiltro })
    mostrarToast('🔒 Caja cerrada y auditada correctamente.')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white border border-[#242424] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles size={18} className="text-[#e41d28]" />
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      {/* Modales */}
      {showModalApertura && (
        <ModalAperturaCaja
          onConfirm={handleAbrirCaja}
          onClose={() => setShowModalApertura(false)}
        />
      )}

      {showModalCierre && (
        <ModalCierreCaja
          movimientos={movimientos}
          estadoCaja={estadoCaja}
          onConfirm={handleCerrarCaja}
          onClose={() => setShowModalCierre(false)}
        />
      )}

      {reporteCierre && (
        <ModalReporteCierre
          data={reporteCierre}
          onClose={() => setReporteCierre(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fde8e9] text-[#e41d28]">
              <Wallet size={18} />
            </span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Caja & Movimientos de Ingresos</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Control en tiempo real de cobros de membresías y ventas de mostrador.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="date"
            value={fechaFiltro}
            onChange={e => setFechaFiltro(e.target.value)}
            className="bg-white border border-[#e0e0e0] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#1a1a1a] shadow-sm"
          />

          {/* Botón estado de caja */}
          {cajaEstaAbierta ? (
            <button
              onClick={() => setShowModalCierre(true)}
              className="flex items-center gap-2 bg-[#121212] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#242424] shadow-lg shadow-black/20 transition-all cursor-pointer"
            >
              <Lock size={14} className="text-[#e41d28]" />
              <span>Cerrar Caja</span>
            </button>
          ) : (
            <button
              onClick={() => setShowModalApertura(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <ArrowUpCircle size={14} />
              <span>Abrir Caja</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner de estado de caja */}
      {estadoCaja && !estadoCaja.fallback && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${
          cajaEstaAbierta
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-gray-100 border-gray-300 text-gray-700'
        }`}>
          {cajaEstaAbierta
            ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            : <Lock size={16} className="text-gray-500 shrink-0" />
          }
          <p className="text-xs font-bold">
            {cajaEstaAbierta
              ? `Caja abierta · Fondo inicial: $${(estadoCaja.montoInicial || 0).toLocaleString('es-AR')}`
              : 'Caja cerrada para esta fecha'
            }
          </p>
        </div>
      )}

      {/* Tarjetas KPI del Día */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ingresos Totales del Día</p>
          <p className="text-3xl font-black text-[#1a1a1a] tracking-tight mt-1">
            ${totalDia.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-emerald-600 font-bold mt-1">
            {movimientos.length} operaciones registradas
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Cobro de Membresías</p>
          <p className="text-3xl font-black text-[#e41d28] tracking-tight mt-1">
            ${totalMembresias.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Planes de musculación y clases</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ventas de Tienda</p>
          <p className="text-3xl font-black text-sky-700 tracking-tight mt-1">
            ${totalTienda.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">Suplementos y bebidas</p>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-black text-lg text-[#1a1a1a]">Historial de Operaciones</h3>

          {/* Filtro de Tipo */}
          <div className="flex gap-2">
            {['Todos', 'Membresía', 'Venta Tienda'].map(t => (
              <button
                key={t}
                onClick={() => setTipoFiltro(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tipoFiltro === t
                    ? 'bg-[#121212] text-white'
                    : 'bg-[#f8f9fa] text-gray-600 border border-[#e0e0e0] hover:bg-[#f1f3f5]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#e0e0e0] text-gray-500 font-bold uppercase tracking-wider">
                <th className="p-3.5">Hora</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Cliente / Socio</th>
                <th className="p-3.5">Detalle</th>
                <th className="p-3.5">Método de Pago</th>
                <th className="p-3.5 text-right font-black">Monto ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]/70">
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No se registran movimientos para la fecha seleccionada.
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((m, idx) => (
                  <tr key={m._id || m.id || idx} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="p-3.5 font-mono text-gray-500">
                      {new Date(m.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        m.tipo === 'Membresía'
                          ? 'bg-[#fde8e9] text-[#e41d28] border border-[#e41d28]/20'
                          : 'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}>
                        {m.tipo}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-[#1a1a1a]">{m.socioNombre || 'Cliente Mostrador'}</td>
                    <td className="p-3.5 text-gray-600 max-w-xs truncate">{m.detalle}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-gray-700 bg-[#f1f3f5] px-2.5 py-0.5 rounded-lg border border-[#e0e0e0]">
                        {m.metodoPago}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-sm text-[#1a1a1a]">
                      +${m.monto.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
