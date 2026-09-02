import { apiFetch } from './config'

export const productosApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams()
    if (params.categoria) searchParams.append('categoria', params.categoria)
    if (params.q) searchParams.append('q', params.q)
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return await apiFetch(`/productos${qs}`)
  },
  create: async (data) => {
    return await apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  update: async (id, data) => {
    return await apiFetch(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  delete: async (id) => {
    return await apiFetch(`/productos/${id}`, {
      method: 'DELETE'
    })
  },
  calcularPrecio: async (costo, margen) => {
    return await apiFetch('/productos/calcular-precio', {
      method: 'POST',
      body: JSON.stringify({ costo, margen })
    })
  }
}
