import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
// import noteReducer from './reducers/noteReducer'
// import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    // filter: filterReducer,
  },
})

console.log('State: ', store.getState())

export default store
