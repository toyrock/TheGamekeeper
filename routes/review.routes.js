const express = require("express");
const Review = require("../models/review.model");
const Game = require("../models/game.model");

const router = express.Router();

router.post("/create/:id", async (req, res) => {
  // todo
  // 1- we need to fetch the post
  const game = await Game.findById(req.params.id);
  // 2- we need to get the user
  const user = req.session.currentUser;
  // 3- we need to create the comment
  const review = new Review();
  review.content = req.body.content;
  review.author = user._id;
  await review.save();
  // 4- append the comment to the post
  game.reviews.push(review.id);
  await game.save()
  // 5- redirect to the same page
  res.redirect(`/game/${game.id}`);
});

module.exports = router;