import { apiFetch } from './config'
import { socios as mockSocios } from '../data/mockData'

export const sociosApi = {
  getAll: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams()
      if (params.q) searchParams.append('q', params.q)
      if (params.estado) searchParams.append('estado', params.estado)
      if (params.desde) searchParams.append('desde', params.desde)
      if (params.hasta) searchParams.append('hasta', params.hasta)
      if (params.abandonos) searchParams.append('abandonos', 'true')

      const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : ''
      return await apiFetch(`/socios${queryStr}`)
    } catch (e) {
      console.warn('Usando mock fallback para socios:', e.message)
      return mockSocios
    }
  },

  getById: async (id) => {
    return await apiFetch(`/socios/${id}`)
  },

  create: async (data) => {
    return await apiFetch('/socios', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  update: async (id, data) => {
    return await apiFetch(`/socios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  delete: async (id) => {
    return await apiFetch(`/socios/${id}`, {
      method: 'DELETE'
    })
  },

  registrarPago: async (id, pagoData) => {
    return await apiFetch(`/socios/${id}/pagar`, {
      method: 'POST',
      body: JSON.stringify(pagoData)
    })
  },

  checkin: async (codigo) => {
    return await apiFetch('/socios/checkin', {
      method: 'POST',
      body: JSON.stringify({ codigo })
    })
  },

  generarMensajesWhatsApp: async (socioIds, plantilla) => {
    return await apiFetch('/socios/whatsapp-template', {
      method: 'POST',
      body: JSON.stringify({ socioIds, plantilla })
    })
  }
}
