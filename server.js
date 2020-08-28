const express = require("express");
const mongoose = require("mongoose");
const haikuRoute = require("./backend/routes/haikuRoute");
const scrambleRoute = require("./backend/routes/scrambleRoute");
const authRoute = require("./backend/routes/authRoute");
const userRoute = require("./backend/routes/userRoute");
const config = require('config');
const path = require('path');
const app = express();

app.use(express.json());

// DB connection...
const db = config.get("mongoURI");

mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log(`Connect to Mongo at ${db}`))
  .catch((err) => console.error("Could not connect to MongoDB: ", err));

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
