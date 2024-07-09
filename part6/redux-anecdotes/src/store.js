import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./reducers/filterReducer";
import anecodteReducer from "./reducers/anecdoteReducer";
import notificationReducer from "./reducers/notificationReducer";

const store = configureStore({
  reducer: {
    anecdotes: anecodteReducer,
    filter: filterReducer,
    notifications: notificationReducer,
  },
});

console.log(`state: ${store.getState()}`);

export default store;
