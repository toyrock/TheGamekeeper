const express = require('express')

const User = require('../models/user.model')
const router = express.Router()

router.get('/signin', async (req, res) => {
    res.render('signin')
})

router.post('/signin', async (req, res) => {
    /* await User.create({
        email:req.body.email,
        username: req.body.username,
        password: req.body.password,
    })  
}) */
const user = new User()
  const hash = await bcrypt.hash(req.body.password, 6)
  user.email = req.body.email
  user.password = hash
  try {
    await user.save()
    res.redirect('/')
  } catch (error) {
    res.redirect('/users/signin')
  }
})

// for m for logging in the user
router.get('/login', (req, res) => {
    res.render('login', { message: '' })
  })

// handling the authentication of the user
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const isPwCorrect = await bcrypt.compare(req.body.password, user.password)
      if (isPwCorrect) {
        req.session.currentUser = user
        res.redirect('/users/profile')
      } else {
        res.redirect('/users/login')
      }
    } else {
      res.redirect('/users/login')
    }
  })

// route for the user profile
router.get('/profile', (req, res) => {
    const user = req.session.currentUser
    res.render('profile', { user })
  })
  
  // route for handling the logout
  router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/users/login')
  })



module.exports = router