import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { profesoresApi } from '../api/profesoresApi'
import { personal as initialPersonal } from '../data/mockData'

const PersonalContext = createContext()

export function PersonalProvider({ children }) {
  const [profesores, setProfesores] = useState(initialPersonal)
  const [loading, setLoading] = useState(false)

  const fetchProfesores = useCallback(async () => {
    setLoading(true)
    try {
      const data = await profesoresApi.getAll()
      if (data && data.length > 0) {
        setProfesores(data.map(p => ({
          ...p,
          id: p._id || p.id,
          consultasAcordadas: p.consultasAcordadas || []
        })))
      }
    } catch (err) {
      console.warn('Usando personal local:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfesores()
  }, [fetchProfesores])

  const addProfesor = async (nuevoProfesor) => {
    try {
      const creado = await profesoresApi.create(nuevoProfesor)
      const profNorm = {
        ...creado,
        id: creado._id || creado.id,
        consultasAcordadas: creado.consultasAcordadas || []
      }
      setProfesores(prev => [profNorm, ...prev])
      return profNorm
    } catch (err) {
      const id = Date.now()
      const profesorCreado = {
        id,
        activo: nuevoProfesor.activo ?? true,
        consultasAcordadas: [],
        ...nuevoProfesor,
      }
      setProfesores(prev => [profesorCreado, ...prev])
      return profesorCreado
    }
  }

  const updateProfesor = async (id, datosActualizados) => {
    try {
      await profesoresApi.update(id, datosActualizados)
    } catch (err) {
      console.warn('Update local profesor:', err.message)
    }
    setProfesores(prev => prev.map(p => p.id === id ? { ...p, ...datosActualizados } : p))
  }

  const deleteProfesor = async (id) => {
    try {
      await profesoresApi.delete(id)
    } catch (err) {
      console.warn('Delete local profesor:', err.message)
    }
    setProfesores(prev => prev.filter(p => p.id !== id))
  }

  // Programar consulta nutricional / física
  const programarConsulta = async (profesorId, consultaData) => {
    try {
      const res = await profesoresApi.programarConsulta(profesorId, consultaData)
      await fetchProfesores()
      return res
    } catch (err) {
      // Fallback local
      setProfesores(prev => prev.map(p => {
        if (p.id === profesorId) {
          const nuevaConsulta = {
            id: Date.now().toString(),
            ...consultaData,
            estado: 'Programada'
          }
          return {
            ...p,
            consultasAcordadas: [...(p.consultasAcordadas || []), nuevaConsulta]
          }
        }
        return p
      }))
    }
  }

  // Actualizar estado de consulta (Realizada, Cancelada)
  const actualizarConsulta = async (profesorId, consultaId, data) => {
    try {
      await profesoresApi.actualizarConsulta(profesorId, consultaId, data)
      await fetchProfesores()
    } catch (err) {
      setProfesores(prev => prev.map(p => {
        if (p.id === profesorId) {
          return {
            ...p,
            consultasAcordadas: (p.consultasAcordadas || []).map(c =>
              (c._id === consultaId || c.id === consultaId) ? { ...c, ...data } : c
            )
          }
        }
        return p
      }))
    }
  }

  const profesoresActivos = profesores.filter(p => p.activo)

  return (
    <PersonalContext.Provider
      value={{
        profesores,
        profesoresActivos,
        addProfesor,
        updateProfesor,
        deleteProfesor,
        programarConsulta,
        actualizarConsulta,
        fetchProfesores,
        loading
      }}
    >
      {children}
    </PersonalContext.Provider>
  )
}

export function usePersonal() {
  const context = useContext(PersonalContext)
  if (!context) {
    throw new Error('usePersonal debe usarse dentro de un PersonalProvider')
  }
  return context
}
