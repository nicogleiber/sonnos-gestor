import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { clasesApi } from '../api/clasesApi'

export const initialEventos = [
  { id: '1-Lunes', clase: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '07:00', duracion: 60, dia: 'Lunes', cupos: 20, inscriptos: 18, tipoEvento: 'Semanal Recurrente' },
  { id: '1-Miercoles', clase: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '07:00', duracion: 60, dia: 'Miércoles', cupos: 20, inscriptos: 18, tipoEvento: 'Semanal Recurrente' },
  { id: '1-Viernes', clase: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '07:00', duracion: 60, dia: 'Viernes', cupos: 20, inscriptos: 18, tipoEvento: 'Semanal Recurrente' },
  { id: '2-Lunes', clase: 'Yoga Matutino', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '09:00', duracion: 75, dia: 'Lunes', cupos: 15, inscriptos: 12, tipoEvento: 'Semanal Recurrente' },
  { id: '2-Jueves', clase: 'Yoga Matutino', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '09:00', duracion: 75, dia: 'Jueves', cupos: 15, inscriptos: 12, tipoEvento: 'Semanal Recurrente' },
  { id: '3-Martes', clase: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '08:00', duracion: 45, dia: 'Martes', cupos: 20, inscriptos: 20, tipoEvento: 'Semanal Recurrente' },
  { id: '3-Jueves', clase: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '08:00', duracion: 45, dia: 'Jueves', cupos: 20, inscriptos: 20, tipoEvento: 'Semanal Recurrente' },
  { id: '3-Sabado', clase: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '08:00', duracion: 45, dia: 'Sábado', cupos: 20, inscriptos: 20, tipoEvento: 'Semanal Recurrente' },
  { id: '4-Martes', clase: 'Zumba', salon: 'Sala Multiusos', profesor: 'Florencia Aguirre', horario: '18:00', duracion: 60, dia: 'Martes', cupos: 25, inscriptos: 22, tipoEvento: 'Semanal Recurrente' },
  { id: '4-Viernes', clase: 'Zumba', salon: 'Sala Multiusos', profesor: 'Florencia Aguirre', horario: '18:00', duracion: 60, dia: 'Viernes', cupos: 25, inscriptos: 22, tipoEvento: 'Semanal Recurrente' },
  { id: '5-Miercoles', clase: 'Pilates Avanzado', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '10:00', duracion: 60, dia: 'Miércoles', cupos: 15, inscriptos: 10, tipoEvento: 'Semanal Recurrente' },
  { id: '5-Sabado', clase: 'Pilates Avanzado', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '10:00', duracion: 60, dia: 'Sábado', cupos: 15, inscriptos: 10, tipoEvento: 'Semanal Recurrente' },
  { id: '6-Lunes', clase: 'Musculación Libre', salon: 'Salón Principal', profesor: 'Carlos Vega', horario: '06:00', duracion: 120, dia: 'Lunes', cupos: 30, inscriptos: 25, tipoEvento: 'Semanal Recurrente' },
  { id: '7-Lunes', clase: 'Spinning Nocturno', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '20:00', duracion: 60, dia: 'Lunes', cupos: 20, inscriptos: 15, tipoEvento: 'Semanal Recurrente' },
  { id: '7-Miercoles', clase: 'Spinning Nocturno', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '20:00', duracion: 60, dia: 'Miércoles', cupos: 20, inscriptos: 15, tipoEvento: 'Semanal Recurrente' },
  { id: '8-Martes', clase: 'Cross Training', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '19:00', duracion: 60, dia: 'Martes', cupos: 20, inscriptos: 17, tipoEvento: 'Semanal Recurrente' },
  { id: '8-Jueves', clase: 'Cross Training', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '19:00', duracion: 60, dia: 'Jueves', cupos: 20, inscriptos: 17, tipoEvento: 'Semanal Recurrente' },
  { id: '9-Workshop', clase: 'Seminario de Levantamiento Olímpico', salon: 'Salón Principal', profesor: 'Carlos Vega', horario: '10:00', duracion: 90, dia: 'Sábado', cupos: 15, inscriptos: 14, tipoEvento: 'Evento Único', fechaEspecifica: '2026-09-06' },
]

const CalendarioContext = createContext()

