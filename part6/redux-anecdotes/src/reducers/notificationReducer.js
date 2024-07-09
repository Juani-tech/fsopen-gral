import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification(state, action) {
      // The new value of the reducer state has to be returned
      console.log("action", action);
      return action.payload;
    },
    resetNotification(state, action) {
      // Why do I compare this? Because of the timeout, I don't want an advanced timeOut
      // It doesn't catch the possibility of reset when voting the same anecdote
      if (action.payload === state) {
        return initialState;
      }
      return state;
    },
  },
});

export const { showNotification, resetNotification } =
  notificationSlice.actions;

// Time must be in seconds
export const setNotification = (content, time) => {
  return (dispatch) => {
    dispatch(showNotification(content));

    setTimeout(() => {
      dispatch(resetNotification(content));
    }, time * 1000);
  };
};

export default notificationSlice.reducer;
