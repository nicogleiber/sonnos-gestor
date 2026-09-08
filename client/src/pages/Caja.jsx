import { useState, useEffect } from 'react'
import {
  Wallet,
  Calendar,
  CreditCard,
  DollarSign,
  ArrowDownRight,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Lock,
  Printer,
  FileSpreadsheet,
  X,
  Filter,
  Sparkles
} from 'lucide-react'
import { useCaja } from '../context/CajaContext'
import { formatearFecha } from '../utils/paymentUtils'

// ============================================
// MODAL: REPORTE DE CIERRE DE CAJA DEL DÍA
// ============================================
function ModalCierreCaja({ cierre, onClose }) {
  if (!cierre) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-[#e0e0e0] flex flex-col">
        {/* Header Cierre */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40 text-white">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg">Cierre de Caja Diario Consolidado</h3>
              <p className="text-xs text-gray-400">Fecha: {cierre.fecha}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Reporte Consolidado */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Total General Recaudado */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121212] to-[#242424] text-white text-center shadow-xl border border-[#333]">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Recaudación Total del Día</p>
            <p className="text-4xl font-black tracking-tight text-emerald-400 mt-1">
              ${cierre.granTotalRecaudado.toLocaleString('es-AR')}
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {cierre.cantidadOperaciones} operaciones procesadas hoy
            </p>
          </div>

          {/* Desglose por Origen (Membresías vs Tienda) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              1. Desglose por Origen de Ingresos
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0]">
                <p className="text-xs font-bold text-gray-500">Cobro de Membresías</p>
                <p className="text-xl font-black text-[#1a1a1a] mt-1">
                  ${cierre.desglosePorOrigen.totalMembresias.toLocaleString('es-AR')}
                </p>
                <span className="text-[10px] text-gray-500 font-medium">
                  {cierre.desglosePorOrigen.cantidadMembresias} cuotas
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#e0e0e0]">
                <p className="text-xs font-bold text-gray-500">Ventas de Tienda</p>
                <p className="text-xl font-black text-[#1a1a1a] mt-1">
                  ${cierre.desglosePorOrigen.totalTienda.toLocaleString('es-AR')}
                </p>
                <span className="text-[10px] text-gray-500 font-medium">
                  {cierre.desglosePorOrigen.cantidadVentasTienda} ventas
                </span>
              </div>
            </div>
          </div>

          {/* Desglose por Método de Pago */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              2. Desglose por Método de Pago (Arqueo)
            </h4>
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-white border border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs">💵</span>
                  <div>
                    <p className="text-xs font-bold text-[#1a1a1a]">Efectivo en Caja Físico</p>
                    <p className="text-[10px] text-gray-400">Total a rendir en mostrador</p>
                  </div>
                </div>
                <span className="font-black text-sm text-[#1a1a1a]">
                  ${cierre.desglosePorMetodo.totalEfectivo.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-sky-50 text-sky-700 font-black text-xs">📱</span>
                  <div>
                    <p className="text-xs font-bold text-[#1a1a1a]">Mercado Pago (QR / Alias)</p>
                    <p className="text-[10px] text-gray-400">Total acreditado en cuenta digital</p>
                  </div>
                </div>
                <span className="font-black text-sm text-sky-700">
                  ${cierre.desglosePorMetodo.totalMercadoPago.toLocaleString('es-AR')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#e0e0e0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-700 font-black text-xs">🏦</span>
                  <div>
                    <p className="text-xs font-bold text-[#1a1a1a]">Transferencias Bancarias</p>
                    <p className="text-[10px] text-gray-400">Acreditaciones directas en CVU</p>
                  </div>
                </div>
                <span className="font-black text-sm text-purple-700">
                  ${cierre.desglosePorMetodo.totalTransferencia.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
  const { movimientos, fetchMovimientos, fetchCierreDia } = useCaja()
  const [fechaFiltro, setFechaFiltro] = useState(() => new Date().toISOString().split('T')[0])
  const [tipoFiltro, setTipoFiltro] = useState('Todos')
  const [modalCierreData, setModalCierreData] = useState(null)
  const [cargandoCierre, setCargandoCierre] = useState(false)

  useEffect(() => {
    fetchMovimientos(fechaFiltro)
  }, [fechaFiltro, fetchMovimientos])

  const movimientosFiltrados = movimientos.filter(m => {
    if (tipoFiltro === 'Todos') return true
    return m.tipo === tipoFiltro
  })

  const totalDia = movimientosFiltrados.reduce((acc, m) => acc + m.monto, 0)
  const totalMembresias = movimientosFiltrados.filter(m => m.tipo === 'Membresía').reduce((acc, m) => acc + m.monto, 0)
  const totalTienda = movimientosFiltrados.filter(m => m.tipo === 'Venta Tienda').reduce((acc, m) => acc + m.monto, 0)

  const handleCerrarCaja = async () => {
    setCargandoCierre(true)
    try {
      const data = await fetchCierreDia(fechaFiltro)
      if (data) setModalCierreData(data)
    } finally {
      setCargandoCierre(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Modal Cierre */}
      {modalCierreData && (
        <ModalCierreCaja
          cierre={modalCierreData}
          onClose={() => setModalCierreData(null)}
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

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={fechaFiltro}
            onChange={e => setFechaFiltro(e.target.value)}
            className="bg-white border border-[#e0e0e0] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#1a1a1a] shadow-sm"
          />

          <button
            onClick={handleCerrarCaja}
            disabled={cargandoCierre}
            className="flex items-center gap-2 bg-[#121212] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#242424] shadow-lg shadow-black/20 transition-all cursor-pointer"
          >
            <Lock size={14} className="text-[#e41d28]" />
            <span>{cargandoCierre ? 'Calculando...' : 'Cerrar Caja del Día'}</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI del Día */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total General */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ingresos Totales del Día</p>
          <p className="text-3xl font-black text-[#1a1a1a] tracking-tight mt-1">
            ${totalDia.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-emerald-600 font-bold mt-1">
            {movimientosFiltrados.length} operaciones registradas
          </p>
        </div>

        {/* Membresías */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Cobro de Membresías</p>
          <p className="text-3xl font-black text-[#e41d28] tracking-tight mt-1">
            ${totalMembresias.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Planes de musculación y clases
          </p>
        </div>

        {/* Ventas Tienda */}
        <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Ventas de Tienda</p>
          <p className="text-3xl font-black text-sky-700 tracking-tight mt-1">
            ${totalTienda.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Suplementos y bebidas
          </p>
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
