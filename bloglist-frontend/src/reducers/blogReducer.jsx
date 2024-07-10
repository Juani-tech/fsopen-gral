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

    updateBlog(state, action) {
      const id = action.payload.id
      const updatedBlogs = state.map((blog) =>
        blog.id !== id ? blog : action.payload
      )
      return updatedBlogs
    },

    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { setBlogs, concatBlog, updateBlog, deleteBlog } =
  blogSlice.actions

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

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    const updatedBlog = await blogService.update(likedBlog.id, likedBlog)
    dispatch(updateBlog(updatedBlog))
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      dispatch(deleteBlog(blog.id))
    }
  }
}

export default blogSlice.reducer
