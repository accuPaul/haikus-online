const express = require("express");
const moment = require("moment");
const { Haiku, validate } = require("../models/haikuModel");

const router = express.Router();

router.get("/", async (req, res) => {
  const haikus = await Haiku.find({}).sort({ dateAdded: -1 }).limit(10);
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

router.get("/today", async (req, res) => {
  const dow = "Haiku " + moment().dayOfYear() + "/366";
  const haiku = await Haiku.findOne({ title: dow });
  if (haiku) {
    res.json(haiku);
  } else {
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});

router.get("/scramble", async (req, res) => {
  const haikus = await Haiku.find({ canScramble: true });
  if (haikus) {
    const keys = Object.keys(haikus);
    let random = keys[Math.floor(Math.random() * keys.length)];
    const line1 = haikus[random].line1 + " (" + haikus[random].title + ")";
    random = keys[Math.floor(Math.random() * keys.length)];
    const line2 = haikus[random].line2 + " (" + haikus[random].title + ")";
    random = keys[Math.floor(Math.random() * keys.length)];
    const line3 = haikus[random].line3 + " (" + haikus[random].title + ")";

    const scrambleKu = new Haiku({
      title: "Scramble-Ku!",
      line1,
      line2,
      line3,
      canScramble: false,
      canShare: true,
      access: "public",
    });
    res.json(scrambleKu);
  } else {
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(401).json({ msg: error.details[0].message });

  let newHaiku = new Haiku({
    title: req.body.title,
    author: req.body.author,
    line1: req.body.line1,
    line1: req.body.line1,
    line2: req.body.line2,
    line3: req.body.line3,
    image: req.body.image,
    canScramble: req.body.canScramble,
    canShare: req.body.canShare,
    access: req.body.access,
  });
  newHaiku = await newHaiku.save();
  if (newHaiku) {
    res.status(200).json(newHaiku);
  } else {
    res.status(500).json({ msg: "Could not save your haiku to database" });
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const haiku = await Haiku.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      line1: req.body.line1,
      line2: req.body.line2,
      line3: req.body.line3,
      canShare: req.body.canShare,
      canScramble: req.body.canScramble,
      access: req.body.acess
    },
    { new: true }
  );
  if (haiku) {
    res.status(200).json(haiku);
  } else {
    res.status(404).json({ msg: "Haiku not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const haiku = await Haiku.findByIdAndRemove(req.params.id);
  if (haiku) {
    res.json(haiku);
  }
  else {
    res.status(404).json({ msg: 'Haiku not found' });
  }
});

module.exports = router;
