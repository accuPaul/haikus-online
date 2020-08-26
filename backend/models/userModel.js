const mongoose = require('mongoose');
const config = require('../config/key');
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 7,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    config.JWT_PRIVATEKEY,
    { expiresIn: 3600 }
  );
};

const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().max(50).min(5).required().email(),
    password: Joi.string().min(8).max(255).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
