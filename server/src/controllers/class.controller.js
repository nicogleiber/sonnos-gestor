const Class = require('../models/class.model');
const Member = require('../models/member.model');
const Teacher = require('../models/teacher.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const getClasses = catchAsync(async (req, res) => {
  const { activo, salon, profesor, dia, q } = req.query;

  const filter = { gym: req.gymId };

  if (activo !== undefined) {
    filter.activo = activo === 'true';
  }

  if (salon) {
    filter.salon = salon;
  }

  if (profesor) {
    filter.profesor = { $regex: profesor.trim(), $options: 'i' };
  }

  if (dia) {
    filter.$or = [{ dias: dia }, { dia: dia }];
  }

  if (q) {
    const regex = { $regex: q.trim(), $options: 'i' };
    filter.$or = [{ nombre: regex }, { salon: regex }, { profesor: regex }];
  }

  const classes = await Class.find(filter)
    .populate('inscritos.socio', 'nombre apellido dni telefono estado')
    .populate('teacher', 'nombre apellido especialidad')
    .sort({ horario: 1, nombre: 1 });

  res.json({
    success: true,
    data: classes,
  });
});

const getClassById = catchAsync(async (req, res) => {
  const classDoc = await Class.findOne({
    _id: req.params.id,
    gym: req.gymId,
  })
    .populate('inscritos.socio', 'nombre apellido dni telefono estado')
    .populate('teacher', 'nombre apellido especialidad');

  if (!classDoc) {
    throw ApiError.notFound('Clase no encontrada');
  }

  res.json({
    success: true,
    data: classDoc,
  });
});

const createClass = catchAsync(async (req, res) => {
  const { teacherId, ...classData } = req.body;

  const newClassData = {
    ...classData,
    gym: req.gymId,
  };

  if (teacherId) {
    const teacher = await Teacher.findOne({ _id: teacherId, gym: req.gymId });
    if (teacher) {
      newClassData.teacher = teacher._id;
      if (!newClassData.profesor) {
        newClassData.profesor = `${teacher.nombre} ${teacher.apellido}`;
      }
    }
  }

  const classDoc = await Class.create(newClassData);

  res.status(201).json({
    success: true,
    data: classDoc,
  });
});

const updateClass = catchAsync(async (req, res) => {
  const { teacherId, ...updateData } = req.body;

  if (teacherId) {
    const teacher = await Teacher.findOne({ _id: teacherId, gym: req.gymId });
    if (teacher) {
      updateData.teacher = teacher._id;
      if (!updateData.profesor) {
        updateData.profesor = `${teacher.nombre} ${teacher.apellido}`;
      }
    }
  }

  const classDoc = await Class.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    updateData,
    { returnDocument: 'after', runValidators: true }
  ).populate('inscritos.socio', 'nombre apellido dni');

  if (!classDoc) {
    throw ApiError.notFound('Clase no encontrada');
  }

  res.json({
    success: true,
    data: classDoc,
  });
});

const deleteClass = catchAsync(async (req, res) => {
  const classDoc = await Class.findOneAndUpdate(
    { _id: req.params.id, gym: req.gymId },
    { activo: false },
    { returnDocument: 'after' }
  );

  if (!classDoc) {
    throw ApiError.notFound('Clase no encontrada');
  }

  res.json({
    success: true,
    message: 'Clase desactivada correctamente',
    data: classDoc,
  });
});

const inscribirSocio = catchAsync(async (req, res) => {
  const { socioId } = req.body;

  const [classDoc, member] = await Promise.all([
    Class.findOne({ _id: req.params.id, gym: req.gymId }),
    Member.findOne({ _id: socioId, gym: req.gymId }),
  ]);

  if (!classDoc) {
    throw ApiError.notFound('Clase no encontrada');
  }

  if (!member) {
    throw ApiError.notFound('Socio no encontrado');
  }

  // Verificar si ya está inscrito
  const yaInscripto = classDoc.inscritos.some(
    (ins) => ins.socio.toString() === member._id.toString()
  );
  if (yaInscripto) {
    throw ApiError.conflict('El socio ya se encuentra inscrito en esta clase');
  }

  // Control estricto de cupo disponible
  if (classDoc.inscritos.length >= classDoc.cupoMaximo) {
    throw ApiError.badRequest(
      `Cupo agotado (${classDoc.inscritos.length}/${classDoc.cupoMaximo}). No hay lugares disponibles.`
    );
  }

  classDoc.inscritos.push({
    socio: member._id,
    nombre: `${member.nombre} ${member.apellido}`,
    inscriptoEl: new Date(),
  });

  await classDoc.save();

  res.json({
    success: true,
    message: 'Socio inscrito correctamente',
    data: classDoc,
  });
});

const desinscribirSocio = catchAsync(async (req, res) => {
  const { socioId } = req.body;

  const classDoc = await Class.findOne({ _id: req.params.id, gym: req.gymId });

  if (!classDoc) {
    throw ApiError.notFound('Clase no encontrada');
  }

  const longitudPrevia = classDoc.inscritos.length;
  classDoc.inscritos = classDoc.inscritos.filter(
    (ins) => ins.socio.toString() !== socioId.toString()
  );

  if (classDoc.inscritos.length === longitudPrevia) {
    throw ApiError.notFound('El socio no estaba inscrito en esta clase');
  }

  await classDoc.save();

  res.json({
    success: true,
    message: 'Socio desinscrito correctamente',
    data: classDoc,
  });
});

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  inscribirSocio,
  desinscribirSocio,
};
