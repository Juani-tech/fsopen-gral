import { createSlice } from '@reduxjs/toolkit'
import {
  setErrorNotification,
  setSuccessNotification,
} from './notificationReducer'
import { useEffect } from 'react'
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
  console.log('Ejecutando initialize...')
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    console.log('Blogs: ', blogs)
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

export const addComment = (blog, comment) => {
  return async (dispatch) => {
    blogService
      .postComment(blog.id, comment)
      .then((response) => {
        const updatedBlog = { ...blog, comments: [...blog.comments, response] }
        dispatch(updateBlog(updatedBlog))
      })
      .catch((error) => console.log('error when adding comment: ', error))
  }
}

export default blogSlice.reducer
