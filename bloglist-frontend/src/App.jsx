import { useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import BlogList, { Blog } from './components/BlogList'
import { initializeBlogs } from './reducers/blogReducer'
import { getPreviousLogin, logout } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  dispatch(initializeBlogs())
  dispatch(getPreviousLogin())

  const user = useSelector((state) => state.user)

  const blogs = useSelector((state) => state.blogs)
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  if (user === null) {
    return <LoginForm></LoginForm>
  } else {
    return (
      <>
        <div>
          <h2>blogs</h2>
          <Notification></Notification>
          <p>
            {user.username} logged in{' '}
            <button onClick={() => dispatch(logout())}>logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogsForm />
          </Togglable>
        </div>

        <Routes>
          <Route path="/" element={<BlogList></BlogList>} />
          <Route path="/users" element={<Users></Users>} />
          <Route path="/users/:id" element={<User />} />
          <Route path="blogs/:id" element={<Blog blog={blog} />} />
        </Routes>
      </>
    )
  }
}

export default App
