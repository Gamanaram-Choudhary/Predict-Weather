import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("Delhi");
  const [inputName, setInputName] = useState("Delhi");
  const [Value, setValue] = useState([]);
  const API_KEY = "39eca63a85940773bae9029e3682fbf3";

  const getWeatherDetails = (name, lat, lon) => {
    const apiResult = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(apiResult)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const uniqueForecastDays = [];
        const fiveDaysForecastDays = data.list.filter((forecast) => {
          const forecastDate = new Date(forecast.dt_txt).getDate();
          if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
          }
        });
        // console.log(fiveDaysForecastDays);
        setValue(fiveDaysForecastDays);
        if (!inputValue) {
          setInputName(name.toUpperCase());
          return;
        }
        setInputName(inputValue.toUpperCase());
      })
      .catch(() => {
        alert(`An Error occurred while fetching the data of city ${name}.`);
      });
  };

  const currentWeather = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const apiLink = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
        fetch(apiLink)
          .then((res) => res.json())
          .then((data) => {
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
            setInputName(name.toUpperCase());
          })
          .catch(() => {
            alert("An Error occurred while fetching the cityname!.");
          });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Geolocation request denied. Please reset location permission to grant access again."
          );
        } else {
          alert(error.code);
        }
      }
    );
  };

  const getCityCordinates = () => {
    const cityName = inputValue.trim();
    if (!cityName) return alert("City name can't be empty.");
    const apiLink = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${1}&appid=${API_KEY}`;
    fetch(apiLink)
      .then((res) => res.json())
      .then((data) => {
        if (data.length == 0)
          return alert(`No cordinates found for city ${cityName}.`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
        setInputValue("");
        // console.log(data);
      })
      .catch(() => {
        alert("An Error occurred while fetching the cordinates!.");
      });
  };
  useEffect(getCityCordinates, []);

  return (
    <>
      <h1>Weather Dashboard</h1>

      <div className="container">
        <div className="weather-input">
          <h3 className="cityname">Enter a City Name</h3>
          <input
            type="text"
            placeholder="E.g. , New York , Mumbai"
            className="input-city"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="search-btn" onClick={getCityCordinates}>
            Search
          </button>
          <h3 className="separator"></h3>
          <button className="location-btn" onClick={currentWeather}>
            Use Current Location
          </button>
        </div>

        <div className="weather-data">
          <div className="current-weather">
            <div className="details">
              {Value.map(function (val, index) {
                if (index > 0) return;
                return (
                  <div key={index}>
                    <h2>
                      {inputName}({val.dt_txt.split(" ")[0]})
                    </h2>
                    <h4>Temperature:{(val.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind:{val.wind.speed} m/s</h4>
                    <h4>Humadity:{val.main.humidity}%</h4>
                  </div>
                );
              })}
            </div>
            <div className="icon">
              {Value.map(function (val, index) {
                if (index > 0) return;
                return (
                  <div key={index}>
                    <img
                      src={`https://openweathermap.org/img/wn/${val.weather[0].icon}@4x.png`}
                      alt="weather-icon"
                    />
                    <h4>{val.weather[0].description}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="days-forecast">
        <h2>5-Days-Forecast</h2>
        <ul className="weather-cards">
          {Value.map((val, index) => {
            if (Value.length == 6) if (index == 0) return;
            return (
              <li className="card" key={index}>
                <h3>{val.dt_txt.split(" ")[0]}</h3>
                <img
                  src={`https://openweathermap.org/img/wn/${val.weather[0].icon}@2x.png`}
                  alt="weather-icon"
                />
                <h4>Temp: {(val.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: {val.wind.speed} m/s</h4>
                <h4>Humidity: {val.main.humidity}%</h4>{" "}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
export default App;
