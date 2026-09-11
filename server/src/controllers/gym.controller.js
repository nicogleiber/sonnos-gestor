const catchAsync = require('../utils/catchAsync');
const Gym = require('../models/gym.model');
// const { ROLES } = require('../constants/roles');

const getGym = catchAsync(async (req, res) => {
  const gym = await Gym.findById(req.gymId);
  res.json({ success: true, data: { gym, role: req.role } });
});
const whoiam = catchAsync(async (req, res) => {
  res.json({ success: true, data: { user: req.user, gym: req.gym, role: req.role } });
});

module.exports = { getGym, whoiam };