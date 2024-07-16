/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { ALL_GENRES, ALL_BOOKS, BOOK_ADDED } from "../queries";

const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, (data) => {
    if (!data) return { allBooks: [addedBook] }; // Handle the case where data is null
    const { allBooks } = data;
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const Books = (props) => {
  const genresResult = useQuery(ALL_GENRES);
  const [actualGenre, setActualGenre] = useState("all genres");
  const [previousBooks, setPreviousBooks] = useState([]);

  const { loading: genresLoading, data: genresData } = genresResult;

  const variables = actualGenre === "all genres" ? {} : { genre: actualGenre };

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded;
      window.alert(`${bookAdded.title} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, bookAdded);
    },
  });

  const {
    loading: booksLoading,
    data: booksData,
    refetch,
  } = useQuery(ALL_BOOKS, {
    variables,
    skip: !props.show,
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
    return <div>loading genres...</div>;
  }

  const genres = genresData.allGenres;
  const books = booksLoading ? previousBooks : booksData.allBooks;

  return (
    <div>
      <h2>books</h2>
      <div>
        <button key={"all genres"} onClick={() => setActualGenre("all genres")}>
          all genres
        </button>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setActualGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>

      {booksLoading && <div>loading books...</div>}

      <table>
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
      </table>
    </div>
  );
};

export default Books;
