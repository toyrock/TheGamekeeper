const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const Game = require("../models/game.model");
const { isLoggedIn } = require("../middlewares/guard");

const router = express.Router()

router.get("/signup", (req, res) => {
    res.render("user/signup")
})

router.post("/signup", async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  try {
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    res.redirect("/game");
  } catch (error) {
    res.redirect("/user/signup");
  }
})

// for m for logging in the user
router.get("/login", (req, res) => {
    res.render("user/login");
  });

// handles the authentication of a user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isPwCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isPwCorrect) {
      req.session.currentUser = user;
      res.redirect("/game");
    } else {
      res.redirect("/user/login");
    }
  } catch (error) {
    res.redirect("/user/login");
  }
});

// route for the user profile
router.get("/profile", isLoggedIn, async(req, res) => {
  console.log(req.isLogged);
  if (req.isLogged === true) {
    const games = await Game.find({ author: req.session.currentUser._id });
    res.render("user/profile", { games });
  } else {
    res.redirect("/user/login");
  }
});
  
// route for handling the logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;