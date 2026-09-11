export const API_URL = 'http://localhost:5050/api'

export async function apiFetch(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const resData = await response.json()
    if (!response.ok) {
      throw new Error(resData.error || resData.message || `Error ${response.status}`)
    }
    // Si la respuesta viene envuelta en { success: true, data: [...] }
    if (resData && typeof resData === 'object' && 'data' in resData) {
      return resData.data
    }
    return resData
  } catch (error) {
    console.warn(`[API WARN] Fallback en endpoint ${endpoint}:`, error.message)
    throw error
  }
}

