import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => {
    return state.notifications;
  });
  const visibleStyle = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  const notVisibleStyle = {
    display: "none",
  };

  if (notification === "") {
    return <div style={notVisibleStyle}></div>;
  } else {
    return <div style={visibleStyle}>{notification}</div>;
  }
};

export default Notification;
