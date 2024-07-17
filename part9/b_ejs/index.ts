import express from "express";
import { calculateBmi, parseBmiArguments } from "./bmiCalculator";
import {
  parseExerciseCalculatorArguments,
  getReport,
} from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const heightArg = req.query.height as string;
  const weightArg = req.query.weight as string;
  try {
    const { height, corporalMass } = parseBmiArguments([
      "",
      "",
      heightArg,
      weightArg,
    ]);
    const bmiReport = calculateBmi(height, corporalMass);
    res.send(bmiReport);
  } catch (error: unknown) {
    console.log("Error: ", error);
    res.send("malformatted parameters");
  }
});

app.post("/exercises", (req, res) => {
  // if (!req.body.target || !req.body.daily_exercises) {
  //   res.send("missing parameters");
  //   return;
  // }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const args: string[] = [
      "",
      "",
      req.body.target,
      ...req.body.daily_exercises,
    ];
    const { target, weekValues } = parseExerciseCalculatorArguments(args);
    const report = getReport(weekValues, target);
    res.send(report);
  } catch (error: unknown) {
    console.log("Error: ", error);
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
