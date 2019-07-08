const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const { secret } = require("../../../config/backend/config");
const ObjectId = mongoose.Schema.Types.ObjectId;
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "can't be blank"],
      lowercase: true,
      unique: true,
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    image: { type: String },
    hash: { type: String },
    salt: { type: String },
    email: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      lowercase: true,
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "is invalid"],
      index: true
    },
    articles: [
      {
        type: ObjectId,
        ref: "Article"
      }
    ],
    comments: [
      {
        type: ObjectId,
        ref: "Comment"
      }
    ],
    votes: [
      {
        type: ObjectId,
        ref: "Vote"
      }
    ]
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: "is alreadey taken" });

userSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

userSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

userSchema.methods.toAuthJSON = function() {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    image: this.image
  };
};

function validateCreateUser(value) {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    image: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    articles: Joi.array().items(Joi.objectId()),
    comments: Joi.array().items(Joi.objectId()),
    votes: Joi.array().items(Joi.objectId())
  });
  return Joi.validate(value, schema);
}

module.exports = {
  User: mongoose.model("User", userSchema),
  validateCreateUser: validateCreateUser
};
