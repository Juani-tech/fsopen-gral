import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notifications)
  const isError = notification.isError
  const content = notification.content
  console.log('isError:', isError)
  console.log('content:', content)
  // if (message === null) {
  //   return null
  // }

  if (!content) {
    return null
  }

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
