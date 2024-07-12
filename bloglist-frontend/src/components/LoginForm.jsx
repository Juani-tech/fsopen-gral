import { useDispatch } from 'react-redux'
import Notification from './Notification'
import { login } from '../reducers/userReducer'
import { TextField, Button, Container } from '@mui/material'

const LoginForm = () => {
  const dispatch = useDispatch()
  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    dispatch(login({ username, password }))
  }
  return (
    <div>
      <h2>login to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            data-testid="username"
            type="text"
            name="username"
          />
        </div>
        <div>
          <TextField
            label="password"
            data-testid="password"
            type="password"
            name="password"
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
