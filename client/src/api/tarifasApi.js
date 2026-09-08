import { apiFetch } from './config'

export const tarifasApi = {
  getAll: async () => {
    return await apiFetch('/tarifas')
  },
  create: async (data) => {
    return await apiFetch('/tarifas', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  update: async (id, data) => {
    return await apiFetch(`/tarifas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  delete: async (id) => {
    return await apiFetch(`/tarifas/${id}`, {
      method: 'DELETE'
    })
  }
}
