import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter(state, action) {
      // The new value of the reducer state has to be returned
      return action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
