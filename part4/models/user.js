const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const optionalWithLength = function (minLength, maxLength) {
  minLength = minLength || 0;
  maxLength = maxLength || Infinity;
  return {
    validator: function (value) {
      if (value === undefined) return true;
      return value.length >= minLength && value.length <= maxLength;
    },
    message:
      "Username is shorter than the minimum allowed length (" +
      minLength +
      ") or larger than the maximum allowed length (" +
      maxLength +
      ")",
  };
};
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: optionalWithLength(4, 255),
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // el passwordHash no debe mostrarse
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
