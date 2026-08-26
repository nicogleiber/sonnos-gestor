import { createContext, useContext, useState } from 'react'
import { personal as initialPersonal } from '../data/mockData'

const PersonalContext = createContext()

export function PersonalProvider({ children }) {
  const [profesores, setProfesores] = useState(initialPersonal)

  const addProfesor = (nuevoProfesor) => {
    const id = Date.now()
    const profesorCreado = {
      id,
      activo: nuevoProfesor.activo ?? true,
      ...nuevoProfesor,
    }
    setProfesores(prev => [profesorCreado, ...prev])
    return profesorCreado
  }

  const updateProfesor = (id, datosActualizados) => {
    setProfesores(prev => prev.map(p => p.id === id ? { ...p, ...datosActualizados } : p))
  }

  const deleteProfesor = (id) => {
    setProfesores(prev => prev.filter(p => p.id !== id))
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
