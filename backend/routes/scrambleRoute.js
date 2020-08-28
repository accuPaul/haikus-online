const express = require("express");
const moment = require("moment");
const { Haiku, validate } = require("../models/haikuModel");
const auth = require('../routes/middleware/auth');

const router = express.Router();

// @path GET /scramble
// @RETURNS today's scramble-Ku (and makes on if one does not already exist)
// @access: public

router.get("/", async (req, res) => {
    // First, see if a Scramble-ku has been created today...
    const today = moment().startOf('day');
    let haiku = await Haiku.findOne({ isScramble: true, dateAdded: { $gte: today } });
    if (haiku) return res.json(haiku);

    //if not we'll create a new one.
    const haikus = await Haiku.find({ canScramble: true });
    if (haikus) {
        const keys = Object.keys(haikus);
        let random = keys[Math.floor(Math.random() * keys.length)];
        const line1 = haikus[random].line1;
        random = keys[Math.floor(Math.random() * keys.length)];
        const line2 = haikus[random].line2;
        random = keys[Math.floor(Math.random() * keys.length)];
        const line3 = haikus[random].line3;

        // Get the count of scrambles, so we can make a title...
        const scrambleCount = await Haiku.find({ isScramble: true }).countDocuments();
        let scrambleKu = new Haiku({
            title: "Scramble-Ku #" + (scrambleCount + 1).toString(),
            line1,
            line2,
            line3,
            author: "5f492d8e35d4fa967c307109",
            canScramble: false,
            canShare: true,
            isScramble: true,
            access: "public",
        });
        scrambleKu = await scrambleKu.save();
        res.json(scrambleKu);
    } else {
        res.status(500).json({ msg: "Error retrieving haikus from DB." });
    }
});

// @path GET /scramble/popular
// @RETURNS top ten most recent scrambles
// @access: public

router.get('/popular', auth, async (req, res) => {
    const haikus = Haikus.find({ isScramble: true }).sort({ numberOfLikes: -1 }).limit(10);
    if (haikus) {
        res.json(haikus);
    } else {
        res.status(500).json({ msg: "Error retrieving haikus from DB." });
    }
});

// @path GET /scramble/recent
// @RETURNS up to ten most recent scramble-Ku
// @access: private
router.get("/recent", auth, async (req, res) => {
    const haikus = await Haiku.find({ isScramble: true }).sort({ dateAdded: -1 }).limit(10);
    if (haikus) {
        res.json(haikus);
    } else {
        res.status(500).json({ msg: "Error retrieving haikus from DB." });
    }
});

module.exports = router;