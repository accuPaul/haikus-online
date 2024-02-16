const express = require("express");
const mongoose = require("mongoose");
const haikuRoute = require("./routes/haikuRoute");
const scrambleRoute = require("./routes/scrambleRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const dotenv = require('dotenv').config({path: '../.env'});
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
// DB connection...

const PORT = process.env.PORT || 5000;

app.use("/haikus", haikuRoute);
app.use("/scramble", scrambleRoute);
app.use("/users", userRoute);
app.use('/auth', authRoute);

// Serve static assets in production

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })

}


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
