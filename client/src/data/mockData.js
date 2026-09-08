// ============================================
// DATOS DE PRUEBA - GENERADOR DE FECHAS RELATIVAS
// ============================================
function getOffsetDate(daysOffset) {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// ========================
// DATOS DE PRUEBA - SOCIOS
// ========================
export const socios = [
  { id: 1, nombre: 'Valentina', apellido: 'García', telefono: '011-4532-8901', email: 'vgarcia@email.com', suscripcion: 'Mensual', fechaVto: getOffsetDate(22) },
  { id: 2, nombre: 'Matías', apellido: 'Rodríguez', telefono: '011-4567-2345', email: 'mrodriguez@email.com', suscripcion: 'Trimestral', fechaVto: getOffsetDate(5) }, // En Fecha de Cobro (5 días)
  { id: 3, nombre: 'Luciana', apellido: 'Martínez', telefono: '011-4598-1122', email: 'lmartinez@email.com', suscripcion: 'Anual', fechaVto: getOffsetDate(150) },
  { id: 4, nombre: 'Diego', apellido: 'López', telefono: '011-4511-9988', email: 'dlopez@email.com', suscripcion: 'Mensual', fechaVto: getOffsetDate(-14) }, // Vencido hace 14 días
  { id: 5, nombre: 'Camila', apellido: 'Fernández', telefono: '011-4523-4455', email: 'cfernandez@email.com', suscripcion: 'Semestral', fechaVto: getOffsetDate(3) }, // En Fecha de Cobro (3 días)
  { id: 6, nombre: 'Nicolás', apellido: 'Sánchez', telefono: '011-4544-7766', email: 'nsanchez@email.com', suscripcion: 'Mensual', fechaVto: getOffsetDate(15) },
  { id: 7, nombre: 'Sofía', apellido: 'Torres', telefono: '011-4555-3311', email: 'storres@email.com', suscripcion: 'Trimestral', fechaVto: getOffsetDate(-3) }, // Vencido hace 3 días
  { id: 8, nombre: 'Joaquín', apellido: 'Romero', telefono: '011-4566-8822', email: 'jromero@email.com', suscripcion: 'Anual', fechaVto: getOffsetDate(210) },
  { id: 9, nombre: 'Martina', apellido: 'Díaz', telefono: '011-4577-5544', email: 'mdiaz@email.com', suscripcion: 'Mensual', fechaVto: getOffsetDate(1) }, // En Fecha de Cobro (mañana)
  { id: 10, nombre: 'Sebastián', apellido: 'Moreno', telefono: '011-4588-6633', email: 'smoreno@email.com', suscripcion: 'Semestral', fechaVto: getOffsetDate(85) },
]

// ========================
// DATOS DE PRUEBA - PERSONAL
// ========================
export const personal = [
  { id: 1, nombre: 'Carlos', apellido: 'Vega', rol: 'Entrenador Personal', especialidad: 'Fuerza y Musculación', email: 'cvega@sonnos.com', telefono: '011-4500-1111', clases: 12, activo: true },
  { id: 2, nombre: 'Florencia', apellido: 'Aguirre', rol: 'Profesora', especialidad: 'Spinning & Cardio', email: 'faguirre@sonnos.com', telefono: '011-4500-2222', clases: 16, activo: true },
  { id: 3, nombre: 'Roberto', apellido: 'Peralta', rol: 'Entrenador Personal', especialidad: 'Funcional y Cross', email: 'rperalta@sonnos.com', telefono: '011-4500-3333', clases: 10, activo: true },
  { id: 4, nombre: 'Ana', apellido: 'Castillo', rol: 'Profesora', especialidad: 'Yoga & Pilates', email: 'acastillo@sonnos.com', telefono: '011-4500-4444', clases: 14, activo: true },
  { id: 5, nombre: 'Pablo', apellido: 'Ríos', rol: 'Nutricionista', especialidad: 'Nutrición Deportiva', email: 'prios@sonnos.com', telefono: '011-4500-5555', clases: 0, activo: true },
  { id: 6, nombre: 'Daniela', apellido: 'Herrera', rol: 'Profesora', especialidad: 'Zumba & Aeróbica', email: 'dherrera@sonnos.com', telefono: '011-4500-6666', clases: 18, activo: false },
]

// ========================
// DATOS DE PRUEBA - SALONES
// ========================
export const salones = [
  { id: 1, nombre: 'Salón Principal', capacidad: 30, equipamiento: 'Máquinas cardiovasculares, pesas libres, bancos' },
  { id: 2, nombre: 'Sala de Spinning', capacidad: 20, equipamiento: 'Bicicletas estáticas premium, sistema de audio' },
  { id: 3, nombre: 'Sala Multiusos', capacidad: 25, equipamiento: 'Colchonetas, pelotas, bandas elásticas, espejo panorámico' },
  { id: 4, nombre: 'Sala de Yoga', capacidad: 15, equipamiento: 'Colchonetas, blocks, cinturones, ambiente zen' },
  { id: 5, nombre: 'Zona Funcional', capacidad: 20, equipamiento: 'TRX, kettlebells, cajas pliométricas, cuerdas' },
]

// ========================
// DATOS DE PRUEBA - CLASES
// ========================
export const clases = [
  { id: 1, nombre: 'Spinning Intenso', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', dias: ['Lunes', 'Miércoles', 'Viernes'], horario: '07:00', duracion: 60, cupos: 20, inscriptos: 18 },
  { id: 2, nombre: 'Yoga Matutino', salon: 'Sala de Yoga', profesor: 'Ana Castillo', dias: ['Lunes', 'Jueves'], horario: '09:00', duracion: 75, cupos: 15, inscriptos: 12 },
  { id: 3, nombre: 'Funcional Express', salon: 'Zona Funcional', profesor: 'Roberto Peralta', dias: ['Martes', 'Jueves', 'Sábado'], horario: '08:00', duracion: 45, cupos: 20, inscriptos: 20 },
  { id: 4, nombre: 'Zumba', salon: 'Sala Multiusos', profesor: 'Daniela Herrera', dias: ['Martes', 'Viernes'], horario: '18:00', duracion: 60, cupos: 25, inscriptos: 22 },
  { id: 5, nombre: 'Pilates Avanzado', salon: 'Sala de Yoga', profesor: 'Ana Castillo', dias: ['Miércoles', 'Sábado'], horario: '10:00', duracion: 60, cupos: 15, inscriptos: 10 },
  { id: 6, nombre: 'Musculación Libre', salon: 'Salón Principal', profesor: 'Carlos Vega', dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], horario: '06:00', duracion: 120, cupos: 30, inscriptos: 25 },
  { id: 7, nombre: 'Spinning Nocturno', salon: 'Sala de Spinning', profesor: 'Florencia Aguirre', dias: ['Lunes', 'Miércoles'], horario: '20:00', duracion: 60, cupos: 20, inscriptos: 15 },
  { id: 8, nombre: 'Cross Training', salon: 'Zona Funcional', profesor: 'Roberto Peralta', dias: ['Martes', 'Jueves'], horario: '19:00', duracion: 60, cupos: 20, inscriptos: 17 },
]

// ========================
// DATOS DE PRUEBA - CALENDARIO (semana actual)
// ========================
export const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const eventosCalendario = clases.flatMap(clase =>
  clase.dias.map(dia => ({
    id: `${clase.id}-${dia}`,
    clase: clase.nombre,
    salon: clase.salon,
    profesor: clase.profesor,
    horario: clase.horario,
    duracion: clase.duracion,
    dia,
    cupos: clase.cupos,
    inscriptos: clase.inscriptos,
  }))
)
