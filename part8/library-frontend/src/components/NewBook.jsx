import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, CREATE_BOOK } from "../queries";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log("error: ", error);
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const author = response.data.addBook.author.name;
        const foundAuthor = allAuthors.find((a) => a.name === author);
        if (!foundAuthor) {
          return {
            allAuthors: allAuthors.concat({
              name: author,
              born: null,
              bookCount: 1,
            }),
          };
        } else {
          const updatedAuthor = {
            ...foundAuthor,
            bookCount: foundAuthor.bookCount + 1,
          };
          return {
            allAuthors: allAuthors.map((a) =>
              a.name === author ? updatedAuthor : a
            ),
          };
        }
      });
    },
  });

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    console.log("add book...");
    createBook({
      variables: {
        title,
        published: Number(published),
        author,
        genres,
      },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <Container>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPublished">
          <Form.Label>Published</Form.Label>
          <Form.Control
            type="number"
            placeholder="year"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGenres">
          <Form.Label>Genres</Form.Label>
          <Form.Control
            type="text"
            placeholder="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <Button variant="primary" onClick={addGenre} type="button">
            add genre
          </Button>
        </Form.Group>
        <Container>genres: {genres.join(" ")}</Container>
        <Button type="submit" variant="primary">
          create book
        </Button>
      </Form>
    </Container>
  );
};

export default NewBook;
