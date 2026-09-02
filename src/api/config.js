export const API_URL = 'http://localhost:5000/api'

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
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || data.message || `Error ${response.status}`)
    }
    return data
  } catch (error) {
    console.warn(`[API WARN] Fallback en endpoint ${endpoint}:`, error.message)
    throw error
  }
}
