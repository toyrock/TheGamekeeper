const express = require('express')

const User = require('../models/user.model')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('createUser')
})

router.post('/', async (req, res) => {
    await User.create({
        username: req.body.username,
        password: req.body.password,
    })  
    res.render('createUser')
})

module.exports = router