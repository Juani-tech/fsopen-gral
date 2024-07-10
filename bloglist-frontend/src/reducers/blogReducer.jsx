import { createSlice } from '@reduxjs/toolkit'
import {
  setErrorNotification,
  setSuccessNotification,
} from './notificationReducer'

import blogService from '../services/blogs'
const initialState = []

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },

    concatBlog(state, action) {
      return [...state, action.payload]
    },
  },
})

export const { setBlogs, concatBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    blogService
      .create(blog)
      .then((returnedBlog) => {
        dispatch(concatBlog(returnedBlog))
        dispatch(
          setSuccessNotification(
            `A new blog ${blog.title} by ${blog.author} added`,
            5
          )
        )
      })
      .catch((error) => {
        console.error(error)
        dispatch(
          setErrorNotification(
            `Error adding blog ${blog.title} by ${blog.author}`,
            5
          )
        )
      })
  }
}

export default blogSlice.reducer
