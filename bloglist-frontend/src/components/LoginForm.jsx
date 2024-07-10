import { useDispatch } from 'react-redux'
import Notification from './Notification'
import { login } from '../reducers/userReducer'

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
          username
          <input data-testid="username" type="text" name="username" />
        </div>
        <div>
          password
          <input data-testid="password" type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
