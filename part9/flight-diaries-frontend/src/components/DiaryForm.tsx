import React, { useState } from "react";
import { createDiary } from "../services/diaries";
import { DiaryEntry, Visibility, Weather } from "../types";
import axios from "axios";

const isWeather = (param: string): param is Weather => {
  return Object.values(Weather)
    .map((v) => v.toString())
    .includes(param);
};

const isVisibility = (param: string): param is Visibility => {
  return Object.values(Visibility)
    .map((v) => v.toString())
    .includes(param);
};

export interface DiaryProps {
  diaries: DiaryEntry[];
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

const DiaryForm = (props: DiaryProps) => {
  const [date, setDate] = useState(new Date());
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");

  const onAdd = (event: React.SyntheticEvent) => {
    event.preventDefault();

    console.log("date: ", date);
    if (!isWeather(weather)) {
      props.setNotification("Error: incorrect weather: " + weather);
      throw new Error("Error: incorrect weather: " + weather);
    }
    if (!isVisibility(visibility)) {
      props.setNotification("Error: incorrect visibility: " + visibility);
      throw new Error("Error: incorrect visibility: " + visibility);
    }

    try {
      const stringDate: string = date.toString();
      createDiary({ date: stringDate, weather, visibility, comment }).then(
        (diary) => {
          props.setDiaries(props.diaries.concat(diary));
          setDate(new Date());
          setVisibility("");
          setWeather("");
          setComment("");
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        props.setNotification(error.message);
      } else {
        console.log("ERROR: ", error);
      }
    }
  };

  return (
    <form onSubmit={onAdd}>
      <div>
        date
        <input
          value="2024-07-18"
          type="date"
          onChange={(event) => setDate(new Date(event.target.value))}
        ></input>
      </div>
      <div>
        visibility{" "}
        {Object.values(Visibility).map((type) => (
          <span>
            {type}
            <input
              key={type}
              type="radio"
              onChange={() => setVisibility(type)}
            />
          </span>
        ))}
        {/* <input
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
        ></input> */}
      </div>
      <div>
        weather{" "}
        {Object.values(Weather).map((type) => (
          <span>
            {type}
            <input key={type} type="radio" onChange={() => setWeather(type)} />
          </span>
        ))}
      </div>
      <div>
        comment {" "}
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        ></input>
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default DiaryForm;
