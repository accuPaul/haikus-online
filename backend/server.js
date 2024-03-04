const express = require("express");
const mongoose = require("mongoose");
const haikuRoute = require("./routes/haikuRoute");
const scrambleRoute = require("./routes/scrambleRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const dotenv = require('dotenv'); //.config({path: '../.env'});
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
// DB connection...

const PORT = process.env.NODE_DOCKER_PORT || 5000;

app.use("/haikus", haikuRoute);
app.use("/scramble", scrambleRoute);
app.use("/users", userRoute);
app.use('/auth', authRoute);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
