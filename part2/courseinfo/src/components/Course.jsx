import Header from "./Header";
import Content from "./Content";
const Course = ({ course }) => {
  return (
    <div>
      <Header headerText={course.name}></Header>
      <Content parts={course.parts}></Content>
    </div>
  );
};

export default Course;
