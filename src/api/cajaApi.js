import { apiFetch } from './config'

export const cajaApi = {
  getMovimientos: async (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.fecha) searchParams.append('fecha', params.fecha)
    if (params.tipo) searchParams.append('tipo', params.tipo)
    if (params.metodoPago) searchParams.append('metodoPago', params.metodoPago)
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return await apiFetch(`/caja${qs}`)
  },
  registrarVentaTienda: async (ventaData) => {
    return await apiFetch('/caja/venta-tienda', {
      method: 'POST',
      body: JSON.stringify(ventaData)
    })
  },
  getCierreDia: async (fecha) => {
    const qs = fecha ? `?fecha=${fecha}` : ''
    return await apiFetch(`/caja/cierre-dia${qs}`)
  }
}
