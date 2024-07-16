/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setAlert] = useState(false);

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log("Error", error);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      props.setToken(token);
      localStorage.setItem("library-user-token", token);
    }
    props.setPage("authors");
  }, [result.data]); // eslint-disable-line

  if (!props.show) {
    return null;
  }
  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" size="lg">
          login
        </Button>
        <Alert variant={"danger"} show={showAlert}>
          Invalid credentials
        </Alert>
      </Form>
    </div>
  );
};

export default LoginForm;
