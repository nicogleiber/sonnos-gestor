import { apiFetch } from './config'

export const dashboardApi = {
  getDashboard: async () => {
    return await apiFetch('/dashboard')
  },
  getMetricas: async () => {
    return await apiFetch('/dashboard')
  }
}

export const configuracionApi = {
  get: async () => {
    return await apiFetch('/configuracion')
  },
  update: async (data) => {
    return await apiFetch('/configuracion', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  getSedes: async () => {
    return await apiFetch('/sedes')
  },
  addSede: async (data) => {
    return await apiFetch('/sedes', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  updateSede: async (sedeId, data) => {
    const id = typeof sedeId === 'object' ? (sedeId?._id || sedeId?.id) : sedeId
    return await apiFetch(`/sedes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  deleteSede: async (sedeId) => {
    const id = typeof sedeId === 'object' ? (sedeId?._id || sedeId?.id) : sedeId
    return await apiFetch(`/sedes/${id}`, {
      method: 'DELETE'
    })
  }
}
