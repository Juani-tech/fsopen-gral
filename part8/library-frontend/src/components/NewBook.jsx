import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log("messages: ", messages);
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        };
      });
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        console.log("Response de la de books: ", response.data);
        console.log("allAuthors: ", allAuthors);
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
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;

// const [ createPerson ] = useMutation(CREATE_PERSON, {
//   onError: (error) => {
//     const messages = error.graphQLErrors.map(e => e.message).join('\n')
//     setError(messages)
//   },
//   update: (cache, response) => {
//     cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
//       return {
//         allPersons: allPersons.concat(response.data.addPerson),
//       }
//     })
//   },
// })

// const submit = async (event) => {
//   event.preventDefault()

//   createPerson({
//     variables: {
//       name, street, city,
//       phone: phone.length > 0 ? phone : undefined
//     }
//   })
