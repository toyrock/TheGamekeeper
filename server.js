const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const store = require("connect-mongo");
const dotenv = require("dotenv");
mongoose.connect("mongodb://localhost/thegamekeeper");
const app = express();

//mongoose.connect(process.env.MONGODB_URL);

// environment variables
dotenv.config();
// template engine setup
app.set("view engine", "ejs");
// ejs layout setup
app.use(expressLayouts);
// file uploads
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  }));
// middleware to extract the body from the request
app.use(express.urlencoded({ extended: false }));
// hooking up the public folder
app.use(express.static("public"));
// middleware for setting up the session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: "mongodb://localhost/thegamekeeper",
    }),
  })
);

// middle ware for making the user available to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.currentUser;
    next();
});
  
// root route
app.get('/', (req, res) => {
  res.render('index');
});

// user routes
const userRouter = require("./routes/user.routes");
  app.use("/user", userRouter);
  
//hook the game routes
const gameRouter = require('./routes/game.routes')
app.use('/game', gameRouter)

//hook the review routes
const reviewRouter = require("./routes/review.routes");
app.use("/review", reviewRouter);

app.listen(process.env.PORT);