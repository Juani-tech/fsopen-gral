import { useEffect, useState } from 'react'
import { getUserWithBlogsById } from '../services/user'
import { useMatch } from 'react-router-dom'

const User = () => {
  const match = useMatch('/users/:id')
  const [blogsFromUser, setBlogsFromUser] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!match) return

    const userId = match.params.id

    const fetchUser = async () => {
      const userWithBlogs = await getUserWithBlogsById(userId)
      if (userWithBlogs) {
        setBlogsFromUser(userWithBlogs.blogs)
        setUser(userWithBlogs.name)
      }
    }

    fetchUser()
  }, [match])

  return (
    <div>
      {user && <h2>{user}</h2>}
      <h3>Added blogs</h3>
      <ul>
        {blogsFromUser.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>
        })}
      </ul>
    </div>
  )
}

export default User
