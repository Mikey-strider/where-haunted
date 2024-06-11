// Here is where we import modules
const express = require("express");
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const morgan = require('morgan')
const app = express();
const mongoose = require("mongoose"); // require package

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const HauntModel = require('./models/haunts.js')
app.use(express.urlencoded({ extended: false }));


app.listen(3000, () => {
  console.log("Listening on port 3000");
});



//====================middleware============
app.use(morgan('dev'));




//====================routes================


app.get('/ghosts/new', (req, res) => {
  res.render('ghosts/new.ejs')
})

app.post("/ghosts", async (req, res) => {
  console.log(req.body);
  req.body.isHaunted = !!req.body.isHaunted;
  const Haunt = await HauntModel.create(req.body)
  console.log(Haunt)
  res.redirect("/ghosts");
});

app.get('/ghosts', async (req, res) => {
  const allHaunts = await HauntModel.find({})
  console.log(allHaunts)
  res.render('ghosts/index.ejs', {ghosts: allHaunts});
})


app.get("/", async (req, res) => {
  res.render("index.ejs");
});







app.get("/", async (req, res) => {
  res.send("hello, friend!");
});