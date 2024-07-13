import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { AppBar, Toolbar, IconButton, Button } from '@mui/material'

const Menu = () => {
  const dispatch = useDispatch()
  const menuStyle = {
    paddingRight: 5,
  }
  const user = useSelector((state) => state.user)

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/create">
          create blog
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Button color="inherit" onClick={() => dispatch(logout())}>
          logout
        </Button>
        {user ? <em>{user.name} logged in</em> : <Link to="/login">login</Link>}
      </Toolbar>
    </AppBar>
  )
}

export default Menu
