import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { tarifasApi } from '../api/tarifasApi'

export const initialPlanes = [
  { id: 1, nombre: 'Pase Libre Mensual', meses: 1, precio: 18000, activo: true, descripcion: 'Acceso ilimitado a sala de musculación y cardio.' },
  { id: 2, nombre: 'Plan Trimestral Fit', meses: 3, precio: 48000, activo: true, descripcion: 'Ahorro del 15% pagando el trimestre por adelantado.' },
  { id: 3, nombre: 'Plan Semestral Pro', meses: 6, precio: 88000, activo: true, descripcion: 'Acceso semestral con evaluación física mensual incluida.' },
  { id: 4, nombre: 'Plan Anual Elite', meses: 12, precio: 155000, activo: true, descripcion: 'La mejor tarifa anual con acceso total a todas las áreas.' },
]

export const initialDisciplinas = [
  { id: 1, nombre: 'Spinning & Cardio', precio: 16000, frecuencia: '3 veces por semana', cupos: 20, activo: true },
  { id: 2, nombre: 'Cross Training & Funcional', precio: 17500, frecuencia: 'Pase Libre', cupos: 20, activo: true },
  { id: 3, nombre: 'Yoga & Pilates', precio: 15000, frecuencia: '2 veces por semana', cupos: 15, activo: true },
  { id: 4, nombre: 'Boxeo Training', precio: 16500, frecuencia: '3 veces por semana', cupos: 18, activo: true },
]

const TarifasContext = createContext()

