import { DiaryEntry } from "../types";

interface DiaryProps {
  diary: DiaryEntry;
}

const Diary = (props: DiaryProps) => {
  const diary = props.diary;

  return (
    <>
      <h3>{diary.date}</h3>
      <p>Weather: {diary.weather}</p>
      <p>Visibility: {diary.visibility}</p>
    </>
  );
};

export default Diary;
