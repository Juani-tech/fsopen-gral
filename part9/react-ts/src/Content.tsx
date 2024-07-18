import { CoursePart } from "./courseParts";
import Part from "./Part";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  const courseParts = props.courseParts;
  return (
    <>
      {courseParts.map((part) => (
        <Part part={part}></Part>
      ))}
    </>
  );
};

export default Content;
