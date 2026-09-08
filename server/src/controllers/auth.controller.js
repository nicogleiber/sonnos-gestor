const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

const register = catchAsync(async (req, res) => {
    const { gymName, firstName, lastName, email, password } = req.body;
    const { token, user, gym } = await authService.registerGymOwner({
        gymName,
        firstName,
        lastName,
        email,
        password,
    });

    res.status(201).json({
        success: true,
        data: { token, user, gym: { id: gym._id, name: gym.name } },
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.json({ success: true, data: result });
});

const me = catchAsync(async (req, res) => {
    res.json({ success: true, data: { user: req.user } });
});

module.exports = { register, login, me };