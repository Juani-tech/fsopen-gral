const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { getAsync, setAsync } = require("../redis/index");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  console.log("🚀 ~ router.get ~ todos:", todos)
  
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  const added = await getAsync("added_todos");
  if (!added) {
    await setAsync("added_todos", 0);
  } else {
    await setAsync("added_todos", Number(added) + 1);
  }

  res.send(todo);
});

router.get("/statistics", async (req, res) => {
  const added = await getAsync("added_todos");
  if (!added) {
    await setAsync("added_todos", 0);
  }

  const ret = {
    added_todos: added ? Number(added) : 0,
  };
  res.send(ret);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);
  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  const todo = req.todo;
  res.send(todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const todo = req.todo;
  todo.done = !todo.done;

  const saved = await todo.save();

  res.status(200).json(saved);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
