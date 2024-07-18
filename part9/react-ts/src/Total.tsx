import { Course } from "./Content";

interface TotalProps {
  courseParts: Course[];
}

const Total = (props: TotalProps) => {
  const totalExercises = props.courseParts.reduce(
    (partialSum, part) => partialSum + part.exerciseCount,
    0
  );
  return <p>Number of exercises {totalExercises}</p>;
};

export default Total;
