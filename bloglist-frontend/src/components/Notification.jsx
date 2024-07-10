import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notifications)
  const content = notification.content
  if (!content) {
    return null
  }

  const isError = notification.isError

  let color

  isError ? (color = 'red') : (color = 'green')

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={notificationStyle}>{content}</div>
}

export default Notification
