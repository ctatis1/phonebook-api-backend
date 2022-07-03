const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('contacts')
    response.json(users);
})

userRouter.post('/', async (request, response) => {
    const body = request.body

    const salRounds = 10
    const passwordHash = await bcrypt.hash(body.password, salRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser);
})

module.exports = userRouter

