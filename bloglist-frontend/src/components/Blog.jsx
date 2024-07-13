import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { likeBlog, removeBlog, addComment } from '../reducers/blogReducer'
import { Button, TextField } from '@mui/material'
import Divider from '@mui/material/Divider'
import { createTheme } from '@mui/material/styles'
import { blue } from '@mui/material/colors'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

const theme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
      darker: blue[900],
    },
  },
})

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

  const sectionStyle = {
    paddingTop: '1em',
    paddingBottom: '1em',
  }

  return (
    <div className="blog">
      <div style={{ padding: '1em 0 1em 0' }}>
        <h1>{blog.title}</h1>
        <em>{blog.author}</em>
      </div>
      <Divider></Divider>
      <div>
        <p>{blog.url}</p>
        <Divider></Divider>
        <div style={sectionStyle}>
          <span style={{ marginRight: '1em' }}>{blog.likes} likes</span>
          <Button
            data-testid="like-button"
            sx={{ bgcolor: 'primary.light', color: 'black' }}
            onClick={() => dispatch(likeBlog(blog))}
          >
            like
          </Button>
        </div>
        <Divider></Divider>
        <div style={sectionStyle}>Added by {blog.user.name}</div>
        {blog.user.username === user.username && (
          <Button
            to={'/'}
            sx={{ bgcolor: 'primary.light', color: 'black' }}
            onClick={() => {
              dispatch(removeBlog(blog))
            }}
          >
            remove
          </Button>
        )}
        <h2>Comments</h2>
        <form onSubmit={onComment}>
          <TextField
            id="comment"
            type="text"
            value={comment}
            size="small"
            onChange={({ target }) => setComment(target.value)}
          ></TextField>

          <Button
            sx={{
              bgcolor: 'primary.light',
              color: 'black',
              marginLeft: '1em',
              height: '3em',
            }}
          >
            add comment
          </Button>
        </form>
        <List>
          {blog.comments.map((comment, index) => {
            return (
              <>
                <ListItem key={comment.id || index}>{comment.content}</ListItem>
                {comment !== blog.comments.slice(-1)[0] ? (
                  <Divider></Divider>
                ) : null}
              </>
            )
          })}
        </List>
        {/* <ul>
        </ul> */}
      </div>
    </div>
  )
}

export default Blog
