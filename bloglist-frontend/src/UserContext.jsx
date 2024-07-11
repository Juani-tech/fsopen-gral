/* eslint-disable indent */
import { createContext, useReducer, useContext } from 'react'
import { setToken } from './services/blogs'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET': {
      return action.payload
    }
    case 'GET_PREVIOUS_SESSION': {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON && state === null) {
        const user = JSON.parse(loggedUserJSON)
        console.log('USER: ', user)
        setToken(user.token)
        return user
      } else {
        return state
      }
    }
    case 'RESET':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
