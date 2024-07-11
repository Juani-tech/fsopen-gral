import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import { getAll, setToken } from './services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'
import loginService from './services/login'
import { useUserDispatch, useUserValue } from './UserContext'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const user = useUserValue()
  const blogFormRef = useRef()

  // Without useEffect it raises a warning
  useEffect(() => {
    userDispatch({ type: 'GET_PREVIOUS_SESSION' })
  })

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
  })

  if (result.isError) {
    return (
      <div>anecdote service not available due to problems in the server</div>
    )
  } else if (result.isLoading) {
    return <div>loading blogs</div>
  }

  const blogs = result.data

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user.token)
      userDispatch({
        type: 'SET',
        payload: user,
      })

      notificationDispatch({
        type: 'SET_SUCCESS',
        payload: `Welcome ${user.name}`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    } catch (error) {
      notificationDispatch({
        type: 'SET_ERROR',
        payload: 'Wrong credentials',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'RESET' })
  }

  if (user === null) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification></Notification>{' '}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input data-testid="username" type="text" name="username" />
          </div>
          <div>
            password
            <input data-testid="password" type="password" name="password" />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>

        <Notification></Notification>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>

        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogsForm />
        </Togglable>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} username={user.username} />
        ))}
      </div>
    )
  }
}

export default App
