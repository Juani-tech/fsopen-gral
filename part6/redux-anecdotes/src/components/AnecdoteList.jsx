import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ content, votes, handleClick }) => {
  return (
    <div>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    console.log("filter: ", filter);
    if (filter === "") {
      return anecdotes;
    }
    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const dispatch = useDispatch();

  const vote = (id, content) => {
    dispatch(voteAnecdote(id));
    dispatch(setNotification(`You voted: ${content}`, 3));
  };

  return anecdotes.map((anecdote) => {
    return (
      <Anecdote
        key={anecdote.id}
        content={anecdote.content}
        votes={anecdote.votes}
        handleClick={() => vote(anecdote.id, anecdote.content)}
      />
    );
  });
};

export default AnecdoteList;
