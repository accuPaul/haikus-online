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
// @RETURNS top ten most popular scrambles
// @access: public

router.get('/popular', auth, async (req, res) => {
    let { page, pageSize } = req.query;

  try {
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const haikus = await Haiku.aggregate([
    {
      $facet: {
        metadata: [ { $match: {isScramble: true } },{ $count: 'totalCount'}],
        data: [
          { $match: {isScramble: true } },
          { $addFields: 
            {"nLikes" : {$size : "$likers"}} 
          },
          { $sort : { nLikes : -1, _id: 1}},
          { $skip: ( page-1) * pageSize},
          {$limit: pageSize}
      ]
      }
    }
    ])
  
    for (let haiku of haikus[0].data) {
        haiku.authorName = 'ScrambleBot!'
    }
    return res.status(200).json({
      haikus: {
        metadata: { totalCount: haikus[0].metadata[0].totalCount, page, pageSize},
        data: haikus[0].data
      }
    })
    
  } catch (error) {
    console.error(`Error is ${error}`)
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
   
});

// @path GET /scramble/recent
// @RETURNS up to ten most recent scramble-Ku
// @access: private
router.get("/recent", auth, makeScramble, async (req, res) => {
    let { page, pageSize } = req.query;

  try {
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const haikus = await Haiku.aggregate([
    {
      $facet: {
        metadata: [ { $match: {isScramble: true } },{ $count: 'totalCount'}],
        data: [
          { $match: {isScramble: true } },
          { $addFields: 
            {"nLikes" : {$size : "$likers"}} 
          },
          { $sort : { dateAdded : -1, _id: 1}},
          { $skip: ( page-1) * pageSize},
          {$limit: pageSize}
      ]
      }
    }
    ])
  
    for (let haiku of haikus[0].data) {
        haiku.authorName = 'ScrambleBot!'
    }
    return res.status(200).json({
      haikus: {
        metadata: { totalCount: haikus[0].metadata[0].totalCount, page, pageSize},
        data: haikus[0].data
      }
    })
    
  } catch (error) {
    console.error(`Error is ${error}`)
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
    
});

module.exports = router;