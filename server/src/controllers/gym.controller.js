const catchAsync = require('../utils/catchAsync');
const Gym = require('../models/gym.model');

const getGym = catchAsync(async (req, res) => {
  const gym = await Gym.findById(req.gymId);
  res.json({ success: true, data: { gym, role: req.role } });
});

module.exports = { getGym };