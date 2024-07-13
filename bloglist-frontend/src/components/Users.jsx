import { useState } from 'react'
import { setErrorNotification } from '../reducers/notificationReducer'
import { getUsersWithBlogs } from '../services/user'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material'

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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Users</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersWithBlogs.map((userWithBlogs) => {
              return (
                <TableRow key={userWithBlogs.id}>
                  <TableCell>
                    <Link to={`/users/${userWithBlogs.id}`}>
                      {userWithBlogs.name}
                    </Link>
                  </TableCell>
                  <TableCell>{userWithBlogs.blogs.length}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
