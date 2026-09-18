import { apiFetch } from './config'

export const sedesApi = {
  getAll: async () => {
    return await apiFetch('/configuracion/sedes')
  },
  getById: async (id) => {
    return await apiFetch(`/configuracion/sedes/${id}`)
  },
  create: async (data) => {
    return await apiFetch('/configuracion/sedes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id, data) => {
    return await apiFetch(`/configuracion/sedes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete: async (id) => {
    return await apiFetch(`/configuracion/sedes/${id}`, {
      method: 'DELETE',
    })
  },
}
