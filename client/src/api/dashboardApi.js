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
    return await apiFetch('/configuracion/sedes')
  },
  addSede: async (data) => {
    return await apiFetch('/configuracion/sedes', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  updateSede: async (sedeId, data) => {
    return await apiFetch(`/configuracion/sedes/${sedeId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  deleteSede: async (sedeId) => {
    return await apiFetch(`/configuracion/sedes/${sedeId}`, {
      method: 'DELETE'
    })
  }
}
