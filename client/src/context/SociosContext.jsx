import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { sociosApi } from '../api/sociosApi'
import { socios as initialMockSocios } from '../data/mockData'

const SociosContext = createContext()

export function SociosProvider({ children }) {
  const [socios, setSocios] = useState(initialMockSocios)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSocios = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await sociosApi.getAll(params)
      // Adaptar IDs si vienen de MongoDB _id
      const normalizados = data.map(s => ({
        ...s,
        id: s._id || s.id,
        fechaVto: s.fechaVencimiento || s.fechaVto,
        suscripcion: s.tipoSuscripcion || s.suscripcion
      }))
      setSocios(normalizados)
    } catch (err) {
      console.warn('Usando estado local para socios:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSocios()
  }, [fetchSocios])

  const addSocio = async (nuevoSocio) => {
    try {
      const creado = await sociosApi.create(nuevoSocio)
      const socioNormalizado = {
        ...creado,
        id: creado._id || creado.id,
        fechaVto: creado.fechaVencimiento || creado.fechaVto,
        suscripcion: creado.tipoSuscripcion || creado.suscripcion
      }
      setSocios(prev => [socioNormalizado, ...prev])
      return socioNormalizado
    } catch (err) {
      // Fallback local
      const id = Date.now()
      const fallbackSocio = {
        id,
        ...nuevoSocio,
        fechaVto: nuevoSocio.fechaVencimiento || nuevoSocio.fechaVto,
        suscripcion: nuevoSocio.tipoSuscripcion || nuevoSocio.suscripcion,
        activo: true
      }
      setSocios(prev => [fallbackSocio, ...prev])
      return fallbackSocio
    }
  }

  const updateSocio = async (id, datosActualizados) => {
    try {
      const actualizado = await sociosApi.update(id, datosActualizados)
      const socioNormalizado = {
        ...actualizado,
        id: actualizado._id || actualizado.id,
        fechaVto: actualizado.fechaVencimiento || actualizado.fechaVto,
        suscripcion: actualizado.tipoSuscripcion || actualizado.suscripcion
      }
      setSocios(prev => prev.map(s => s.id === id ? socioNormalizado : s))
      return socioNormalizado
    } catch (err) {
      setSocios(prev => prev.map(s => s.id === id ? { ...s, ...datosActualizados } : s))
    }
  }

  const deleteSocio = async (id) => {
    try {
      await sociosApi.delete(id)
    } catch (err) {
      console.warn('Eliminación local:', err.message)
    }
    setSocios(prev => prev.filter(s => s.id !== id))
  }

  const registrarPago = async (id, pagoData) => {
    try {
      const res = await sociosApi.registrarPago(id, pagoData)
      if (res && res.socio) {
        const sActualizado = {
          ...res.socio,
          id: res.socio._id || res.socio.id,
          fechaVto: res.socio.fechaVencimiento,
          suscripcion: res.socio.tipoSuscripcion
        }
        setSocios(prev => prev.map(s => s.id === id ? sActualizado : s))
        return res
      }
    } catch (err) {
      // Fallback local
      setSocios(prev => prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            fechaVto: pagoData.nuevaFechaVto,
            estadoPago: 'Al Día',
            historialPagos: [
              ...(s.historialPagos || []),
              {
                fecha: new Date(),
                monto: pagoData.monto,
                metodoPago: pagoData.metodoPago,
                suscripcion: pagoData.planNombre || s.suscripcion,
                nuevaFechaVto: pagoData.nuevaFechaVto
              }
            ]
          }
        }
        return s
      }))
    }
  }

  const checkinSocio = async (codigo) => {
    try {
      return await sociosApi.checkin(codigo)
    } catch (err) {
      // Fallback local matching
      const clean = codigo.trim().toLowerCase()
      const match = socios.find(s =>
        (s.codigoFichaje && s.codigoFichaje.toLowerCase() === clean) ||
        (s.dni && s.dni.toLowerCase() === clean) ||
        (s.email && s.email.toLowerCase() === clean) ||
        s.id.toString() === clean
      )
      if (match) {
        return { encontrado: true, socio: match }
      }
      return { encontrado: false, message: `Socio no encontrado con código "${codigo}"` }
    }
  }

  return (
    <SociosContext.Provider
      value={{
        socios,
        loading,
        error,
        fetchSocios,
        addSocio,
        updateSocio,
        deleteSocio,
        registrarPago,
        checkinSocio
      }}
    >
      {children}
    </SociosContext.Provider>
  )
}

export function useSocios() {
  const context = useContext(SociosContext)
  if (!context) {
    throw new Error('useSocios debe usarse dentro de un SociosProvider')
  }
  return context
}
