import { useState } from 'react'
import { Building2, Users, Clock, ChevronDown, ChevronUp, Dumbbell, Sparkles } from 'lucide-react'
import { salones, clases } from '../data/mockData'

function ClaseCard({ clase }) {
  const pct = Math.round((clase.inscriptos / clase.cupos) * 100)
  const isHigh = pct >= 90
  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm p-5 hover:shadow-md hover:border-[#e41d28]/30 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#e41d28] bg-[#fde8e9] px-2.5 py-0.5 rounded-full">
              {clase.salon}
            </span>
            <h4 className="font-black text-[#1a1a1a] text-base mt-1.5">{clase.nombre}</h4>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-[#f1f3f5] border border-[#e0e0e0] px-2.5 py-1 rounded-xl shrink-0">
            <Clock size={12} className="text-[#e41d28]" />
            <span>{clase.horario}</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-600 mb-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e41d28]"></span>
          Prof. {clase.profesor}
        </p>

        {/* Days Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {clase.dias.map(d => (
            <span
              key={d}
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#f8f9fa] text-gray-700 border border-[#e0e0e0]"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Occupancy and Details */}
      <div className="pt-3 border-t border-[#e0e0e0]">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-gray-500 font-medium">Ocupación de Cupos</span>
          <span className="font-bold text-[#1a1a1a]">
            {clase.inscriptos} <span className="text-gray-400 font-normal">/ {clase.cupos}</span>
          </span>
        </div>
        <div className="h-2 bg-[#f1f3f5] rounded-full overflow-hidden border border-[#e0e0e0]">
          <div
            className={`h-full rounded-full transition-all ${
              isHigh ? 'bg-[#e41d28]' : pct >= 70 ? 'bg-[#e41d28]/80' : 'bg-[#1a1a1a]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Duración: {clase.duracion} min</span>
          <span className={isHigh ? 'text-[#e41d28] font-bold' : ''}>{pct}% ocupado</span>
        </div>
      </div>
    </div>
  )
}

function SalonCard({ salon }) {
  const clasesDelSalon = clases.filter(c => c.salon === salon.nombre)
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] shadow-sm overflow-hidden transition-all">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#121212] rounded-2xl flex items-center justify-center text-[#e41d28] shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="font-black text-[#1a1a1a] text-base">{salon.nombre}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{salon.equipamiento}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 bg-[#f1f3f5] px-3 py-1.5 rounded-xl border border-[#e0e0e0]">
            <Users size={14} className="text-[#e41d28]" />
            <span>Capacidad: <strong>{salon.capacidad} pers.</strong></span>
          </div>
          <span className="text-xs bg-[#fde8e9] text-[#e41d28] font-bold px-3 py-1 rounded-full border border-[#e41d28]/20">
            {clasesDelSalon.length} Clases
          </span>
          <div className="text-gray-400 p-1">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#e0e0e0] bg-[#f8f9fa] px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Actividades Asignadas a este espacio
          </p>
          {clasesDelSalon.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {clasesDelSalon.map(c => (
                <div key={c.id} className="bg-white rounded-xl p-3.5 border border-[#e0e0e0] shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#1a1a1a]">{c.nombre}</p>
                    <span className="text-xs font-bold text-[#e41d28] bg-[#fde8e9] px-2 py-0.5 rounded-md">
                      {c.horario}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Profesor: {c.profesor} · {c.duracion} min</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.dias.map(d => (
                      <span key={d} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f1f3f5] text-gray-700">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-2">No hay clases asignadas a este salón actualmente.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Clases() {
  const [tab, setTab] = useState('clases')
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Clases y Salones</h2>
          <p className="text-gray-500 text-sm mt-1">
            {clases.length} clases programadas activas · {salones.length} salones equipados
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#f1f3f5] p-1 rounded-2xl border border-[#e0e0e0] w-fit">
          <button
            onClick={() => setTab('clases')}
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all ${
              tab === 'clases'
                ? 'bg-[#121212] text-white shadow-md'
                : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            📋 Lista de Clases ({clases.length})
          </button>
          <button
            onClick={() => setTab('salones')}
            className={`px-5 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all ${
              tab === 'salones'
                ? 'bg-[#121212] text-white shadow-md'
                : 'text-gray-600 hover:text-[#1a1a1a]'
            }`}
          >
            🏢 Salones ({salones.length})
          </button>
        </div>
      </div>

      {tab === 'clases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {clases.map(c => <ClaseCard key={c.id} clase={c} />)}
        </div>
      )}

      {tab === 'salones' && (
        <div className="space-y-4">
          {salones.map(s => <SalonCard key={s.id} salon={s} />)}
        </div>
      )}
    </div>
  )
}
