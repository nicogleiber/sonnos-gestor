export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api'

export const STORAGE_TOKEN_KEY = 'sonnos_auth_token'
export const STORAGE_USER_KEY = 'sonnos_auth_user'
export const STORAGE_GYM_KEY = 'sonnos_active_gym_id'

export function getStoredToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY) || null
}

export function getStoredActiveGymId() {
  const explicitGymId = localStorage.getItem(STORAGE_GYM_KEY)
  if (explicitGymId) return explicitGymId

  try {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY)
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      return parsed.gymId || (parsed.gyms && parsed.gyms[0]?.gymId) || null
    }
  } catch {
    return null
  }
  return null
}

export async function apiFetch(endpoint, options = {}) {
  const token = getStoredToken()
  const gymId = getStoredActiveGymId()

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(gymId ? { 'x-gym-id': gymId } : {}),
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

    let resData
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      resData = await response.json()
    } else {
      resData = await response.text()
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido: limpiar sesión si existía
        if (token && !endpoint.includes('/auth/login')) {
          localStorage.removeItem(STORAGE_TOKEN_KEY)
          localStorage.removeItem(STORAGE_USER_KEY)
          localStorage.removeItem(STORAGE_GYM_KEY)
          window.dispatchEvent(new Event('sonnos_auth_logout'))
        }
      }

      let errorMsg = `Error ${response.status}`
      if (typeof resData === 'object' && resData !== null) {
        if (Array.isArray(resData.details) && resData.details.length > 0) {
          errorMsg = resData.details.map((d) => d.message || d.msg).join('. ')
        } else {
          errorMsg = resData.message || resData.error || errorMsg
        }
      } else if (typeof resData === 'string' && resData.length > 0) {
        errorMsg = resData
      }

      const error = new Error(errorMsg)
      error.status = response.status
      error.data = resData
      throw error
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