export function TarifasProvider({ children }) {
  const [planes, setPlanes] = useState(initialPlanes)
  const [disciplinas, setDisciplinas] = useState(initialDisciplinas)
  const [loading, setLoading] = useState(false)

  const fetchTarifas = useCallback(async () => {
    setLoading(true)
    try {
      const data = await tarifasApi.getAll()
      if (data && data.length > 0) {
        const planesDB = data.filter(t => t.tipo === 'Plan Musculación').map(p => ({
          id: p._id || p.id,
          nombre: p.nombre,
          meses: p.duracionMeses || 1,
          precio: p.precio,
          activo: p.activo,
          promocionReferidos: p.promocionReferidos,
          descripcion: p.descripcion
        }))
        const disciplinasDB = data.filter(t => t.tipo === 'Clase/Disciplina').map(d => ({
          id: d._id || d.id,
          nombre: d.nombre,
          precio: d.precio,
          frecuencia: d.frecuencia || '3 veces por semana',
          cupos: d.cupos || 20,
          activo: d.activo
        }))

        if (planesDB.length > 0) setPlanes(planesDB)
        if (disciplinasDB.length > 0) setDisciplinas(disciplinasDB)
      }
    } catch (err) {
      console.warn('Usando tarifas locales:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTarifas()
  }, [fetchTarifas])

  // CRUD Planes Musculación
  const addPlan = async (nuevoPlan) => {
    try {
      const creado = await tarifasApi.create({
        nombre: nuevoPlan.nombre,
        tipo: 'Plan Musculación',
        duracionMeses: Number(nuevoPlan.meses) || 1,
        precio: Number(nuevoPlan.precio),
        activo: nuevoPlan.estado ? nuevoPlan.estado === 'Activo' : (nuevoPlan.activo !== false),
        promocionReferidos: nuevoPlan.promocionReferidos || '',
        descripcion: nuevoPlan.descripcion || ''
      })
      await fetchTarifas()
      return creado
    } catch (err) {
      console.warn('Error al crear plan en DB, usando fallback local:', err.message)
      const id = Date.now()
      const planNorm = { id, activo: true, estado: 'Activo', ...nuevoPlan, meses: Number(nuevoPlan.meses) || 1, precio: Number(nuevoPlan.precio) }
      setPlanes(prev => [...prev, planNorm])
      return planNorm
    }
  }

  const updatePlan = async (id, datosActualizados) => {
    try {
      await tarifasApi.update(id, {
        nombre: datosActualizados.nombre,
        tipo: 'Plan Musculación',
        duracionMeses: Number(datosActualizados.meses),
        precio: Number(datosActualizados.precio),
        activo: datosActualizados.estado ? datosActualizados.estado === 'Activo' : (datosActualizados.activo !== false),
        promocionReferidos: datosActualizados.promocionReferidos,
        descripcion: datosActualizados.descripcion
      })
      await fetchTarifas()
    } catch (err) {
      console.warn('Error al actualizar plan en DB, usando fallback local:', err.message)
      setPlanes(prev => prev.map(p => p.id === id ? {
        ...p,
        ...datosActualizados,
        meses: Number(datosActualizados.meses) || p.meses,
        precio: Number(datosActualizados.precio) || p.precio
      } : p))
    }
  }

  const deletePlan = async (id) => {
    try {
      await tarifasApi.delete(id)
      await fetchTarifas()
    } catch (err) {
      console.warn('Delete local plan:', err.message)
      setPlanes(prev => prev.filter(p => p.id !== id))
    }
  }

  // CRUD Disciplinas
  const addDisciplina = async (nuevaDisc) => {
    try {
      const creado = await tarifasApi.create({
        nombre: nuevaDisc.nombre,
        tipo: 'Clase/Disciplina',
        precio: Number(nuevaDisc.precio),
        frecuencia: nuevaDisc.frecuencia,
        cupos: Number(nuevaDisc.capacidad || nuevaDisc.cupos) || 20,
        activo: nuevaDisc.estado ? nuevaDisc.estado === 'Activo' : (nuevaDisc.activo !== false)
      })
      await fetchTarifas()
      return creado
    } catch (err) {
      console.warn('Error al crear disciplina en DB, usando fallback local:', err.message)
      const id = Date.now()
      const discNorm = { id, activo: true, estado: 'Activo', ...nuevaDisc, precio: Number(nuevaDisc.precio), cupos: Number(nuevaDisc.capacidad || nuevaDisc.cupos) || 20 }
      setDisciplinas(prev => [...prev, discNorm])
      return discNorm
    }
  }

  const updateDisciplina = async (id, datosActualizados) => {
    try {
      await tarifasApi.update(id, {
        nombre: datosActualizados.nombre,
        tipo: 'Clase/Disciplina',
        precio: Number(datosActualizados.precio),
        frecuencia: datosActualizados.frecuencia,
        cupos: Number(datosActualizados.capacidad || datosActualizados.cupos) || 20,
        activo: datosActualizados.estado ? datosActualizados.estado === 'Activo' : (datosActualizados.activo !== false)
      })
      await fetchTarifas()
    } catch (err) {
      console.warn('Error al actualizar disciplina en DB, usando fallback local:', err.message)
      setDisciplinas(prev => prev.map(d => d.id === id ? {
        ...d,
        ...datosActualizados,
        precio: Number(datosActualizados.precio) || d.precio,
        cupos: Number(datosActualizados.capacidad || datosActualizados.cupos) || d.cupos
      } : d))
    }
  }

  const deleteDisciplina = async (id) => {
    try {
      await tarifasApi.delete(id)
      await fetchTarifas()
    } catch (err) {
      console.warn('Delete local disciplina:', err.message)
      setDisciplinas(prev => prev.filter(d => d.id !== id))
    }
  }

  // Helper para buscar plan por nombre
  const getPlanByName = (nombrePlan) => {
    if (!nombrePlan) return null
    return planes.find(p => p.nombre.toLowerCase().trim() === nombrePlan.toLowerCase().trim()) || null
  }

  // Helper para calcular vencimiento dinámico según meses del plan
  const calcularVencimientoPorPlan = (fechaDesde, nombrePlan) => {
    const plan = getPlanByName(nombrePlan)
    const meses = plan ? Number(plan.meses) : 1
    const base = new Date(fechaDesde || new Date())
    base.setMonth(base.getMonth() + meses)
    return base.toISOString().split('T')[0]
  }

  const planesActivos = planes.filter(p => p.activo)
  const disciplinasActivas = disciplinas.filter(d => d.activo)

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
        loading
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
