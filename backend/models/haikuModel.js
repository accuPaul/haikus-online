const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const haikuSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled",
    minlength: 1,
    maxlength: 50,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  authorName: {
    type: String,
  },
  visibleTo: {
    type: String,
    default: "public",
    enum: ["public", "private", "anonymous"],
  },
  line1: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 60,
  },
  line2: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 60,
  },
  line3: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 70,
  },
  canScramble: {
    type: Boolean,
    default: true,
  },
  canShare: {
    type: Boolean,
    default: true,
  },
  isScramble: {
    type: Boolean,
    default: false
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  numberOfLikes: {
    type: Number,
    default: 0
  },
  likers: [{
    type: mongoose.Schema.Types.ObjectId
  }],
});

haikuSchema.statics.getAuthor = function (userId) {
  return this.findOne({
    "author._id": userId,
  });
};

const Haiku = mongoose.model("Haiku", haikuSchema);

function validateHaiku(haiku) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(50),
    author: Joi.objectId(),
    line1: Joi.string().min(10).max(50).required(),
    line2: Joi.string().min(12).max(70).required(),
    line3: Joi.string().min(10).max(50).required(),
    canScramble: Joi.boolean(),
    visibleTo: Joi.string()
  });
  return schema.validate(haiku);
}

exports.Haiku = Haiku;
exports.validate = validateHaiku;
