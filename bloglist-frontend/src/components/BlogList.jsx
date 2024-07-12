import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => blogs)

  return (
    <div>
      <h2>Blogs</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}> {blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
