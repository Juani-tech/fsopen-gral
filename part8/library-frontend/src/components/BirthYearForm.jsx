/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from "../queries";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const BirthYearForm = ({ authors }) => {
  const [name, setSelectedAuthor] = useState(
    authors.length < 1 ? null : authors[0].name
  );
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

  if (authors.length < 1) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();

    changeBirthYear({ variables: { name, setBornTo: Number(birthYear) } });

    // setName("");
    setBirthYear("");
  };

  return (
    <Stack gap={3}>
      <h2 className="p-2">Set birthyear</h2>

      <Form onSubmit={submit} className="p-2">
        <Form.Group className="mb-3" controlId="formName">
          <Form.Select
            aria-label="Default select example"
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
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBirthYear">
          <Form.Label>Birth Year</Form.Label>
          <Form.Control
            type="text"
            placeholder="year"
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formSubmitBirthUpdate">
          <Button variant="primary" type="submit">
            update birth year
          </Button>
        </Form.Group>
      </Form>
    </Stack>
  );
};

export default BirthYearForm;
