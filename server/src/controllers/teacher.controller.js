const Teacher = require('../models/teacher.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getTeachers = catchAsync(async (req, res) => {
  const { activo, especialidad, q } = req.query;

  const filter = { gym: req.gymId };

  if (activo !== undefined) {
    filter.activo = activo === 'true';
  }

  if (especialidad) {
    filter.especialidad = especialidad;
  }

  if (q) {
    const regex = { $regex: q.trim(), $options: 'i' };
    filter.$or = [{ nombre: regex }, { apellido: regex }, { especialidad: regex }];
  }

  const teachers = await Teacher.find(filter).sort({ apellido: 1, nombre: 1 });

  res.json({
    success: true,
    data: teachers,
  });
});

const getTeacherById = catchAsync(async (req, res) => {
  const teacher = await Teacher.findOne({
    _id: req.params.id,
    gym: req.gymId,
  });

  if (!teacher) {
    throw ApiError.notFound('Profesor no encontrado');
  }

  res.json({
    success: true,
    data: teacher,
  });
});

const createTeacher = catchAsync(async (req, res) => {
  const teacherData = {
    ...req.body,
    gym: req.gymId,
  };

  const teacher = await Teacher.create(teacherData);

  res.status(201).json({
    success: true,
    data: teacher,
  });
});

const updateTeacher = catchAsync(async (req, res) => {
  const teacher = await Teacher.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!teacher) {
    throw ApiError.notFound('Profesor no encontrado');
  }

  res.json({
    success: true,
    data: teacher,
  });
});

const deleteTeacher = catchAsync(async (req, res) => {
  const teacher = await Teacher.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    { activo: false },
    { returnDocument: 'after' }
  );

  if (!teacher) {
    throw ApiError.notFound('Profesor no encontrado');
  }

  res.json({
    success: true,
    message: 'Profesor desactivado correctamente',
    data: teacher,
  });
});

const scheduleConsulta = catchAsync(async (req, res) => {
  const teacher = await Teacher.findOne({
    _id: req.params.id,
    gym: req.gymId,
  });

  if (!teacher) {
    throw ApiError.notFound('Profesor no encontrado');
  }

  teacher.consultasAcordadas.push(req.body);
  await teacher.save();

  res.status(201).json({
    success: true,
    message: 'Consulta agendada correctamente',
    data: teacher,
  });
});

const updateConsulta = catchAsync(async (req, res) => {
  const teacher = await Teacher.findOne({
    _id: req.params.id,
    gym: req.gymId,
  });

  if (!teacher) {
    throw ApiError.notFound('Profesor no encontrado');
  }

  const consulta = teacher.consultasAcordadas.id(req.params.consultaId);
  if (!consulta) {
    throw ApiError.notFound('Consulta no encontrada');
  }

  if (req.body.estado !== undefined) consulta.estado = req.body.estado;
  if (req.body.notas !== undefined) consulta.notas = req.body.notas;
  if (req.body.fecha !== undefined) consulta.fecha = req.body.fecha;
  if (req.body.hora !== undefined) consulta.hora = req.body.hora;

  await teacher.save();

  res.json({
    success: true,
    message: 'Consulta actualizada correctamente',
    data: teacher,
  });
});

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  scheduleConsulta,
  updateConsulta,
};
