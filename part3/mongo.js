const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

// El nombre de la db se pone luego del .net/, antes de '?'
const url = `mongodb+srv://juani:${password}@cluster0.yos1epz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// En mongo las colecciones se guardan con s, en este caso: note's'
const Note = mongoose.model("note", noteSchema);

const note = new Note({
  content: "HTML is easy",
  importante: true,
});
// find sirve para recuperar los objetos de la db
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// Note.find({ important: true }).then((result) => {
// });

// note.save().then((result) => {
//   console.log("note saved");
//   mongoose.connection.close();
// });
