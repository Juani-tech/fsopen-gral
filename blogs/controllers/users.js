const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || username.length < 3) {
    return response.status(400).json({
      error: "username missing or too short",
    });
  }
  // La validacion tiene que hacerse aca porque en la db se guarda el hash
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "password missing or too short",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  return response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  return response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  // When using populate, the name of the thing I want to 'change' must be passed
  const user = await User.findById(request.params.id).populate("blogs");

  return response.json(user);
});

module.exports = usersRouter;
