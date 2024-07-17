interface HeihgtAndCoroporalMass {
  height: number;
  corporalMass: number;
}

export const parseBmiArguments = (args: string[]): HeihgtAndCoroporalMass => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      corporalMass: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

interface BmiReport {
  height: number;
  mass: number;
  bmi: string;
}
export const calculateBmi = (height: number, mass: number): BmiReport => {
  const heightInMeters = height / 100;
  const bmi = mass / (heightInMeters * heightInMeters);
  let bmiDescription: string;
  if (bmi < 18.5) {
    bmiDescription = "Light weight";
  } else if (bmi >= 18.5 && bmi < 24.99) {
    bmiDescription = "Normal weight";
  } else if (bmi >= 25 && bmi < 30) {
    bmiDescription = "Overweight";
  } else {
    bmiDescription = "Obesity";
  }
  return {
    height,
    mass,
    bmi: bmiDescription,
  };
};

// console.log(calculateBmi(180, 74));
