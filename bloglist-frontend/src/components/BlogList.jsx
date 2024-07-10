import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  // console.log('Username received: ', username)
  // console.log('blog received in Blog', blog)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const user = useSelector((state) => state.user)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        {!visible && (
          <button data-testid="view-button" onClick={toggleVisibility}>
            view
          </button>
        )}
        {visible && (
          <button data-testid="hide-button" onClick={toggleVisibility}>
            hide
          </button>
        )}
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button
            data-testid="like-button"
            onClick={() => dispatch(likeBlog(blog))}
          >
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && (
          <button
            onClick={() => {
              dispatch(removeBlog(blog))
            }}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => blogs)
  return blogs.map((blog) => {
    return <Blog key={blog.id} blog={blog}></Blog>
  })
}

export default BlogList
