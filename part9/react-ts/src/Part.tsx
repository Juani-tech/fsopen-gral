import { CoursePart } from "./courseParts";

const assertNever = (value: unknown): unknown => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface PartProps {
  part: CoursePart;
}

const Part = (props: PartProps) => {
  const part = props.part;
  switch (part.kind) {
    case "basic": {
      return (
        <div>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <em>{part.description}</em>
        </div>
      );
    }
    case "group": {
      return (
        <div>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <p>Project exercises: {part.groupProjectCount}</p>
        </div>
      );
    }
    case "background": {
      return (
        <div>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <em>{part.description}</em>
          <p>Submit to: {part.backgroundMaterial}</p>
        </div>
      );
    }
    case "special": {
      return (
        <div>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <em>{part.description}</em>
          <p>Requirements: {part.requirements}</p>
        </div>
      );
    }
    default: {
      assertNever(part);
      // throw new Error("Unhandled variant");
    }
  }
};

export default Part;
