import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

describe("<Todo />", () => {
  let todo;
  let mockHandler;
  let renderedTodo;

  beforeEach(() => {
    todo = {
      text: "Test todo",
      done: false,
    };

    mockHandler = vi.fn();

    renderedTodo = render(
      <Todo todo={todo} deleteTodo={mockHandler} completeTodo={mockHandler} />
    );
  });

  test("at start only title and author are displayed", () => {
    const text = screen.getByText("Test todo");
    expect(text).toBeDefined();
  });
});
