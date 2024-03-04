const express = require("express");
const moment = require("moment");
const { Haiku, validate } = require("../models/haikuModel");
const { User } = require("../models/userModel");
const auth = require('../routes/middleware/auth');
const makeScramble = require('../routes/middleware/makeScramble');
const { ObjectId } = require('mongodb')

const router = express.Router();

router.get("/today", makeScramble, async (req, res) => {

  const dow = "Haiku " + moment().dayOfYear() + "/366";
  const today = moment().startOf('day').toDate();
  
  try {
    const haikus = await Haiku.aggregate([
      {
        $facet: {
          metadata: [
            { $match: { $or: [{ title: dow }, { isScramble: true, dateAdded: { $gte: today } }] } },
            { $count: 'totalCount'}
          ],
          data: [
            { $match: { $or: [{ title: dow }, { isScramble: true, dateAdded: { $gte: today } }] } },
            { $addFields: 
              {"nLikes" : {$size : "$likers"}} 
            }
        ]
        }
      }
      ])
    
      for (let haiku of haikus[0].data) {
        haiku.authorName = await getAuthorName(haiku, req.user?req.user.id:null)
      }
      return res.status(200).json({
        haikus: {
          metadata: { totalCount: haikus[0].metadata[0].totalCount },
          data: haikus[0].data
        }
      })
      
    
  } catch (error) {
    console.error(`Error is ${error}`)
    res.status(500).json({ msg: "Error retrieving haikus from DB." });
  }
});


router.get("/recent", async (req, res) => {
  let { page, pageSize } = req.query;

  try {
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const haikus = await Haiku.aggregate([
    {
      $facet: {
        metadata: [
          { $match: {isScramble: false, $or: [{ 'visibleTo': 'public' }, { 'visibleTo': 'anonymous' }]} },
          { $count: 'totalCount'}
        ],
        data: [
          { $match: {isScramble: false, $or: [{ 'visibleTo': 'public' }, { 'visibleTo': 'anonymous' }]} },
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
      haiku.authorName = await getAuthorName(haiku, req.user?req.user.id:null)
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

router.get("/popular", async (req, res) => {
  let { page, pageSize } = req.query;

  try {
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const haikus = await Haiku.aggregate([
    {
      $facet: {
        metadata: [
          { $match: {isScramble: false, $or: [{ 'visibleTo': 'public' }, { 'visibleTo': 'anonymous' }]} },
          { $count: 'totalCount'}],
        data: [
          { $match: {isScramble: false, $or: [{ 'visibleTo': 'public' }, { 'visibleTo': 'anonymous' }]} },
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
      haiku.authorName = await getAuthorName(haiku, req.user?req.user.id:null)
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

// @path GET /haikus/user/userID?sortBy=dateAdded?sortDir=[-1,1]?page=1?pageSize=10
// @optional parameters: 
//      ?sortBy == field by which to sort (default is dateAdded)
//      ?sortDir == -1 for descending, 1 for ascending (default is ascending unless the sort field is dateAdded)
//      ?page == page # of results
//      ?pagesize == number of elements to return
// @action  returns all haikus by that user
// @access private

router.get("/user/:id", auth, async (req, res) => {
  let { page, pageSize, sortBy, sortDir} = req.query
  const userId = ObjectId.createFromHexString(req.params.id)

  try {
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    
    sortBy = sortBy || 'dateAdded';
    sortDir = parseInt(sortDir, 10) || -1;
    const sort = {}
    sort[sortBy] = sortDir
    sort['_id'] = 1
    
    const haikus = await Haiku.aggregate([
    {
      $facet: {
        metadata: [
          {  $match: { author: userId }},
          { $count: 'totalCount'}
        ],
        data: [
          {  $match: { author: userId }
          },
          { $addFields: 
            {"nLikes" : {$size : "$likers"}} 
          },
          { $sort : sort},
          { $skip: ( page-1) * pageSize},
          {$limit: pageSize}
      ]
      }
    }
    ])
  
    for (let haiku of haikus[0].data) {
      haiku.authorName = await getAuthorName(haiku, req.user?req.user.id:null)
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

router.get("/:id", async (req, res) => {
  const haikuId = req.params.id;
  const haiku = await Haiku.findById(haikuId);
  if (haiku) {
    haiku.authorName = await getAuthorName(haiku, req.user?req.user.id:null)
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

  const haiku = await Haiku.findByIdAndUpdate(req.params.id,
    {
      $addToSet: { likers: req.user.id }
    },
    { new: true }
  );
  
  if (haiku) {
    if (haiku.likers == null) haiku.likers = [ObjectId.createFromHexString(req.user.id)]
    haiku.numberOfLikes = haiku.likers?.length | 0;
    haiku.save();
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

async function getAuthorName(haiku, userId) {
  if (haiku.visibleTo === 'public' || (haiku.visibleTo === 'private' && haiku.author === userId)) {
    const user = await User.findById(haiku.author);
    if (user) return user.name
  }
  return null;
};

module.exports = router;
