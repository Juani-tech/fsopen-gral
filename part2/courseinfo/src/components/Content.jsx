import Part from "./Part";

const Content = ({ parts }) => {
  const totalExercises = parts.reduce(
    (accumulator, part) => accumulator + part.exercises,
    0
  );
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises}></Part>
      ))}
      <strong>
        <Part name="total of exercises: " exercises={totalExercises}></Part>
      </strong>
    </div>
  );
};

export default Content;
