import { createContext, useContext, useState } from 'react'

export const initialEventos = [
  { id: '1-Lunes', clase: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '07:00', duracion: 60, dia: 'Lunes', cupos: 20, inscriptos: 18, tipoEvento: 'Semanal' },
  { id: '1-Miercoles', clase: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '07:00', duracion: 60, dia: 'Miércoles', cupos: 20, inscriptos: 18, tipoEvento: 'Semanal' },
  { id: '1-Viernes', clase: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '07:00', duracion: 60, dia: 'Viernes', cupos: 20, inscriptos: 18, tipoEvento: 'Semanal' },
  { id: '2-Lunes', clase: 'Yoga Matutino', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '09:00', duracion: 75, dia: 'Lunes', cupos: 15, inscriptos: 12, tipoEvento: 'Semanal' },
  { id: '2-Jueves', clase: 'Yoga Matutino', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '09:00', duracion: 75, dia: 'Jueves', cupos: 15, inscriptos: 12, tipoEvento: 'Semanal' },
  { id: '3-Martes', clase: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '08:00', duracion: 45, dia: 'Martes', cupos: 20, inscriptos: 20, tipoEvento: 'Semanal' },
  { id: '3-Jueves', clase: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '08:00', duracion: 45, dia: 'Jueves', cupos: 20, inscriptos: 20, tipoEvento: 'Semanal' },
  { id: '3-Sabado', clase: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '08:00', duracion: 45, dia: 'Sábado', cupos: 20, inscriptos: 20, tipoEvento: 'Semanal' },
  { id: '4-Martes', clase: 'Zumba', salon: 'Sala Multiusos', profesor: 'Daniela Herrera', horario: '18:00', duracion: 60, dia: 'Martes', cupos: 25, inscriptos: 22, tipoEvento: 'Semanal' },
  { id: '4-Viernes', clase: 'Zumba', salon: 'Sala Multiusos', profesor: 'Daniela Herrera', horario: '18:00', duracion: 60, dia: 'Viernes', cupos: 25, inscriptos: 22, tipoEvento: 'Semanal' },
  { id: '5-Miercoles', clase: 'Pilates Avanzado', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '10:00', duracion: 60, dia: 'Miércoles', cupos: 15, inscriptos: 10, tipoEvento: 'Semanal' },
  { id: '5-Sabado', clase: 'Pilates Avanzado', salon: 'Sala de Yoga', profesor: 'Ana Castillo', horario: '10:00', duracion: 60, dia: 'Sábado', cupos: 15, inscriptos: 10, tipoEvento: 'Semanal' },
  { id: '6-Lunes', clase: 'Musculación Libre', salon: 'Salón Principal', profesor: 'Carlos Vega', horario: '06:00', duracion: 120, dia: 'Lunes', cupos: 30, inscriptos: 25, tipoEvento: 'Semanal' },
  { id: '7-Lunes', clase: 'Spinning Nocturno', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '20:00', duracion: 60, dia: 'Lunes', cupos: 20, inscriptos: 15, tipoEvento: 'Semanal' },
  { id: '7-Miercoles', clase: 'Spinning Nocturno', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', horario: '20:00', duracion: 60, dia: 'Miércoles', cupos: 20, inscriptos: 15, tipoEvento: 'Semanal' },
  { id: '8-Martes', clase: 'Cross Training', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '19:00', duracion: 60, dia: 'Martes', cupos: 20, inscriptos: 17, tipoEvento: 'Semanal' },
  { id: '8-Jueves', clase: 'Cross Training', salon: 'Zona Funcional', profesor: 'Roberto Peralta', horario: '19:00', duracion: 60, dia: 'Jueves', cupos: 20, inscriptos: 17, tipoEvento: 'Semanal' },
  { id: '9-Workshop', clase: 'Seminario de Levantamiento Olímpico', salon: 'Salón Principal', profesor: 'Carlos Vega', horario: '10:00', duracion: 90, dia: 'Sábado', cupos: 15, inscriptos: 14, tipoEvento: 'Evento Único', fechaEspecifica: '2026-08-29' },
]

const CalendarioContext = createContext()

export function CalendarioProvider({ children }) {
  const [eventos, setEventos] = useState(initialEventos)

  const addEvento = (nuevoEvento) => {
    const id = Date.now().toString()
    const eventoCompleto = {
      id,
      cupos: Number(nuevoEvento.cupos) || 20,
      inscriptos: Number(nuevoEvento.inscriptos) || 0,
      duracion: Number(nuevoEvento.duracion) || 60,
      tipoEvento: nuevoEvento.tipoEvento || 'Semanal',
      ...nuevoEvento,
    }
    setEventos(prev => [eventoCompleto, ...prev])
    return eventoCompleto
  }

  const updateEvento = (id, datosActualizados) => {
    setEventos(prev => prev.map(e => e.id === id ? {
      ...e,
      ...datosActualizados,
      cupos: Number(datosActualizados.cupos) || e.cupos,
      inscriptos: Number(datosActualizados.inscriptos) || e.inscriptos,
      duracion: Number(datosActualizados.duracion) || e.duracion,
    } : e))
  }

  const deleteEvento = (id) => {
    setEventos(prev => prev.filter(e => e.id !== id))
  }

  // Clases agrupadas para un profesor dado
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
        getClasesPorProfesor,
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
