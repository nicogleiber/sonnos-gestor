import { apiFetch } from './config'

export const profesoresApi = {
  getAll: async () => {
    return await apiFetch('/profesores')
  },
  create: async (data) => {
    return await apiFetch('/profesores', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  update: async (id, data) => {
    return await apiFetch(`/profesores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  delete: async (id) => {
    return await apiFetch(`/profesores/${id}`, {
      method: 'DELETE'
    })
  },
  programarConsulta: async (profesorId, consultaData) => {
    return await apiFetch(`/profesores/${profesorId}/consultas`, {
      method: 'POST',
      body: JSON.stringify(consultaData)
    })
  },
  actualizarConsulta: async (profesorId, consultaId, data) => {
    return await apiFetch(`/profesores/${profesorId}/consultas/${consultaId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }
}
