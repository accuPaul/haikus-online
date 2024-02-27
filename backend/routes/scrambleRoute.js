const express = require("express");
const moment = require("moment");
const { Haiku } = require("../models/haikuModel");
const auth = require('../routes/middleware/auth');
const makeScramble = require('../routes/middleware/makeScramble');

const router = express.Router();

// @path GET /scramble
// @RETURNS today's scramble-Ku (and makes on if one does not already exist)
// @access: public

router.get("/", makeScramble, async (req, res) => {
    // First, see if a Scramble-ku has been created today...
    const today = moment().startOf('day');
    let haiku = await Haiku.findOne({ isScramble: true, dateAdded: { $gte: today } });
    if (haiku) {
        haiku.authorName = 'ScrambleBot!'
        return res.json(haiku);
    }
    else
        res.status(500).json({ msg: "Error retrieving haikus from DB." });

});

// @path GET /scramble/popular
// @RETURNS top ten most recent scrambles
// @access: public

router.get('/popular', auth, async (req, res) => {
    const haikus = await Haiku.find({ isScramble: true }).sort({ numberOfLikes: -1 }).limit(10);
    if (haikus) {
        for (let haiku of haikus) { 
            haiku.authorName = 'ScrambleBot!'
         }
        res.json(haikus);
    } else {
        res.status(500).json({ msg: "Error retrieving haikus from DB." });
    }
});

// @path GET /scramble/recent
// @RETURNS up to ten most recent scramble-Ku
// @access: private
router.get("/recent", auth, makeScramble, async (req, res) => {
    const haikus = await Haiku.find({ isScramble: true }).sort({ dateAdded: -1 }).limit(10);
    if (haikus) {
        for (let haiku of haikus) { haiku.authorName = 'ScrambleBot!' }
        res.json(haikus);
    } else {
        res.status(500).json({ msg: "Error retrieving haikus from DB." });
    }
});

module.exports = router;