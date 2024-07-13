import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { TextField, Button } from '@mui/material'

const BlogsForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    dispatch(createBlog({ title, author, url }))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form id="blogForm" onSubmit={addBlog}>
        <div>
          <TextField
            id="title"
            label="title"
            data-testid="title"
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          ></TextField>
        </div>
        <div>
          <TextField
            data-testid="author"
            id="author"
            label="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          ></TextField>
        </div>
        <div>
          <TextField
            data-testid="url"
            id="url"
            label="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          ></TextField>
        </div>
        <Button variant="contained" color="primary" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogsForm
