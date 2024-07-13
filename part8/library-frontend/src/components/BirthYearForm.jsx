/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from "../queries";

const BirthYearForm = ({ authors }) => {
  const [name, setSelectedAuthor] = useState(authors[0].name);
  const [birthYear, setBirthYear] = useState("");

  const [changeBirthYear, result] = useMutation(EDIT_BIRTH_YEAR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log("messages: ", messages);
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const updatedAuthor = response.data.editAuthor;
        return {
          allAuthors: allAuthors.map((author) =>
            author.name === updatedAuthor.name ? updatedAuthor : author
          ),
        };
      });
    },
  });

  // onError doesn't work if it just returns null, that's why it should be handled outside useMutation
  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("");
    }
  }, [result.data]);

  const submit = (event) => {
    event.preventDefault();

    changeBirthYear({ variables: { name, setBornTo: Number(birthYear) } });

    // setName("");
    setBirthYear("");
  };

  return (
    <>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <select
          value={name}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          default={authors[0].name}
        >
          {authors.map((a) => {
            return (
              <option value={a.name} key={a.name}>
                {a.name}
              </option>
            );
          })}
        </select>
        {/* <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          ></input>
        </div> */}
        <div>
          born
          <input
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          ></input>
        </div>
        <button type="submit">update name</button>
      </form>
    </>
  );
};

export default BirthYearForm;
