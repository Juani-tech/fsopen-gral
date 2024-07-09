/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import countriesService from "./services/countriesService";

const ShowCountryInformation = ({ country }) => {
  const [weather, setWeather] = useState(null);
  console.log("lating tiene: ", country.latlng);
  useEffect(() => {
    countriesService
      .getWeatherFrom(country.latlng[0], country.latlng[1])
      .then((response) => {
        setWeather(response);
        console.log("Weather response: ", response);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });
  }, [country.latlng]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages</h2>
      <ul>
        {/* Object.values(country.languages) devuelve un iterable con los valores del diccionario de languages */}
        {Object.values(country.languages).map((language) => {
          return <li key={language}>{language}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt="flag" width="100" height="100"></img>
      <h2>Weather in {country.capital}</h2>
      {weather && (
        <p>
          Temperature: {weather.temperature}°C, Conditions: {weather.conditions}
        </p>
      )}
    </div>
  );
};

const CountriesContainer = ({ countriesArray, setCountries }) => {
  if (countriesArray.length === 0) {
    return null;
  }
  if (countriesArray.length === 1) {
    return <ShowCountryInformation country={countriesArray[0]} />;
  }
  if (countriesArray.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  return (
    <ul>
      {countriesArray.map((country) => {
        return (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => setCountries([country])}>show</button>
          </li>
        );
      })}
    </ul>
  );
};

function App() {
  const [value, setValue] = useState("");
  const [country, setCountry] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("Entre aca");
    if (country) {
      countriesService.get().then((response) => {
        const countriesArray = response.filter((element) => {
          return element.name.common
            .toLowerCase()
            .includes(country.toLowerCase());
        });
        setCountries(countriesArray);
        setCountry(null);
      });
    }
  }, [country]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (event) => {
    event.preventDefault();
    setCountry(value);
    setCountries([]);
  };

  return (
    <>
      <form onSubmit={onSearch}>
        <label htmlFor="country">find countries </label>
        <input type="text" name="country" onChange={handleChange}></input>
        <button type="submit">search</button>
      </form>
      <CountriesContainer
        countriesArray={countries}
        setCountries={setCountries}
      />
    </>
  );
}

export default App;
