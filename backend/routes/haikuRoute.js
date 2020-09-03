const express = require("express");
const moment = require("moment");
const { Haiku, validate } = require("../models/haikuModel");
const auth = require('../routes/middleware/auth');
const makeScramble = require('../routes/middleware/makeScramble');

const router = express.Router();

router.get("/today", makeScramble, async (req, res) => {
  const dow = "Haiku " + moment().dayOfYear() + "/366";
  const today = moment().startOf('day');
  const haiku = await Haiku.find({ $or: [{ title: dow }, { isScramble: true, dateAdded: { $gte: today } }] });
  if (haiku) {
    res.json(haiku);
  } else {
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});

router.get("/recent", async (req, res) => {
  const haikus = await Haiku.find({ isScramble: false, $or: [{ 'visibleTo': 'public' }, { 'visibleTo': 'anonymous' }] }).sort({ dateAdded: -1 }).limit(10);
  if (haikus) {
    res.json(haikus);
  } else {
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});

router.get("/popular", async (req, res) => {
  const haikus = await Haiku.find({ isScramble: false, $or: [{ 'visibleTo': 'public' }, { 'visibleTo': 'anonymous' }] }).sort({ 'likers': -1 }).limit(10);
  if (haikus) {
    res.json(haikus);
  } else {
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});

// @path GET /haikus/user/userID
// @action  returns all haikus by that user
// @access private

router.get("/user/:id", auth, async (req, res) => {
  const haikus = await Haiku.find({ author: req.user.id }).sort({ dateAdded: -1 }).limit(10);
  if (haikus) {
    res.json(haikus);
  } else {
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});

router.get("/:id", async (req, res) => {
  const haikuId = req.params.id;
  const haiku = await Haiku.findById(haikuId);
  if (haiku) {
    res.status(200).json(haiku);
  } else {
    res.status(404).json({ msg: "Haiku not found" });
  }
});

router.post("/", auth, async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(401).json({ msg: error.details[0].message });

  let newHaiku = new Haiku({
    title: req.body.title,
    author: req.user.id,
    line1: req.body.line1,
    line1: req.body.line1,
    line2: req.body.line2,
    line3: req.body.line3,
    image: req.body.image,
    canScramble: req.body.canScramble,
    visibleTo: req.body.visibleTo,
    likers: req.user.id
  });
  console.log('Saving new haiku', newHaiku);
  newHaiku = await newHaiku.save();
  if (newHaiku) {
    res.status(200).json(newHaiku);
  } else {
    res.status(500).json({ msg: "Could not save your haiku to database" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const haiku = await Haiku.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      line1: req.body.line1,
      line2: req.body.line2,
      line3: req.body.line3,
      canScramble: req.body.canScramble,
      visibleTo: req.body.visibleTo
    },
    { new: true }
  );
  if (haiku) {
    res.status(200).json(haiku);
  } else {
    res.status(404).json({ msg: "Haiku not found" });
  }
});

router.put("/like/:id", auth, async (req, res) => {

  console.log(req.user.id);

  const haiku = await Haiku.findByIdAndUpdate(req.params.id,
    {
      $addToSet: { likers: req.user.id }
    },
    { new: true }
  );
  console.log(`Number of likes: ${haiku.likers.length}`);
  haiku.numberOfLikes = haiku.likers.length;
  if (haiku) {
    res.status(200).json(haiku);
  } else {
    res.status(404).json({ msg: "Haiku not found" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const haiku = await Haiku.findByIdAndRemove(req.params.id);
  if (haiku) {
    res.json(haiku);
  }
  else {
    res.status(404).json({ msg: 'Haiku not found' });
  }
});

module.exports = router;
