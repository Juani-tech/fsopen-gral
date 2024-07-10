import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import blogService from './services/blogs'
import { useNotificationDispatch } from './NotificationContext'
import loginService from './services/login'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('USER: ', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
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

  const addBlog = (blog) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blog)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        notificationDispatch({
          type: 'SET_SUCCESS',
          payload: `A new blog ${blog.title} by ${blog.author} added`,
        })
        setTimeout(() => {
          notificationDispatch({ type: 'RESET' })
        }, 5000)
      })
      .catch((error) => {
        console.error(error)
        notificationDispatch({
          type: 'SET_ERROR',
          payload: `Error adding blog ${blog.title} by ${blog.author}`,
        })
        setTimeout(() => {
          notificationDispatch({ type: 'RESET' })
        }, 5000)
      })
  }

  const updateBlog = async (blogId, updatedBlog) => {
    console.log('Updating blogs')
    try {
      await blogService.update(blogId, updatedBlog)
      setBlogs(blogs.map((blog) => (blog.id !== blogId ? blog : updatedBlog)))
    } catch (error) {
      console.error(error)
    }
  }

  const sortByLikes = () => {
    console.log('Sorting...')
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  const removeBlog = (blog) => {
    console.log('Removing blog')
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== blog.id))
        })
        .catch((error) => {
          console.error(error)
        })
    }
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
          <BlogsForm createBlog={addBlog} />
        </Togglable>
        <button
          onClick={() => {
            sortByLikes()
          }}
        >
          Sort by likes
        </button>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            username={user.username}
          />
        ))}
      </div>
    )
  }
}

export default App
