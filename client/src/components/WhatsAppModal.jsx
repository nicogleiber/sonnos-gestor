import { useState } from 'react'
import {
  MessageSquare,
  X,
  Send,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'
import { formatearFecha } from '../utils/paymentUtils'

const PLANTILLAS_PREDEFINIDAS = [
  {
    titulo: 'Aviso de Cuota por Vencer',
    texto: '¡Hola @nombre! Te recordamos desde Sonnos Gestor que tu plan @plan tiene fecha de vencimiento el @vencimiento. Podés abonar por Mercado Pago o en el mostrador. ¡Que tengas un excelente entrenamiento! 💪'
  },
  {
    titulo: 'Cuota Vencida / Regularización',
    texto: 'Hola @nombre, ¿cómo estás? Te escribimos de Sonnos Gestor porque tu cuota de @plan se encuentra vencida. Escribinos para renovarla y seguir disfrutando de tus clases sin interrupción.'
  },
  {
    titulo: 'Promoción Amigos 2x1',
    texto: '¡Hola @nombre! En Sonnos tenemos una promo especial para vos: si traés a un amigo este mes a entrenar, ambos tienen un 15% OFF en su cuota de @plan. ¡Te esperamos!'
  },
  {
    titulo: 'Novedades y Nuevas Clases',
    texto: '¡Hola @nombre! Te contamos que sumamos nuevos horarios de clases y talleres en Sonnos. Mirá el cronograma actualizado en recepción. ¡A seguir entrenando!'
  }
]

export default function WhatsAppModal({ isOpen, onClose, sociosSeleccionados }) {
  const [plantilla, setPlantilla] = useState(PLANTILLAS_PREDEFINIDAS[0].texto)
  const [copiadoId, setCopiadoId] = useState(null)

  if (!isOpen) return null

  const formatearTelefono = (tel) => {
    if (!tel) return ''
    let clean = tel.replace(/\D/g, '')
    if (clean.startsWith('0')) clean = clean.substring(1)
    if (clean.startsWith('549')) return clean
    if (clean.startsWith('54')) return '549' + clean.substring(2)
    return '549' + clean
  }

  const generarMensajeParaSocio = (socio) => {
    const vto = formatearFecha(socio.fechaVencimiento || socio.fechaVto)
    return plantilla
      .replace(/@nombre/g, socio.nombre)
      .replace(/@apellido/g, socio.apellido)
      .replace(/@vencimiento/g, vto)
      .replace(/@plan/g, socio.tipoSuscripcion || socio.suscripcion)
  }

  const copiarTexto = (texto, id) => {
    navigator.clipboard.writeText(texto)
    setCopiadoId(id)
    setTimeout(() => setCopiadoId(null), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-[#e0e0e0] flex flex-col">
        {/* Header */}
        <div className="bg-[#121212] border-b border-[#242424] px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <MessageSquare size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Contacto Masivo por WhatsApp</h3>
              <p className="text-xs text-gray-400">
                {sociosSeleccionados.length} {sociosSeleccionados.length === 1 ? 'socio seleccionado' : 'socios seleccionados'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#242424] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Plantillas Rápidas */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Plantillas Sugeridas
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLANTILLAS_PREDEFINIDAS.map(p => (
                <button
                  key={p.titulo}
                  type="button"
                  onClick={() => setPlantilla(p.texto)}
                  className="text-left p-3 rounded-2xl border border-[#e0e0e0] bg-[#f8f9fa] hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs font-bold text-[#1a1a1a] cursor-pointer"
                >
                  <p className="font-black text-[#1a1a1a] flex items-center gap-1.5">
                    <Sparkles size={12} className="text-emerald-600" />
                    {p.titulo}
                  </p>
                  <p className="text-gray-500 text-[11px] font-normal truncate mt-1">{p.texto}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Editor de Plantilla */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Mensaje Base (Usa <span className="text-emerald-600">@nombre</span>, <span className="text-emerald-600">@plan</span>, <span className="text-emerald-600">@vencimiento</span>)
              </label>
            </div>
            <textarea
              rows={4}
              value={plantilla}
              onChange={e => setPlantilla(e.target.value)}
              className="w-full border border-[#e0e0e0] bg-[#f8f9fa] focus:bg-white focus:border-emerald-600 rounded-2xl p-3.5 text-xs text-[#1a1a1a] font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
              placeholder="Escribe tu mensaje..."
            />
          </div>

          {/* Lista de Socios con Enlace de Envío */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Destinatarios y Enlaces Directos
              </label>
              <span className="text-xs text-gray-500 font-medium">Formato internacional +549</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sociosSeleccionados.map(socio => {
                const mensajeFinal = generarMensajeParaSocio(socio)
                const telInt = formatearTelefono(socio.telefono)
                const waLink = `https://wa.me/${telInt}?text=${encodeURIComponent(mensajeFinal)}`

                return (
                  <div
                    key={socio.id}
                    className="p-3.5 rounded-2xl border border-[#e0e0e0] bg-white hover:shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-xs text-[#1a1a1a]">{socio.nombre} {socio.apellido}</p>
                        <span className="text-[10px] font-mono text-gray-500 bg-[#f1f3f5] px-2 py-0.5 rounded-md">
                          +{telInt}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 italic truncate mt-0.5">"{mensajeFinal}"</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => copiarTexto(mensajeFinal, socio.id)}
                        className="flex-1 sm:flex-none p-2 rounded-xl border border-[#e0e0e0] text-gray-600 hover:bg-[#f1f3f5] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Copiar texto"
                      >
                        {copiadoId === socio.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span className="sm:hidden text-xs">Copiar</span>
                      </button>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/30 uppercase tracking-wider"
                      >
                        <Send size={13} />
                        <span>Abrir WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500">
            Haz clic en "Abrir WhatsApp" para enviar el mensaje personalizado a cada socio.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#e0e0e0] text-xs font-bold text-gray-700 hover:bg-[#f1f3f5] cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
