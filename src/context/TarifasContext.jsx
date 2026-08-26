import { createContext, useContext, useState, useEffect } from 'react'

const TarifasContext = createContext()

// Planes de Musculación Iniciales
const initialPlanes = [
  { id: 1, nombre: 'Mensual', meses: 1, precio: 15000, estado: 'Activo', descripcion: 'Acceso total e irrestricto a sala de musculación y cardio.' },
  { id: 2, nombre: 'Trimestral', meses: 3, precio: 40000, estado: 'Activo', descripcion: 'Abono trimestral con 11% de bonificación mensual.' },
  { id: 3, nombre: 'Semestral', meses: 6, precio: 75000, estado: 'Activo', descripcion: 'Abono semestral con 17% de ahorro sobre el pase mensual.' },
  { id: 4, nombre: 'Anual', meses: 12, precio: 140000, estado: 'Activo', descripcion: 'Pase Anual Black libre con máximo descuento y matrícula bonificada.' },
]

// Clases y Disciplinas Iniciales
const initialDisciplinas = [
  { id: 1, nombre: 'Spinning & Cardio', precio: 18000, frecuencia: 'Mensual (Pase Libre)', capacidad: 20, estado: 'Activo' },
  { id: 2, nombre: 'CrossFit & Funcional', precio: 22000, frecuencia: 'Mensual (3x semana)', capacidad: 20, estado: 'Activo' },
  { id: 3, nombre: 'Yoga & Pilates', precio: 16000, frecuencia: 'Mensual (2x semana)', capacidad: 15, estado: 'Activo' },
  { id: 4, nombre: 'Zumba & Aeróbica', precio: 14000, frecuencia: 'Mensual (Pase Libre)', capacidad: 25, estado: 'Activo' },
  { id: 5, nombre: 'Boxeo Funcional', precio: 19000, frecuencia: 'Mensual (3x semana)', capacidad: 18, estado: 'Activo' },
  { id: 6, nombre: 'Pase Diario / Clase Suelta', precio: 3500, frecuencia: 'Por Clase / Suelto', capacidad: 30, estado: 'Activo' },
]

export function TarifasProvider({ children }) {
  const [planes, setPlanes] = useState(initialPlanes)
  const [disciplinas, setDisciplinas] = useState(initialDisciplinas)

  // ================= CRUD PLANES =================
  const addPlan = (nuevoPlan) => {
    setPlanes(prev => [{ id: Date.now(), ...nuevoPlan }, ...prev])
  }

  const updatePlan = (id, planActualizado) => {
    setPlanes(prev => prev.map(p => p.id === id ? { ...p, ...planActualizado } : p))
  }

  const deletePlan = (id) => {
    setPlanes(prev => prev.filter(p => p.id !== id))
  }

  // ================= CRUD DISCIPLINAS =================
  const addDisciplina = (nuevaDisciplina) => {
    setDisciplinas(prev => [{ id: Date.now(), ...nuevaDisciplina }, ...prev])
  }

  const updateDisciplina = (id, disciplinaActualizada) => {
    setDisciplinas(prev => prev.map(d => d.id === id ? { ...d, ...disciplinaActualizada } : d))
  }

  const deleteDisciplina = (id) => {
    setDisciplinas(prev => prev.filter(d => d.id !== id))
  }

  // ================= HELPERS DINÁMICOS =================
  const getPlanByName = (nombre) => {
    return planes.find(p => p.nombre.toLowerCase() === (nombre || '').toLowerCase()) || {
      nombre: nombre || 'Mensual',
      meses: 1,
      precio: 15000,
      estado: 'Activo'
    }
  }

  const calcularVencimientoPorPlan = (fechaBase = new Date(), nombrePlan = 'Mensual') => {
    const plan = getPlanByName(nombrePlan)
    const meses = Number(plan.meses) || 1
    const base = new Date(fechaBase)
    const target = new Date(base)
    target.setMonth(target.getMonth() + meses)

    const yyyy = target.getFullYear()
    const mm = String(target.getMonth() + 1).padStart(2, '0')
    const dd = String(target.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const planesActivos = planes.filter(p => p.estado === 'Activo')
  const disciplinasActivas = disciplinas.filter(d => d.estado === 'Activo')

  return (
    <TarifasContext.Provider
      value={{
        planes,
        planesActivos,
        disciplinas,
        disciplinasActivas,
        addPlan,
        updatePlan,
        deletePlan,
        addDisciplina,
        updateDisciplina,
        deleteDisciplina,
        getPlanByName,
        calcularVencimientoPorPlan,
      }}
    >
      {children}
    </TarifasContext.Provider>
  )
}

export function useTarifas() {
  const context = useContext(TarifasContext)
  if (!context) {
    throw new Error('useTarifas debe usarse dentro de un TarifasProvider')
  }
  return context
}
