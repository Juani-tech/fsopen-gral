import { useState } from "react";

const StatisticsLine = ({ text, count }) => {
  return (
    <tr>
      <td>
        {text} {count}
      </td>
    </tr>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad, goodText, neutralText, badText }) => {
  const calcAverage = () => {
    return good + neutral + bad == 0
      ? 0
      : (good - bad) / (good + neutral + bad);
  };

  const calcPositivePercentage = () => {
    return good == 0 ? good : (good * 100) / (good + neutral + bad);
  };
  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>;
  } else {
    return (
      <table>
        <tbody>
          <StatisticsLine text={goodText} count={good}></StatisticsLine>
          <StatisticsLine text={neutralText} count={neutral}></StatisticsLine>
          <StatisticsLine text={badText} count={bad}></StatisticsLine>
          <StatisticsLine
            text="all"
            count={good + neutral + bad}
          ></StatisticsLine>
          <StatisticsLine text="average" count={calcAverage()}></StatisticsLine>
          <StatisticsLine
            text="positive"
            count={String(calcPositivePercentage()) + "%"}
          ></StatisticsLine>
        </tbody>
      </table>
    );
  }
};

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodText = "good";
  const neutralText = "neutral";
  const badText = "bad";

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button
        onClick={() => {
          setGood(good + 1);
        }}
        text={goodText}
      ></Button>
      <Button
        onClick={() => {
          setNeutral(neutral + 1);
        }}
        text={neutralText}
      ></Button>
      <Button
        onClick={() => {
          setBad(bad + 1);
        }}
        text={badText}
      ></Button>
      <h2>Statistics</h2>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        goodText={goodText}
        neutralText={neutralText}
        badText={badText}
      ></Statistics>
    </div>
  );
};

export default App;
