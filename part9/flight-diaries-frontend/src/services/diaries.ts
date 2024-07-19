import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";
const baseUrl = "http://localhost:3000/api/diaries";

export const getAll = async () => {
  const data = await axios
    .get<DiaryEntry[]>(baseUrl)
    .then((response) => response.data);
  return data;
};

export const createDiary = (object: NewDiaryEntry): Promise<DiaryEntry> => {
  const response = axios
    .post<DiaryEntry>(baseUrl, object)
    .then((res) => res.data);
  return response;
};
