import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { configuracionApi } from '../api/dashboardApi'

const GymContext = createContext()

const DEFAULT_GYM = {
  name: 'Sonnos Gym',
  telefono: '011-4500-0000',
  direccion: 'Av. Corrientes 1234, CABA',
  email: 'contacto@sonnos.com',
  sitioWeb: 'https://sonnos.com.ar',
  cuit: '30-71829304-9',
  aliasMercadoPago: 'sonnos.gym.mp',
  cvuTransferencia: '0000003100045892110293',
  horarioApertura: '06:00',
  horarioCierre: '22:00',
  diasApertura: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  capacidadMaxima: 150,
}

const DEFAULT_SEDES = [
  { _id: 'sede-central', nombre: 'Sede Central (Belgrano)', direccion: 'Av. Cabildo 2400', telefono: '011-4780-1234', principal: true },
]

export function GymProvider({ children }) {
  const [perfil, setPerfil] = useState(DEFAULT_GYM)
  const [sedes, setSedes] = useState(DEFAULT_SEDES)
  const [sedeActiva, setSedeActiva] = useState('sede-central')
  const [loading, setLoading] = useState(false)

  // Cargar perfil y sedes al montar
  const fetchPerfil = useCallback(async () => {
    setLoading(true)
    try {
      const data = await configuracionApi.get()
      const gym = data?.data?.gym || data?.gym || data
      if (gym && Object.keys(gym).length > 0) {
        setPerfil(prev => ({ ...prev, ...gym }))
      }
    } catch (err) {
      console.warn('Perfil gym fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSedes = useCallback(async () => {
    try {
      const data = await configuracionApi.getSedes()
      const lista = data?.data || data || []
      if (Array.isArray(lista) && lista.length > 0) {
        setSedes(lista)
        if (!sedeActiva || !lista.some(s => s._id === sedeActiva)) {
          const principal = lista.find(s => s.principal) || lista[0]
          setSedeActiva(principal._id || principal.id)
        }
      }
    } catch (err) {
      console.warn('Sedes fallback:', err.message)
    }
  }, [sedeActiva])

  useEffect(() => {
    fetchPerfil()
    fetchSedes()
  }, [fetchPerfil, fetchSedes])

  // Actualizar perfil del gimnasio
  const updatePerfil = async (formData) => {
    try {
      const data = await configuracionApi.update(formData)
      const gym = data?.data?.gym || data?.data || formData
      setPerfil(prev => ({ ...prev, ...gym }))
      return gym
    } catch (err) {
      console.warn('Update perfil fallback:', err.message)
      setPerfil(prev => ({ ...prev, ...formData }))
      return formData
    }
  }

  // CRUD de sedes
  const addSede = async (sedeData) => {
    try {
      const data = await configuracionApi.addSede(sedeData)
      const lista = data?.data || data || []
      if (Array.isArray(lista) && lista.length > 0) {
        setSedes(lista)
        return lista
      }
    } catch (err) {
      console.warn('Add sede fallback:', err.message)
    }
    // Fallback local
    const nueva = {
      _id: 'sede-' + Date.now(),
      ...sedeData
    }
    setSedes(prev => {
      let updated = [...prev]
      if (nueva.principal) {
        updated = updated.map(s => ({ ...s, principal: false }))
      }
      return [...updated, nueva]
    })
    return nueva
  }

  const updateSede = async (sedeId, sedeData) => {
    const validId = typeof sedeId === 'object' ? (sedeId?._id || sedeId?.id) : sedeId
    try {
      const data = await configuracionApi.updateSede(validId, sedeData)
      const lista = data?.data || data || []
      if (Array.isArray(lista) && lista.length > 0) {
        setSedes(lista)
        return lista
      }
    } catch (err) {
      console.warn('Update sede fallback:', err.message)
    }
    // Fallback local
    setSedes(prev => prev.map(s => {
      if (s._id === validId || s.id === validId) {
        return { ...s, ...sedeData }
      }
      if (sedeData.principal) {
        return { ...s, principal: false }
      }
      return s
    }))
  }

  const deleteSede = async (sedeId) => {
    const validId = typeof sedeId === 'object' ? (sedeId?._id || sedeId?.id) : sedeId
    try {
      const data = await configuracionApi.deleteSede(validId)
      const lista = data?.data || data || []
      if (Array.isArray(lista)) {
        setSedes(lista)
        if (sedeActiva === validId) {
          setSedeActiva(lista.length > 0 ? (lista[0]._id || lista[0].id) : null)
        }
        return lista
      }
    } catch (err) {
      console.warn('Delete sede fallback:', err.message)
    }
    // Fallback local
    setSedes(prev => {
      const filtered = prev.filter(s => s._id !== validId && s.id !== validId)
      if (sedeActiva === validId) {
        setSedeActiva(filtered.length > 0 ? (filtered[0]._id || filtered[0].id) : null)
      }
      return filtered
    })
  }

  const sedeActivaData = sedes.find(s => (s._id === sedeActiva || s.id === sedeActiva)) || sedes[0] || null

  return (
    <GymContext.Provider
      value={{
        perfil,
        sedes,
        sedeActiva,
        sedeActivaData,
        setSedeActiva,
        loading,
        fetchPerfil,
        fetchSedes,
        updatePerfil,
        addSede,
        updateSede,
        deleteSede,
      }}
    >
      {children}
    </GymContext.Provider>
  )
}

export function useGym() {
  const context = useContext(GymContext)
  if (!context) throw new Error('useGym debe usarse dentro de un GymProvider')
  return context
}
