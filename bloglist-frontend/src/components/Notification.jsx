import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useSelector((state) => state.notifications)
  const content = notification.content

  if (!content) {
    return null
  }

  const isError = notification.isError
  let severity
  isError ? (severity = 'error') : (severity = 'success')

  // let color
  // isError ? (color = 'red') : (color = 'green')

  // const notificationStyle = {
  //   color: color,
  //   background: 'lightgrey',
  //   fontSize: 20,
  //   borderStyle: 'solid',
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 10,
  // }

  // return <div style={notificationStyle}>{content}</div>
  return <div>{content && <Alert severity={severity}>{content}</Alert>}</div>
}

export default Notification
