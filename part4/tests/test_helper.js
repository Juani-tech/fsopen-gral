const Note = require("../models/note");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
  },
];

const createTestUser = async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("password", 10);
  const user = new User({ username: "testuser", passwordHash });
  await user.save();
  return user;
};
// Funcion que crea un nuevo objeto Note, lo guarda en la base de datos y luego lo elimina para obtener un nuevo id
const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  createTestUser,
  nonExistingId,
  notesInDb,
  usersInDb,
};
