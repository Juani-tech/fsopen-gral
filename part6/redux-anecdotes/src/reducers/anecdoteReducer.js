import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const sortByVotes = (anecdotes) => {
  return [...anecdotes].sort((a, b) => b.votes - a.votes); // desc sort
};

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },

    setAnecdotes(state, action) {
      return sortByVotes(action.payload);
    },

    updateAnecdote(state, action) {
      const id = action.payload.id;
      const updatedAnecdotes = state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.payload
      );
      return sortByVotes(updatedAnecdotes);
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const state = getState();

    const anecdoteToVote = state.anecdotes.find(
      (anecdote) => anecdote.id === id
    );

    const votedAnecdote = await anecdoteService.voteAnecdote(anecdoteToVote);

    dispatch(updateAnecdote(votedAnecdote));
  };
};

export default anecdoteSlice.reducer;
