/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, FAVORITE_GENRE } from "../queries";

const Recommendations = (props) => {
  const [previousBooks, setPreviousBooks] = useState([]);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  const { loading: genreLoading, data: genreData } = useQuery(FAVORITE_GENRE);

  useEffect(() => {
    console.log("genreData: ", genreData);
    if (genreData) {
      setFavoriteGenre(genreData.me.favoriteGenre);
    }
  }, [genreData]);

  // if the skip prop is set to true, the fetch isn't going to execute
  const {
    loading: booksLoading,
    data: booksData,
    refetch,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !props.show || genreLoading || !favoriteGenre,
  });

  useEffect(() => {
    if (props.show && favoriteGenre) {
      refetch();
    }
  }, [props.show, favoriteGenre, refetch]);

  useEffect(() => {
    if (booksData && !booksLoading) {
      setPreviousBooks(booksData.allBooks);
    }
  }, [booksData, booksLoading]);

  if (!props.show) {
    return null;
  }

  if (genreLoading) {
    return <div>loading...</div>;
  }

  const books = booksLoading ? previousBooks : booksData.allBooks;

  return (
    <div>
      <h2>books</h2>
      {booksLoading && <div>loading books...</div>}
      <p>books in your favorite genre</p>
      <b>{favoriteGenre}</b>
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

export default Recommendations;
