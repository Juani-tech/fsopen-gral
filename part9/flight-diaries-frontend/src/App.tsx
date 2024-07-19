import { DiaryEntry } from "./types";
import { getAll } from "./services/diaries";
import { useEffect, useState } from "react";
import Diary from "./components/Diary";
import DiaryForm from "./components/DiaryForm";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    getAll().then((diaries) => setDiaries(diaries));
  }, []);
  const notificationStyle = {
    color: "red",
  };

  return (
    <div>
      {notification !== "" && <h3 style={notificationStyle}>{notification}</h3>}
      <h2>Add new entry</h2>
      <DiaryForm
        diaries={diaries}
        setDiaries={setDiaries}
        setNotification={setNotification}
      ></DiaryForm>
      <h2>Diary Entries</h2>
      <div>
        {diaries.map((diary) => {
          return <Diary key={diary.id} diary={diary}></Diary>;
        })}
      </div>
    </div>
  );
}
export default App;
