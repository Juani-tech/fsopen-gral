const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  // Todo esto funciona por el "ref" que se le agrega en el modelo
  // populate para hacer la union con la db de notes y que se muestren tambien
  // El argumento dado al metodo define que los ids que hacen referencia a los objetos note en el campo
  // notes, seran reemplazados por los documentos de note referenciados
  const users = await User.find({}).populate("notes");
  response.json(users);
});

module.exports = usersRouter;
