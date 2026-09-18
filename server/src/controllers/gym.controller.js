const catchAsync = require('../utils/catchAsync');
const Gym = require('../models/gym.model');

// GET perfil completo del gimnasio
const getGym = catchAsync(async (req, res) => {
  const gym = await Gym.findById(req.gymId);
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });
  res.json({ success: true, data: { gym, role: req.role } });
});

// PUT actualizar perfil del gimnasio (nombre, horarios, dirección, datos de cobro, etc.)
const updateGym = catchAsync(async (req, res) => {
  const allowed = [
    'name', 'telefono', 'direccion', 'email', 'sitioWeb',
    'cuit', 'aliasMercadoPago', 'cvuTransferencia',
    'horarioApertura', 'horarioCierre', 'diasApertura', 'capacidadMaxima'
  ];
  const updateData = {};
  allowed.forEach(field => {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  });

  const gym = await Gym.findByIdAndUpdate(
    req.gymId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });
  res.json({ success: true, data: gym });
});

// GET listar sedes del gimnasio
const getSedes = catchAsync(async (req, res) => {
  const gym = await Gym.findById(req.gymId).select('sedes name');
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });
  res.json({ success: true, data: gym.sedes });
});

// GET detalle de una sede por ID
const getSedeById = catchAsync(async (req, res) => {
  const sedeId = req.params.sedeId || req.params.id;
  const gym = await Gym.findById(req.gymId).select('sedes');
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });
  const sede = gym.sedes.id(sedeId);
  if (!sede) return res.status(404).json({ success: false, message: 'Sede no encontrada' });
  res.json({ success: true, data: sede });
});

// POST agregar una sede
const addSede = catchAsync(async (req, res) => {
  const { nombre, direccion, telefono, principal } = req.body;
  if (!nombre) return res.status(400).json({ success: false, message: 'El nombre de la sede es obligatorio' });

  const gym = await Gym.findById(req.gymId);
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });

  // Si marca como principal, desmarca las demás
  if (principal) {
    gym.sedes.forEach(s => { s.principal = false; });
  }
  gym.sedes.push({ nombre, direccion: direccion || '', telefono: telefono || '', principal: !!principal });
  await gym.save();
  res.status(201).json({ success: true, data: gym.sedes });
});

// PUT actualizar una sede
const updateSede = catchAsync(async (req, res) => {
  const sedeId = req.params.sedeId || req.params.id;
  const { nombre, direccion, telefono, principal } = req.body;

  const gym = await Gym.findById(req.gymId);
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });

  const sede = gym.sedes.id(sedeId);
  if (!sede) return res.status(404).json({ success: false, message: 'Sede no encontrada' });

  if (principal) {
    gym.sedes.forEach(s => { s.principal = false; });
  }
  if (nombre !== undefined) sede.nombre = nombre;
  if (direccion !== undefined) sede.direccion = direccion;
  if (telefono !== undefined) sede.telefono = telefono;
  if (principal !== undefined) sede.principal = principal;

  await gym.save();
  res.json({ success: true, data: gym.sedes });
});

// DELETE eliminar una sede
const deleteSede = catchAsync(async (req, res) => {
  const sedeId = req.params.sedeId || req.params.id;
  const gym = await Gym.findById(req.gymId);
  if (!gym) return res.status(404).json({ success: false, message: 'Gimnasio no encontrado' });

  gym.sedes = gym.sedes.filter(s => s._id.toString() !== sedeId);
  await gym.save();
  res.json({ success: true, data: gym.sedes });
});

const whoiam = catchAsync(async (req, res) => {
  res.json({ success: true, data: { user: req.user, gym: req.gym, role: req.role } });
});

module.exports = { getGym, updateGym, getSedes, getSedeById, addSede, updateSede, deleteSede, whoiam };