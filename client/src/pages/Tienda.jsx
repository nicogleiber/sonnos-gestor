import { useState } from 'react'
import {
  ShoppingBag,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Edit2,
  Package,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CreditCard,
  DollarSign,
  ArrowRight,
  Receipt,
  X
} from 'lucide-react'
import { useCaja } from '../context/CajaContext'
import { useSocios } from '../context/SociosContext'

const CATEGORIAS = ['Todas', 'Suplementos', 'Indumentaria', 'Bebidas', 'Accesorios', 'Snacks', 'Equipamiento']

// ============================================
// MODAL: NUEVO / EDITAR PRODUCTO
// ============================================
function ModalProducto({ producto, onClose, onSave }) {
  const [form, setForm] = useState({
    codigo: producto?.codigo || '',
    nombre: producto?.nombre || '',
    costo: producto?.costo || '',
    margen: producto?.margen !== undefined ? producto.margen : 35,
    precioVenta: producto?.precioVenta || '',
    stock: producto?.stock !== undefined ? producto.stock : 10,
    categoria: producto?.categoria || 'Suplementos'
  })
  const [precioCalculadoAuto, setPrecioCalculadoAuto] = useState(true)

  // Cálculo automático del precio al cambiar costo o margen
  const recalcularPrecio = (costo, margen) => {
    if (!costo || isNaN(costo)) return ''
    const base = Number(costo) * (1 + Number(margen || 0) / 100)
    return Math.ceil(base / 50) * 50
  }

  const handleCostoChange = (e) => {
    const c = e.target.value
    setForm(prev => {
      const nuevoForm = { ...prev, costo: c }
      if (precioCalculadoAuto) {
        nuevoForm.precioVenta = recalcularPrecio(c, prev.margen)
      }
      return nuevoForm
    })
  }

  const handleMargenChange = (e) => {
    const m = e.target.value
    setForm(prev => {
      const nuevoForm = { ...prev, margen: m }
      if (precioCalculadoAuto) {
        nuevoForm.precioVenta = recalcularPrecio(prev.costo, m)
      }
      return nuevoForm
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      costo: Number(form.costo),
      margen: Number(form.margen),
      precioVenta: Number(form.precioVenta),
      stock: Number(form.stock)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#e0e0e0]">
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e41d28] flex items-center justify-center text-white">
              <Package size={18} />
            </div>
            <div>
              <h3 className="font-black text-lg">
                {producto ? 'Editar Producto' : 'Nuevo Producto en Tienda'}
              </h3>
              <p className="text-xs text-gray-400">Inventario y cálculo automático de precio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Código / SKU</label>
              <input
                required
                value={form.codigo}
                onChange={e => setForm(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Ej: PROT-WHEY-1K"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={e => setForm(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1a1a1a]"
              >
                {CATEGORIAS.filter(c => c !== 'Todas').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Nombre del Producto</label>
            <input
              required
              value={form.nombre}
              onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Proteína Whey Isolate 1kg Vainilla"
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a1a1a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Costo Unitario ($ ARS)</label>
              <input
                type="number"
                min="0"
                required
                value={form.costo}
                onChange={handleCostoChange}
                placeholder="Ej: 28000"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm font-black text-[#1a1a1a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Margen Requerido (%)</label>
              <input
                type="number"
                min="0"
                required
                value={form.margen}
                onChange={handleMargenChange}
                placeholder="Ej: 35"
                className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a1a1a]"
              />
            </div>
          </div>

          {/* Precio de Venta Calculado con Redondeo al múltiplo de 50 */}
          <div className="p-4 rounded-2xl bg-[#fde8e9]/50 border border-[#e41d28]/30">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase tracking-wide text-[#e41d28]">
                Precio de Venta Sugerido ($ ARS)
              </label>
              <span className="text-[10px] text-gray-500 font-bold">Redondeo automático superior a $50</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                required
                value={form.precioVenta}
                onChange={e => {
                  setPrecioCalculadoAuto(false)
                  setForm(prev => ({ ...prev, precioVenta: e.target.value }))
                }}
                className="w-full border border-[#e41d28]/40 bg-white rounded-xl px-4 py-2.5 text-lg font-black text-[#e41d28] focus:outline-none focus:ring-2 focus:ring-[#e41d28]"
              />
              <button
                type="button"
                onClick={() => {
                  setPrecioCalculadoAuto(true)
                  setForm(prev => ({ ...prev, precioVenta: recalcularPrecio(prev.costo, prev.margen) }))
                }}
                className="px-3 py-2.5 rounded-xl border border-[#e41d28]/30 bg-white text-[#e41d28] text-xs font-bold hover:bg-[#fde8e9] shrink-0"
                title="Recalcular con fórmula"
              >
                Auto 🔄
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              Fórmula: Costo × (1 + {form.margen || 0}%) redondeado hacia arriba.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Stock Inicial</label>
            <input
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3.5 py-2 text-sm font-bold text-[#1a1a1a]"
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
              {producto ? 'Guardar Cambios' : 'Registrar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL: TIENDA & INVENTARIO
// ============================================
export default function Tienda() {
  const {
    productos,
    addProducto,
    updateProducto,
    deleteProducto,
    carrito,
    addToCarrito,
    removeFromCarrito,
    updateCantidadCarrito,
    clearCarrito,
    totalCarrito,
    registrarVentaTienda
  } = useCaja()

  const { socios } = useSocios()

  const [tab, setTab] = useState('pos') // 'pos' | 'inventario'
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [modalProdData, setModalProdData] = useState(null)
  const [metodoPago, setMetodoPago] = useState('Efectivo')
  const [socioSeleccionado, setSocioSeleccionado] = useState('')
  const [procesandoVenta, setProcesandoVenta] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const mostrarToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const productosFiltrados = productos.filter(p => {
    const matchCat = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro
    const matchQ = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                   p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchQ
  })

  const handleFinalizarVenta = async () => {
    if (carrito.length === 0) return
    setProcesandoVenta(true)
    try {
      await registrarVentaTienda({
        metodoPago,
        socioNombre: socioSeleccionado || 'Cliente Mostrador'
      })
      mostrarToast(`🎉 ¡Venta de $${totalCarrito.toLocaleString('es-AR')} registrada en Caja exitosamente!`)
      setSocioSeleccionado('')
    } catch (err) {
      alert(err.message || 'Error al procesar la venta.')
    } finally {
      setProcesandoVenta(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white border border-[#242424] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles size={18} className="text-[#e41d28]" />
          <span className="text-sm font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Modal Producto */}
      {modalProdData !== null && (
        <ModalProducto
          producto={modalProdData?.id ? modalProdData : null}
          onClose={() => setModalProdData(null)}
          onSave={async (data) => {
            if (modalProdData?.id) {
              await updateProducto(modalProdData.id, data)
              mostrarToast('✏️ Producto actualizado.')
            } else {
              await addProducto(data)
              mostrarToast('✅ Nuevo producto agregado al inventario.')
            }
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#fde8e9] text-[#e41d28]">
              <ShoppingBag size={18} />
            </span>
            <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Tienda & Punto de Venta</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Ventas de suplementos, indumentaria y control de stock integrado con Caja.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#f1f3f5] p-1 rounded-2xl border border-[#e0e0e0] w-fit self-start sm:self-auto">
          <button
            onClick={() => setTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'pos' ? 'bg-[#121212] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            🛒 Punto de Venta ({carrito.length})
          </button>
          <button
            onClick={() => setTab('inventario')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              tab === 'inventario' ? 'bg-[#121212] text-white shadow-md' : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            📦 Inventario ({productos.length})
          </button>
        </div>
      </div>

      {/* ==========================================
          VISTA: PUNTO DE VENTA (POS)
         ========================================== */}
      {tab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catálogo de Productos (2 Columnas) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Buscador y Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar producto por nombre o código..."
                  className="w-full bg-white border border-[#e0e0e0] focus:border-[#e41d28] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-[#1a1a1a]"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {CATEGORIAS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFiltro(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      categoriaFiltro === cat
                        ? 'bg-[#e41d28] text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-[#e0e0e0] hover:bg-[#f1f3f5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productosFiltrados.map(prod => {
                const sinStock = prod.stock <= 0
                return (
                  <div
                    key={prod._id || prod.id}
                    className="bg-white rounded-2xl border border-[#e0e0e0] p-4 shadow-sm hover:shadow-md hover:border-[#e41d28]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className="text-[10px] font-mono text-gray-400 font-bold bg-[#f1f3f5] px-2 py-0.5 rounded-md">
                          {prod.codigo}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sinStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sinStock ? 'Sin Stock' : `${prod.stock} disp.`}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1a1a1a] text-xs leading-snug line-clamp-2">{prod.nombre}</h4>
                      <p className="text-[10px] text-gray-400 mt-1">{prod.categoria}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-gray-400">Precio</p>
                        <p className="text-base font-black text-[#1a1a1a]">${prod.precioVenta.toLocaleString('es-AR')}</p>
                      </div>
                      <button
                        onClick={() => addToCarrito(prod)}
                        disabled={sinStock}
                        className="p-2.5 rounded-xl bg-[#e41d28] text-white hover:bg-[#c71620] disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                        title="Agregar al Carrito"
                      >
                        <Plus size={16} className="stroke-[3]" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel Lateral: Carrito y Cobro */}
          <div className="bg-white rounded-3xl border border-[#e0e0e0] p-6 shadow-sm flex flex-col justify-between h-fit space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-[#e41d28]" />
                  <h3 className="font-black text-[#1a1a1a] text-base">Carrito de Venta</h3>
                </div>
                {carrito.length > 0 && (
                  <button
                    onClick={clearCarrito}
                    className="text-[11px] font-bold text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {/* Items del Carrito */}
              <div className="space-y-3 my-4 max-h-64 overflow-y-auto pr-1">
                {carrito.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-xs">No hay productos en el carrito.</p>
                  </div>
                ) : (
                  carrito.map(item => (
                    <div key={item.productoId} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#f8f9fa] border border-[#e0e0e0]">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-[#1a1a1a] truncate">{item.nombre}</p>
                        <p className="text-[10px] text-gray-400">${item.precioUnitario.toLocaleString('es-AR')} c/u</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-[#e0e0e0] bg-white rounded-lg">
                          <button
                            onClick={() => updateCantidadCarrito(item.productoId, item.cantidad - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-black">{item.cantidad}</span>
                          <button
                            onClick={() => updateCantidadCarrito(item.productoId, item.cantidad + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-black text-[#1a1a1a] w-14 text-right">
                          ${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selector de Socio Opcional */}
              <div className="space-y-3 pt-3 border-t border-[#e0e0e0]">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Cliente / Socio Asignado (Opcional)
                  </label>
                  <select
                    value={socioSeleccionado}
                    onChange={e => setSocioSeleccionado(e.target.value)}
                    className="w-full border border-[#e0e0e0] bg-[#f8f9fa] rounded-xl px-3 py-2 text-xs font-medium text-[#1a1a1a]"
                  >
                    <option value="">Cliente Mostrador (Anónimo)</option>
                    {socios.map(s => (
                      <option key={s.id} value={`${s.nombre} ${s.apellido}`}>
                        {s.nombre} {s.apellido} ({s.dni || s.telefono})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Efectivo', 'Mercado Pago', 'Transferencia'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMetodoPago(m)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                          metodoPago === m
                            ? 'bg-[#121212] text-white border-[#121212] shadow-sm'
                            : 'bg-[#f8f9fa] text-gray-600 border-[#e0e0e0] hover:bg-[#f1f3f5]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Total y Botón de Venta */}
            <div className="pt-4 border-t border-[#e0e0e0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Total a Cobrar</span>
                <span className="text-2xl font-black text-[#1a1a1a] tracking-tight">
                  ${totalCarrito.toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={handleFinalizarVenta}
                disabled={carrito.length === 0 || procesandoVenta}
                className="w-full flex items-center justify-center gap-2 bg-[#e41d28] text-white py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
              >
                <Receipt size={16} />
                <span>{procesandoVenta ? 'Procesando...' : 'Registrar Venta en Caja'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VISTA: INVENTARIO DE PRODUCTOS
         ========================================== */}
      {tab === 'inventario' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg text-[#1a1a1a]">Control de Stock y Precios</h3>
            <button
              onClick={() => setModalProdData({})}
              className="flex items-center gap-2 bg-[#e41d28] text-white px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-[#c71620] uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer"
            >
              <Plus size={16} className="stroke-[3]" />
              Nuevo Producto
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#e0e0e0] shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e0e0e0] text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Código</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Costo ($)</th>
                  <th className="p-4">Margen</th>
                  <th className="p-4 text-[#e41d28]">Precio Venta ($)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]/70">
                {productos.map(p => (
                  <tr key={p._id || p.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-600">{p.codigo}</td>
                    <td className="p-4 font-black text-[#1a1a1a]">{p.nombre}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f1f3f5] text-gray-700 font-medium">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-600">${p.costo.toLocaleString('es-AR')}</td>
                    <td className="p-4 font-bold text-emerald-700">+{p.margen}%</td>
                    <td className="p-4 font-black text-[#e41d28] text-sm">${p.precioVenta.toLocaleString('es-AR')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-black text-[11px] ${
                        p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} unidades
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setModalProdData(p)}
                        className="p-1.5 rounded-lg border border-[#e0e0e0] text-gray-600 hover:text-black hover:bg-gray-100"
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar producto "${p.nombre}"?`)) {
                            deleteProducto(p._id || p.id)
                          }
                        }}
                        className="p-1.5 rounded-lg border border-[#e0e0e0] text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
