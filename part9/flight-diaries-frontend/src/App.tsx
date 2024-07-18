import { DiaryEntry } from "./types";
import { getAll } from "./services/diaries";
import { useEffect, useState } from "react";
import Diary from "./components/Diary";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAll().then((diaries) => setDiaries(diaries));
  }, []);

  return (
    <div>
      <h2>Diary Entries</h2>
      <div>
        {diaries.map((diary) => {
          return <Diary diary={diary}></Diary>;
        })}
      </div>
    </div>
  );
}
export default App;