export function CalendarioProvider({ children }) {
  const [eventos, setEventos] = useState(initialEventos)
  const [loading, setLoading] = useState(false)

  const fetchClases = useCallback(async () => {
    setLoading(true)
    try {
      const data = await clasesApi.getAll()
      if (data && data.length > 0) {
        const adaptadas = data.map(c => ({
          id: c._id || c.id,
          clase: c.nombre || c.clase,
          salon: c.salon,
          profesor: c.profesor,
          horario: c.horario,
          dia: c.dia,
          duracion: c.duracion || 60,
          cupos: c.cupoMaximo || c.cupos || 20,
          inscriptos: c.inscritos ? c.inscritos.length : (c.inscriptos || 0),
          tipoEvento: c.tipoEvento || 'Semanal Recurrente',
          fechaEspecifica: c.fechaEspecifica || '',
          inscritos: c.inscritos || []
        }))
        setEventos(adaptadas)
      }
    } catch (err) {
      console.warn('Usando clases locales:', err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClases()
  }, [fetchClases])

  const addEvento = async (nuevoEvento) => {
    try {
      const creado = await clasesApi.create({
        nombre: nuevoEvento.clase,
        salon: nuevoEvento.salon,
        horario: nuevoEvento.horario,
        dia: nuevoEvento.dia,
        profesor: nuevoEvento.profesor,
        duracion: Number(nuevoEvento.duracion) || 60,
        cupoMaximo: Number(nuevoEvento.cupos) || 20,
        tipoEvento: nuevoEvento.tipoEvento || 'Semanal Recurrente',
        fechaEspecifica: nuevoEvento.fechaEspecifica || ''
      })
      const norm = {
        id: creado._id || creado.id,
        clase: creado.nombre,
        salon: creado.salon,
        profesor: creado.profesor,
        horario: creado.horario,
        dia: creado.dia,
        duracion: creado.duracion,
        cupos: creado.cupoMaximo,
        inscriptos: creado.inscritos ? creado.inscritos.length : 0,
        tipoEvento: creado.tipoEvento,
        fechaEspecifica: creado.fechaEspecifica || '',
        inscritos: creado.inscritos || []
      }
      setEventos(prev => [norm, ...prev])
      return norm
    } catch (err) {
      const id = Date.now().toString()
      const eventoCompleto = {
        id,
        cupos: Number(nuevoEvento.cupos) || 20,
        inscriptos: Number(nuevoEvento.inscriptos) || 0,
        duracion: Number(nuevoEvento.duracion) || 60,
        tipoEvento: nuevoEvento.tipoEvento || 'Semanal Recurrente',
        ...nuevoEvento,
      }
      setEventos(prev => [eventoCompleto, ...prev])
      return eventoCompleto
    }
  }

  const updateEvento = async (id, datosActualizados) => {
    try {
      await clasesApi.update(id, {
        nombre: datosActualizados.clase,
        salon: datosActualizados.salon,
        horario: datosActualizados.horario,
        dia: datosActualizados.dia,
        profesor: datosActualizados.profesor,
        duracion: Number(datosActualizados.duracion),
        cupoMaximo: Number(datosActualizados.cupos),
        tipoEvento: datosActualizados.tipoEvento,
        fechaEspecifica: datosActualizados.fechaEspecifica
      })
    } catch (err) {
      console.warn('Update local evento:', err.message)
    }
    setEventos(prev => prev.map(e => e.id === id ? {
      ...e,
      ...datosActualizados,
      cupos: Number(datosActualizados.cupos) || e.cupos,
      inscriptos: Number(datosActualizados.inscriptos) !== undefined ? Number(datosActualizados.inscriptos) : e.inscriptos,
      duracion: Number(datosActualizados.duracion) || e.duracion,
    } : e))
  }

  const deleteEvento = async (id) => {
    try {
      await clasesApi.delete(id)
    } catch (err) {
      console.warn('Delete local evento:', err.message)
    }
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  // Inscribir socio con control estricto de cupo
  const inscribirSocioAClase = async (claseId, socio) => {
    const clase = eventos.find(e => e.id === claseId)
    if (!clase) throw new Error('Clase no encontrada')

    if (clase.inscriptos >= clase.cupos) {
      throw new Error(`Cupo agotado (${clase.inscriptos}/${clase.cupos}). No hay lugares disponibles.`)
    }

    try {
      if (socio._id || (typeof socio.id === 'string' && socio.id.length === 24)) {
        await clasesApi.inscribirSocio(claseId, socio._id || socio.id)
      }
    } catch (err) {
      console.warn('Inscripción online error/fallback:', err.message)
    }

    setEventos(prev => prev.map(e => {
      if (e.id === claseId) {
        return {
          ...e,
          inscriptos: e.inscriptos + 1,
          inscritos: [...(e.inscritos || []), { socioId: socio.id, nombre: `${socio.nombre} ${socio.apellido}` }]
        }
      }
      return e
    }))
  }

  const getClasesPorProfesor = (nombreProfesor) => {
    if (!nombreProfesor) return []
    const nombreNorm = nombreProfesor.toLowerCase().trim()
    return eventos.filter(e => e.profesor.toLowerCase().trim().includes(nombreNorm))
  }

  return (
    <CalendarioContext.Provider
      value={{
        eventos,
        addEvento,
        updateEvento,
        deleteEvento,
        inscribirSocioAClase,
        getClasesPorProfesor,
        fetchClases,
        loading
      }}
    >
      {children}
    </CalendarioContext.Provider>
  )
}

export function useCalendario() {
  const context = useContext(CalendarioContext)
  if (!context) {
    throw new Error('useCalendario debe usarse dentro de un CalendarioProvider')
  }
  return context
}
