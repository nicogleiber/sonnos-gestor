import { apiFetch } from './config'

export const clasesApi = {
  getAll: async () => {
    return await apiFetch('/clases')
  },
  create: async (data) => {
    return await apiFetch('/clases', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  update: async (id, data) => {
    return await apiFetch(`/clases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  delete: async (id) => {
    return await apiFetch(`/clases/${id}`, {
      method: 'DELETE'
    })
  },
  inscribirSocio: async (claseId, socioId) => {
    return await apiFetch(`/clases/${claseId}/inscribir`, {
      method: 'POST',
      body: JSON.stringify({ socioId })
    })
  },
  desinscribirSocio: async (claseId, socioId) => {
    return await apiFetch(`/clases/${claseId}/desinscribir`, {
      method: 'POST',
      body: JSON.stringify({ socioId })
    })
  }
}
