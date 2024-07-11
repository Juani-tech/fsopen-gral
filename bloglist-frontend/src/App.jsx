import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import { getAll, setToken } from './services/blogs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './NotificationContext'
import loginService from './services/login'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('USER: ', user)
      setUser(user)
      setToken(user.token)
    }
  }, [])

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

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs))
  // }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

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
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification></Notification>{' '}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
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
