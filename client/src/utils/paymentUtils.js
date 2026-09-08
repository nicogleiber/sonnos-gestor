// ============================================
// CONFIGURACIÓN DE PLANES Y PRECIOS
// ============================================
export const PLANES_CONFIG = {
  Mensual: { meses: 1, precio: 18000, label: 'Pase Libre Mensual' },
  Trimestral: { meses: 3, precio: 48000, label: 'Plan Trimestral Fit' },
  Semestral: { meses: 6, precio: 88000, label: 'Plan Semestral Pro' },
  Anual: { meses: 12, precio: 155000, label: 'Plan Anual Elite' },
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
 * Formatea una fecha YYYY-MM-DD o ISO a formato legible en español
 * @param {string|Date} fechaStr
 * @returns {string}
 */
export function formatearFecha(fechaStr) {
  if (!fechaStr) return '-'
  const fecha = new Date(fechaStr)
  if (isNaN(fecha.getTime())) return '-'
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
 * - Cuota Vencida (Rojo Sonnos): vencimiento anterior a hoy (< 0 días) y >= -90 días
 * - Inactivo (Gris #6b7280): más de 90 días sin pagar (< -90 días)
 * @param {string|Date} fechaVtoStr
 * @returns {{ estado: string, label: string, key: string, diasRestantes: number, badgeColor: string, badgeClass: string, description: string }}
 */
export function getEstadoPago(fechaVtoStr) {
  if (!fechaVtoStr) {
    return {
      estado: 'Cuota Vencida',
      label: 'Cuota Vencida',
      key: 'vencido',
      diasRestantes: -1,
      badgeColor: 'bg-[#fde8e9] text-[#e41d28] border-[#e41d28]/30',
      badgeClass: 'bg-[#fde8e9] text-[#e41d28] border border-[#e41d28]/30',
      description: 'Sin fecha registrada',
    }
  }

  const fechaVto = new Date(fechaVtoStr)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  fechaVto.setHours(0, 0, 0, 0)

  const diffTime = fechaVto.getTime() - hoy.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Más de 90 días vencido -> Inactivo
  if (diffDays < -90) {
    const absDays = Math.abs(diffDays)
    return {
      estado: 'Inactivo',
      label: 'Inactivo',
      key: 'inactivo',
      diasRestantes: diffDays,
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
      badgeClass: 'bg-gray-100 text-gray-700 border border-gray-300',
      description: `Inactivo (+${absDays} días sin abonar)`,
    }
  } else if (diffDays < 0) {
    const absDays = Math.abs(diffDays)
    return {
      estado: 'Cuota Vencida',
      label: 'Cuota Vencida',
      key: 'vencido',
      diasRestantes: diffDays,
      badgeColor: 'bg-[#fde8e9] text-[#e41d28] border-[#e41d28]/30',
      badgeClass: 'bg-[#fde8e9] text-[#e41d28] border border-[#e41d28]/30',
      description: `Venció hace ${absDays} ${absDays === 1 ? 'día' : 'días'}`,
    }
  } else if (diffDays <= 7) {
    return {
      estado: 'En Fecha de Cobro',
      label: 'En Fecha de Cobro',
      key: 'cobro',
      diasRestantes: diffDays,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-300',
      description: diffDays === 0 ? 'Vence hoy' : `Vence en ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`,
    }
  } else {
    return {
      estado: 'Al Día',
      label: 'Al Día',
      key: 'al-dia',
      diasRestantes: diffDays,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      description: `Vence en ${diffDays} días`,
    }
  }
}
