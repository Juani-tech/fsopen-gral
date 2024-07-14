const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  favoriteGenre: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("LibraryUser", schema);
