import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'

const Menu = () => {
  const dispatch = useDispatch()
  const menuStyle = {
    paddingRight: 5,
  }
  const user = useSelector((state) => state.user)
  return (
    <div>
      <Link style={menuStyle} to="/">
        blogs
      </Link>
      <Link style={menuStyle} to="/users">
        users
      </Link>
      <span style={menuStyle}>{user.name} logged in</span>
      <button style={menuStyle} onClick={() => dispatch(logout())}>
        logout
      </button>
    </div>
  )
}

export default Menu
