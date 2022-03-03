const express = require("express");
const Game = require("../models/game.model");
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

router.post("/create", isLoggedIn, async (req, res) => {
  console.log("CREATE GAME", req.body.image);
  if (!req.files) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
  } else {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let uploadedImage = req.files.image;

    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    uploadedImage.mv("./public/uploads/" + uploadedImage.name);
    console.log(uploadedImage.mimetype);
    console.log(uploadedImage.name);

    console.log("iD", req.session.currentUser);
    await Game.create({
      title: req.body.title,
      description: req.body.description,
      image: uploadedImage.name,
      author: req.session.currentUser._id,
    });
    const games = await Game.find();
    res.redirect("/game");
    //res.render("game/viewAll", { games });
  }
});

// shows all posts
router.get("/", async (req, res) => {
  const games = await Game.find();
  console.log("GAMES", games);
  res.render("game/viewAll", { games });
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const game = await Game.findById(req.params.id);
  //.populate("reviews")
  //.populate("author")
  //.populate({
  //  path: "reviews",
  //  populate: "author",
  //});
  console.log(game);
  res.render("game/viewOne", { game, isLoggedIn: req.isLogged });
});

module.exports = router;
