import { useState, useEffect, useRef } from 'react'
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  CreditCard,
  Calendar,
  User,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'
import { useSocios } from '../context/SociosContext'
import { formatearFecha } from '../utils/paymentUtils'

export default function CheckinModal({ isOpen, onClose, onOpenCobro }) {
  const { checkinSocio } = useSocios()
  const [codigoInput, setCodigoInput] = useState('')
  const [socioEncontrado, setSocioEncontrado] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    } else {
      setCodigoInput('')
      setSocioEncontrado(null)
      setErrorMsg(null)
    }
  }, [isOpen])

  const handleBuscar = async (e) => {
    if (e) e.preventDefault()
    if (!codigoInput.trim()) return

    setBuscando(true)
    setErrorMsg(null)
    setSocioEncontrado(null)

    try {
      const res = await checkinSocio(codigoInput.trim())
      if (res.encontrado && res.socio) {
        setSocioEncontrado(res.socio)
      } else {
        setErrorMsg(res.message || 'No se encontró socio con ese código.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar fichaje.')
    } finally {
      setBuscando(false)
      setCodigoInput('')
    }
  }

  if (!isOpen) return null

  const esVencido = socioEncontrado?.estadoPago === 'Vencida' || socioEncontrado?.estadoPago === 'Inactivo'
  const esEnCobro = socioEncontrado?.estadoPago === 'En Fecha de Cobro'
  const esAlDia = socioEncontrado?.estadoPago === 'Al Día'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#e0e0e0] relative flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e41d28] rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/40">
              <ScanLine size={22} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Fichaje de Ingreso (Check-in)</h3>
              <p className="text-xs text-gray-400">Recepción y control de accesos USB / QR / DNI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Bar para Lector USB / Teclado */}
        <div className="p-6 bg-[#f8f9fa] border-b border-[#e0e0e0]">
          <form onSubmit={handleBuscar} className="flex gap-3">
            <div className="relative flex-1">
              <QrCode size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={codigoInput}
                onChange={e => setCodigoInput(e.target.value)}
                placeholder="Escanear código de barras / QR / Escribir DNI o ID..."
                className="w-full bg-white border border-[#e0e0e0] focus:border-[#e41d28] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e41d28]/20 transition-all placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={buscando}
              className="bg-[#e41d28] text-white px-6 py-3.5 rounded-2xl text-xs font-black hover:bg-[#c71620] uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
            >
              {buscando ? 'Buscando...' : 'Fichar'}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 p-3 bg-[#fde8e9] border border-[#e41d28]/30 rounded-xl text-[#e41d28] text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pantalla Gigante de Tarjeta de Socio */}
        <div className="p-6 flex-1 flex flex-col justify-center min-h-[300px]">
          {socioEncontrado ? (
            <div className={`p-6 rounded-3xl border-2 transition-all ${
              esAlDia
                ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-200'
                : esEnCobro
                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200'
                : 'bg-red-50/60 border-red-400 ring-2 ring-red-200'
            }`}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                {/* Avatar Gigante */}
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shrink-0 ${
                  esAlDia ? 'bg-emerald-600 text-white' : esEnCobro ? 'bg-amber-500 text-white' : 'bg-[#e41d28] text-white'
                }`}>
                  {socioEncontrado.nombre[0]}{socioEncontrado.apellido[0]}
                </div>

                {/* Datos del Socio */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] tracking-tight">
                      {socioEncontrado.nombre} {socioEncontrado.apellido}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider self-center md:self-auto shadow-sm ${
                      esAlDia
                        ? 'bg-emerald-500 text-white'
                        : esEnCobro
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#e41d28] text-white'
                    }`}>
                      {esAlDia && <CheckCircle2 size={14} />}
                      {esEnCobro && <AlertTriangle size={14} />}
                      {esVencido && <XCircle size={14} />}
                      {socioEncontrado.estadoPago}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-medium">
                    Plan: <strong className="text-[#1a1a1a]">{socioEncontrado.tipoSuscripcion || socioEncontrado.suscripcion}</strong> · DNI: <strong>{socioEncontrado.dni || 'S/D'}</strong>
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-[#e41d28]" />
                      <span className="truncate">{socioEncontrado.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[#e41d28]" />
                      <span>{socioEncontrado.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-[#e41d28]" />
                      <span>Vence: <strong>{formatearFecha(socioEncontrado.fechaVencimiento || socioEncontrado.fechaVto)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-[#e41d28]" />
                      <span>Género: <strong>{socioEncontrado.genero || 'No especificado'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Cobro Inmediato si está vencido o en cobro */}
              {(esVencido || esEnCobro) && (
                <div className="mt-6 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <ShieldAlert size={16} className="text-[#e41d28]" />
                    <span>Se requiere regularizar el pago de la membresía.</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose()
                      if (onOpenCobro) onOpenCobro(socioEncontrado)
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#e41d28] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#c71620] transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
                  >
                    <CreditCard size={14} />
                    Cobrar Cuota Ahora
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#f1f3f5] text-gray-400 flex items-center justify-center mx-auto">
                <ScanLine size={32} />
              </div>
              <p className="text-sm font-bold text-gray-500">Listo para fichar socios</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Pasa el código de barras por el lector USB o ingresa el DNI/código en el campo superior.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
