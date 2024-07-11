import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { update, remove } from '../services/blogs'
import { useQueryClient } from '@tanstack/react-query'

const Blog = ({ blog, username }) => {
  const queryClient = useQueryClient()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const updateBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )

      queryClient.setQueryData(['blogs'], updatedBlogs)
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: remove,
    onSuccess: (removedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.filter((blog) => {
        return blog.id !== removedBlog.id
      })

      queryClient.setQueryData(['blogs'], updatedBlogs)
    },
  })

  const handleLike = (blog) => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 })
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(blog)
    }
  }

  const [visible, setVisible] = useState(false)

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
          likes {blog.likes}{' '}
          <button data-testid="like-button" onClick={() => handleLike(blog)}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === username && (
          <button
            onClick={() => {
              handleRemove(blog)
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
