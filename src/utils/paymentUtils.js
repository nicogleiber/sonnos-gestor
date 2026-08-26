// ============================================
// CONFIGURACIÓN DE PLANES Y PRECIOS
// ============================================
export const PLANES_CONFIG = {
  Mensual: { meses: 1, precio: 15000, label: 'Plan Mensual' },
  Trimestral: { meses: 3, precio: 40000, label: 'Plan Trimestral' },
  Semestral: { meses: 6, precio: 75000, label: 'Plan Semestral' },
  Anual: { meses: 12, precio: 140000, label: 'Plan Anual' },
}

export const TIPOS_SUSCRIPCION = Object.keys(PLANES_CONFIG)

/**
 * Calcula la fecha de vencimiento sumando los meses correspondientes al plan
 * @param {Date|string} fechaBase
 * @param {string} tipoSuscripcion
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function calcularFechaVencimiento(fechaBase = new Date(), tipoSuscripcion = 'Mensual') {
  const base = new Date(fechaBase)
  const meses = PLANES_CONFIG[tipoSuscripcion]?.meses || 1

  const target = new Date(base)
  target.setMonth(target.getMonth() + meses)

  const yyyy = target.getFullYear()
  const mm = String(target.getMonth() + 1).padStart(2, '0')
  const dd = String(target.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Formatea una fecha YYYY-MM-DD a formato legible en español
 * @param {string} fechaStr
 * @returns {string}
 */
export function formatearFecha(fechaStr) {
  if (!fechaStr) return '-'
  const [y, m, d] = fechaStr.split('-').map(Number)
  const fecha = new Date(y, m - 1, d)
  return fecha.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Calcula dinámicamente el estado de pago de un socio
 * - Al Día (Verde): > 7 días para el vencimiento
 * - En Fecha de Cobro (Amarillo): entre 0 y 7 días restantes
 * - Cuota Vencida (Rojo Sonnos): vencimiento anterior a hoy (< 0 días)
 * @param {string} fechaVtoStr - Formato YYYY-MM-DD
 * @returns {{ estado: string, key: string, diasRestantes: number, badgeColor: string, description: string }}
 */
export function getEstadoPago(fechaVtoStr) {
  if (!fechaVtoStr) {
    return {
      estado: 'Cuota Vencida',
      key: 'vencido',
      diasRestantes: -1,
      badgeColor: 'bg-[#fde8e9] text-[#e41d28] border-[#e41d28]/30',
      description: 'Sin fecha registrada',
    }
  }

  const [y, m, d] = fechaVtoStr.split('-').map(Number)
  const fechaVto = new Date(y, m - 1, d)

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  fechaVto.setHours(0, 0, 0, 0)

  const diffTime = fechaVto.getTime() - hoy.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays)
    return {
      estado: 'Cuota Vencida',
      key: 'vencido',
      diasRestantes: diffDays,
      badgeColor: 'bg-[#fde8e9] text-[#e41d28] border-[#e41d28]/30',
      description: `Venció hace ${absDays} ${absDays === 1 ? 'día' : 'días'}`,
    }
  } else if (diffDays <= 7) {
    return {
      estado: 'En Fecha de Cobro',
      key: 'cobro',
      diasRestantes: diffDays,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
      description: diffDays === 0 ? 'Vence hoy' : `Vence en ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`,
    }
  } else {
    return {
      estado: 'Al Día',
      key: 'al-dia',
      diasRestantes: diffDays,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: `Vence en ${diffDays} días`,
    }
  }
}
