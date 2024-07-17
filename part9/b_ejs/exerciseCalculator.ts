interface WeekValuesAndTarget {
  target: number;
  weekValues: number[];
}

export const parseExerciseCalculatorArguments = (
  args: string[]
): WeekValuesAndTarget => {
  console.log("parsing for: ", args);
  if (args.length < 10) throw new Error("Not enough arguments");
  if (args.length > 10) throw new Error("Too many arguments");

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error("Provided values were not numbers!");
  }
  const weekValuesArgs = args.slice(3, 10);
  const weekValues = weekValuesArgs.map((arg) => {
    const val = Number(arg);
    if (!isNaN(val)) {
      return val;
    } else {
      throw new Error("Provided values were not numbers!");
    }
  });
  return {
    target,
    weekValues,
  };
};

interface ExerciseReport {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription:
    | "Haven't even tried"
    | "Bad"
    | "Not that bad but could be better"
    | "Good";
  target: number;
  average: number;
}

export const getReport = (
  hoursByDay: number[],
  target: number
): ExerciseReport => {
  const sum = hoursByDay.reduce((partialSum, number) => partialSum + number, 0);
  const periodLength = hoursByDay.length;
  const trainingDays = hoursByDay.reduce(
    (partialSum, number) => (number === 0 ? partialSum + 0 : partialSum + 1),
    0
  );
  const average = sum / hoursByDay.length;
  const success = average > target ? true : false;
  let rating = Math.round(sum / hoursByDay.length);
  rating = rating > 3 ? 3 : rating;

  let ratingDescription:
    | "Haven't even tried"
    | "Bad"
    | "Not that bad but could be better"
    | "Good" = "Good"; // default value

  switch (rating) {
    case 0: {
      ratingDescription = "Haven't even tried";
      break;
    }
    case 1: {
      ratingDescription = "Bad";
      break;
    }
    case 2: {
      ratingDescription = "Not that bad but could be better";
      break;
    }
    case 3: {
      ratingDescription = "Good";
      break;
    }
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

// console.log(getReport([3, 0, 2, 4.5, 0, 3, 1], 2));

// try {
//   const { target, weekValues } = parseExerciseCalculatorArguments(process.argv);
//   console.log(getReport(weekValues, target));
// } catch (error: unknown) {
//   let errorMessage = "Something bad happened.";
//   if (error instanceof Error) {
//     errorMessage += " Error: " + error.message;
//   }
//   console.log(errorMessage);
// }
