const express = require("express");
const { Readable } = require("stream");
const multer = require("multer");
const fs = require('fs');
const Game = require("../models/game.model");
const Review = require("../models/review.model");
const { isLoggedIn } = require("../middlewares/guard");

const router = express.Router();

router.get("/create", isLoggedIn, (req, res) => {
  res.render("game/create");
});

router.post("/search/:keyword", isLoggedIn, async (req, res) => {
  const games = await Game.find({ title: req.params.keyword });
  res.send({
    status: true,
    data: games,
  });
});

router.post("/create", isLoggedIn, async (req, res, next) => {
 
  //console.log("iD", req.session.currentUser);

  await Game.create({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    author: req.session.currentUser._id,
  });
  const games = await Game.find();
  res.redirect("/game");
  
});

// shows all posts
router.get("/", async (req, res) => {
  const games = await Game.find();
  res.render("game/viewAll", { games });
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const game = await Game.findById(req.params.id);
  const reviews = await Review.find({ game: req.params.id })
    .populate("author");
  res.render("game/viewOne", { game, reviews, isLoggedIn: req.isLogged });
});

module.exports = router;
