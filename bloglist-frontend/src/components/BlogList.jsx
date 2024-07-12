import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

export const Blog = ({ blog }) => {
  // console.log('Username received: ', username)
  // console.log('blog received in Blog', blog)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  if (!blog) return null

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

  return (
    <div className="blog">
      <div>
        <h1>
          {blog.title} {blog.author}
        </h1>
      </div>
      <div className="togglableContent">
        <p>{blog.url}</p>
        <div>
          {blog.likes} likes
          <button
            data-testid="like-button"
            onClick={() => dispatch(likeBlog(blog))}
          >
            like
          </button>
        </div>
        <div>Added by {blog.user.name}</div>
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
    return (
      <Link key={blog.id} to={`/blogs/${blog.id}`}>
        {/* <Blog blog={blog}></Blog> */}
        <p>
          {blog.title} {blog.author}
        </p>
      </Link>
    )
  })
}

export default BlogList
