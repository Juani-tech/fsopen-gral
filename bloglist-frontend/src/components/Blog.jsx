import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { likeBlog, removeBlog, addComment } from '../reducers/blogReducer'

export const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [comment, setComment] = useState('')

  if (!blog) return null

  const onComment = async (event) => {
    event.preventDefault()
    dispatch(addComment(blog, comment))
    setComment('')
  }

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
            to={'/'}
            onClick={() => {
              dispatch(removeBlog(blog))
            }}
          >
            remove
          </button>
        )}
        <h2>Comments</h2>
        <form onSubmit={onComment}>
          <input
            id="comment"
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          ></input>
          <button>add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) => {
            return <li key={comment.id || index}>{comment.content}</li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default Blog
