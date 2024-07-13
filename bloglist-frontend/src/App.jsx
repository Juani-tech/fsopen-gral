import { useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import { initializeBlogs } from './reducers/blogReducer'
import { getPreviousLogin } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import { Routes, Route, useMatch } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Menu from './components/Menu'
import { useEffect } from 'react'
import { Container } from '@mui/material'
import Login from './services/login'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  dispatch(getPreviousLogin())

  const user = useSelector((state) => state.user)

  const blogs = useSelector((state) => state.blogs)
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (user === null) {
    return (
      <Container>
        <LoginForm></LoginForm>
      </Container>
    )
  } else {
    return (
      <Container>
        <h2>Blog App</h2>
        <Notification></Notification>
        <Menu></Menu>
        {/* <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogsForm />
        </Togglable> */}

        <Routes>
          <Route path="/" element={<BlogList></BlogList>} />
          <Route path="/login" element={<LoginForm></LoginForm>}></Route>
          <Route path="/create" element={<BlogsForm></BlogsForm>}></Route>
          <Route path="/users" element={<Users></Users>} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
        </Routes>
      </Container>
    )
  }
}

export default App
