import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";
import Recommendations from "./components/Recommendation";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Stack from "react-bootstrap/Stack";

const App = () => {
  const [page, setPage] = useState("authors");
  const [, setErrorMessage] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    console.log("CLIENT PRE: ", client);
    client.resetStore().then(() => {
      setPage("authors"); // Optionally, redirect to a public page on logout
    });
  };

  if (!token) {
    return (
      <Container>
        <Stack gap={3}>
          <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
              <Navbar.Brand href="#home">Library</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="#authors" onClick={() => setPage("authors")}>
                    Authors
                  </Nav.Link>
                  <Nav.Link href="#books" onClick={() => setPage("books")}>
                    Books
                  </Nav.Link>
                  <Nav.Link href="#login" onClick={() => setPage("login")}>
                    Login
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Authors show={page === "authors"} />
          <Books show={page === "books"} />
          <LoginForm
            show={page === "login"}
            setToken={setToken}
            setError={notify}
            setPage={setPage}
          ></LoginForm>
        </Stack>
      </Container>
    );
  }

  return (
    <div>
      <Container>
        <Stack gap={3}>
          <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
              <Navbar.Brand href="#home">Library</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="#authors" onClick={() => setPage("authors")}>
                    Authors
                  </Nav.Link>
                  <Nav.Link href="#books" onClick={() => setPage("books")}>
                    Books
                  </Nav.Link>
                  <Nav.Link href="#add-book" onClick={() => setPage("add")}>
                    Add book
                  </Nav.Link>
                  <Nav.Link
                    href="#recommended"
                    onClick={() => setPage("recommended")}
                  >
                    Recommended
                  </Nav.Link>
                  <Nav.Link href="#logout" onClick={logout}>
                    logout
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Authors show={page === "authors"} token={token} />
          <Books show={page === "books"} />
          <NewBook show={page === "add"} />
          <Recommendations
            show={page === "recommended"}
            token={token}
          ></Recommendations>
        </Stack>
      </Container>
    </div>
  );
};

export default App;
