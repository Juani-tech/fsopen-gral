/* eslint-disable react/prop-types */
import { useQuery, useSubscription } from "@apollo/client";
import { ALL_AUTHORS, AUTHOR_ADDED } from "../queries";
import BirthYearForm from "./BirthYearForm";
import Table from "react-bootstrap/Table";

const updateAuthorsCache = (cache, query, addedAuthor) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      return seen.has(item) ? false : seen.add(item);
    });
  };

  cache.updateQuery(query, (data) => {
    if (!data) return { allAuthors }; // Handle the case where data is null
    const { allAuthors } = data;
    return {
      allAuthors: uniqByName(allAuthors.concat(addedAuthor)),
    };
  });
};

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);

  useSubscription(AUTHOR_ADDED, {
    onData: ({ data, client }) => {
      const authorAdded = data.data.authorAdded;
      updateAuthorsCache(client.cache, { query: ALL_AUTHORS }, authorAdded);
    },
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  return (
    <div>
      <h2>Authors</h2>
      <Table responsive striped hover={true}>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {props.token ? <BirthYearForm authors={authors}></BirthYearForm> : null}
    </div>
  );
};

export default Authors;
