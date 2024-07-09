require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note.js");

// Para acceder a la data facil (acceder a la request body)
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

// Routes:
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  // response.json(notes);
  Note.find({}).then((notes) => response.json(notes));
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
  // const id = Number(request.params.id);
  // const note = notes.find((note) => note.id === id);
  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(400).send("ID not found");
  // }
});

app.delete("/api/notes/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // notes = notes.filter((note) => note.id !== id);
  // response.status(204).end();
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // };
  // El new en true hace que el controlador de eventos sea llamado con un nuevo documento y no con el original
  // Fijarse que recibe un objeto note de javascript (no se uso el new Note)

  // El context query sirve para que se validen los campos que no estan siendo modificados, por ejemplo
  // si modifico el content de una nota, pero no el important, verificara que el important igualmente
  // cumpla con sus restricciones
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// este debe ser el último middleware cargado
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
