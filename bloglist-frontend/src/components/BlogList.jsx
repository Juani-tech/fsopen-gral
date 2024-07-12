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
  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

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
// blogs.map((blog) => {
//   return (
//     <Link key={blog.id} to={`/blogs/${blog.id}`}>
//       <div style={blogStyle}>
//         {blog.title} {blog.author}
//       </div>
//     </Link>
//   )
// })

export default BlogList
