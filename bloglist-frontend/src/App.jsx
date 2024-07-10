import { useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import { initializeBlogs } from './reducers/blogReducer'
import { getPreviousLogin, login, logout } from './reducers/userReducer'
import LoginForm from './components/LoginForm'

const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  dispatch(initializeBlogs())
  dispatch(getPreviousLogin())

  const user = useSelector((state) => state.user)

  if (user === null) {
    return <LoginForm></LoginForm>
  } else {
    return (
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

        <BlogList></BlogList>
      </div>
    )
  }
}

export default App
