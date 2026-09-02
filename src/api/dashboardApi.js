import { apiFetch } from './config'

export const dashboardApi = {
  getMetricas: async () => {
    return await apiFetch('/dashboard/metricas')
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
  }
}
