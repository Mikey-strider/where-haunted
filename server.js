// Here is where we import modules
const express = require("express");
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const morgan = require('morgan')
const app = express();
const methodOverride = require('method-override');
const mongoose = require("mongoose"); // require package
const session = require('express-session');



const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const hauntedController = require('./controllers/haunted.js')

const port = process.env.PORT ? process.env.PORT : '3000';

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// const HauntModel = require('./models/haunt.js')






//====================middleware============
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);





//====================routes================



app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});



app.use('/auth', authController);
app.use('/ghosts', isSignedIn, hauntedController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});