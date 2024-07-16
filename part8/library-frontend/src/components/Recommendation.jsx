/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, FAVORITE_GENRE } from "../queries";
import Table from "react-bootstrap/Table";
import Stack from "react-bootstrap/Stack";

const Recommendations = (props) => {
  const [previousBooks, setPreviousBooks] = useState([]);
  const [favoriteGenre, setFavoriteGenre] = useState(null);

  const {
    loading: genreLoading,
    data: genreData,
    refetch: refetchFavoriteGenre,
  } = useQuery(FAVORITE_GENRE);

  useEffect(() => {
    if (!favoriteGenre) {
      refetchFavoriteGenre();
    }
  }, [favoriteGenre, props.show, refetchFavoriteGenre]);

  useEffect(() => {
    if (genreData && genreData.me) {
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

  if (!props.token) {
    return null;
  }

  if (!props.show) {
    return null;
  }

  if (genreLoading) {
    return <div>loading...</div>;
  }

  if (booksLoading) {
    return <div>loading...</div>;
  }

  const books = booksLoading ? previousBooks : booksData.allBooks;

  return (
    <Stack gap={3}>
      <h2>Books</h2>
      {booksLoading && <div>loading books...</div>}
      <p>Recommended books</p>
      <b>{favoriteGenre}</b>
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
  );
};

export default Recommendations;
