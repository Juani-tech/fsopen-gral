const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.courseName} {props.courseExercises}
    </p>
  );
};
const Content = (props) => {
  console.log(props);
  return (
    <div>
      <Part
        courseName={props.parts[0].name}
        courseExercises={props.parts[0].exercises}
      ></Part>
      <Part
        courseName={props.parts[1].name}
        courseExercises={props.parts[1].exercises}
      ></Part>
      <Part
        courseName={props.parts[2].name}
        courseExercises={props.parts[2].exercises}
      ></Part>
    </div>
  );
};

const Total = (props) => {
  return (
    <p>
      Number of exercises{" "}
      {props.parts[0].exercises +
        props.parts[1].exercises +
        props.parts[2].exercises}
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course}></Header>
      <Content parts={course.parts}></Content>
      <Total parts={course.parts}></Total>
    </div>
  );
};

export default App;
