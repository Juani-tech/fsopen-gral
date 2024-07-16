/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { ALL_GENRES, ALL_BOOKS, BOOK_ADDED, GENRES_ADDED } from "../queries";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Stack from "react-bootstrap/Stack";

const updateGenresCache = (cache, query, addedGenres) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      return seen.has(item) ? false : seen.add(item);
    });
  };

  cache.updateQuery(query, (data) => {
    if (!data) return { allGenres }; // Handle the case where data is null
    const { allGenres } = data;
    return {
      allGenres: uniqByName(allGenres.concat(addedGenres)),
    };
  });
};

const updateBooksCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, (data) => {
    if (!data) return { allBooks: [] }; // Ensure data is not null and provide a default value
    const { allBooks } = data;
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const Books = (props) => {
  const { loading: genresLoading, data: genresData } = useQuery(ALL_GENRES);
  const [actualGenre, setActualGenre] = useState("all genres");
  const [previousBooks, setPreviousBooks] = useState([]);

  const variables = actualGenre === "all genres" ? {} : { genre: actualGenre };

  const {
    loading: booksLoading,
    data: booksData,
    refetch,
  } = useQuery(ALL_BOOKS, {
    variables,
    skip: !props.show,
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded;
      window.alert(`${bookAdded.title} added`);
      updateBooksCache(client.cache, { query: ALL_BOOKS }, bookAdded);
    },
  });

  useSubscription(GENRES_ADDED, {
    onData: ({ data, client }) => {
      const genresAdded = data.data.genresAdded;
      updateGenresCache(client.cache, { query: ALL_GENRES }, genresAdded);
    },
  });

  useEffect(() => {
    if (props.show) {
      refetch();
    }
  }, [actualGenre, props.show, refetch]);

  useEffect(() => {
    if (booksData && !booksLoading) {
      setPreviousBooks(booksData.allBooks);
    }
  }, [booksData, booksLoading]);

  if (!props.show) {
    return null;
  }
  if (genresLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  const genres = genresData.allGenres;
  const books = booksLoading ? previousBooks : booksData.allBooks;

  return (
    <div>
      <Stack gap={3}>
        <h2 className="p-2">Books</h2>
        <div>
          <ButtonGroup aria-label="Basic example">
            <Button
              key={"all genres"}
              onClick={() => setActualGenre("all genres")}
              variant="outline-dark"
            >
              all genres
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                onClick={() => setActualGenre(genre)}
                variant="outline-dark"
              >
                {genre}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {booksLoading && (
          <Spinner animation="border" size="sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}

        <Table responsive striped hover={true} className="p-2">
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
    </div>
  );
};

export default Books;
