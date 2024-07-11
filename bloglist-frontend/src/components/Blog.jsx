import { useState } from 'react'

const addLike = async (blog, setLikes, updateBlog) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1 }
  updateBlog(blog.id, updatedBlog)
  setLikes(updatedBlog.likes)
}

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const showWhenVisible = { display: visible ? '' : 'none' }

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
          likes {likes}{' '}
          <button
            data-testid="like-button"
            onClick={() => addLike(blog, setLikes, updateBlog)}
          >
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === username && (
          <button
            onClick={() => {
              removeBlog(blog)
            }}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
