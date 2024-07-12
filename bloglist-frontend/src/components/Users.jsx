import { useState } from 'react'
import { setErrorNotification } from '../reducers/notificationReducer'
import { getUsersWithBlogs } from '../services/user'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  const [usersWithBlogs, setUsersWithBlogs] = useState([])

  useEffect(() => {
    getUsersWithBlogs()
      .then((usersWithBlogs) => {
        setUsersWithBlogs(usersWithBlogs)
      })
      .catch((error) => {
        setErrorNotification(`Error getting users. ${error}`, 5)
        return null
      })
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <caption>Users with their ammount of blogs published</caption>
        <thead>
          <tr>
            <th>Users</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {usersWithBlogs.map((userWithBlogs) => {
            return (
              <tr key={userWithBlogs.id}>
                <td>
                  <Link to={`/users/${userWithBlogs.id}`}>
                    {userWithBlogs.name}
                  </Link>
                </td>
                <td>{userWithBlogs.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Users
