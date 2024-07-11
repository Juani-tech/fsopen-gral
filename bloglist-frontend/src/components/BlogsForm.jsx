import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { create } from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'

const BlogsForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notificationDispatch({
        type: 'SET_SUCCESS',
        payload: `A new blog ${newBlog.title} by ${newBlog.author} added`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    },
    onError: (error) => {
      console.log('Error: ', error)
      notificationDispatch({
        type: 'SET_ERROR',
        payload: 'Error adding the blog',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    },
  })

  const addBlog = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form id="blogForm" onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid="title"
            id="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author"
            id="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url"
            id="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogsForm
