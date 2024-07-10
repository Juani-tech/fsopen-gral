import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import {
  setSuccessNotification,
  setErrorNotification,
} from './notificationReducer'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    resetUser(state, action) {
      return initialState
    },
  },
})

export const { setUser, resetUser } = userSlice.actions

export const login = (user) => {
  return async (dispatch, getState) => {
    loginService
      .login(user)
      .then((userWithToken) => {
        console.log('UserWithToken: ', userWithToken)
        window.localStorage.setItem(
          'loggedBlogappUser',
          JSON.stringify(userWithToken)
        )
        blogService.setToken(userWithToken.token)
        dispatch(setUser(userWithToken))
        dispatch(setSuccessNotification(`Welcome ${userWithToken.name}`, 3))
      })
      .catch((error) => {
        console.log('Error when trying to log in: ', error)
        dispatch(setErrorNotification('Wrong credentials', 5))
      })
  }
}

export const logout = () => {
  console.log('Dispatching a logout')
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(resetUser())
  }
}

export const getPreviousLogin = () => {
  return async (dispatch, getState) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    const state = getState()
    const user = state.user
    if (loggedUserJSON && !user) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export default userSlice.reducer
