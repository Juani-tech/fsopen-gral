import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const get = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getWeatherFrom = ({ lat, lon }) => {
  const apiUrl = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
  const request = axios.get(apiUrl);
  return request.then((response) => response.data);
};

export default { get, getWeatherFrom };
