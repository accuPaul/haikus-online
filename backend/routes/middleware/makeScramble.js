const { Haiku } = require('../../models/haikuModel');
const moment = require('moment');

async function makeScramble(pareq, res, next) {

    // First, see if a Scramble-ku has been created today...
    const today = moment().startOf('day');
    let haiku = await Haiku.findOne({ isScramble: true, dateAdded: { $gte: today } });

    //if not we'll create a new one.
    if (!haiku) {

        // start by making an array of all haikus eligible to scramble...
        const haikus = await Haiku.find({ canScramble: true });

        // then select each line at random from that list
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
                author: "5f492d8e35d4fa967c307109",  // User ID of Scarmble-bot. Hardcoded here to save time.
                canScramble: false,                  // No point making this scramble-eligible, that would be redundant
                isScramble: true,
                visibleTo: "public",
                likers: ''                          // No one likes a Scramble-ku initially
            });
            scrambleKu = await scrambleKu.save();
        }
    }
    next();
}

module.exports = makeScramble;
