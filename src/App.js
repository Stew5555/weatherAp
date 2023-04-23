import React, { useState, useEffect } from 'react';


function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('san diego'); // Default city
  const apiKey = 'd697732be2f78579a1dba3c5a07ea044'




  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
        const data = await response.json();
        const next7DaysData = [];
        let currentDayOfWeek = null;
        data.list.forEach(forecast => {
          const forecastDate = new Date(forecast.dt * 1000);
          const dayOfWeek = forecastDate.getDay();
          if (currentDayOfWeek !== dayOfWeek) {
            next7DaysData.push(forecast);
            currentDayOfWeek = dayOfWeek;
          }
        });
        setWeatherData(next7DaysData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchWeatherData();
  }, [city, apiKey]);

  function handleCityChange(event) {
    setCity(event.target.value);
  }

  function getDayOfWeek(timestamp) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(timestamp * 1000);
    return daysOfWeek[date.getDay()];
  }

  function getCardClass(weather) {
    if (weather.toLowerCase().includes('scattered clouds')) {
      return 'scattered-clouds';
    } else if (weather.toLowerCase().includes('few clouds')) {
      return 'few-clouds';
    } else if (weather.toLowerCase().includes('clear sky')) {
      return 'clear-sky';
    } else if (weather.toLowerCase().includes('overcast clouds')) {
      return 'overcast-clouds';
    } else if (weather.toLowerCase().includes('broken clouds')) {
      return 'broken-clouds';
    }
    return '';
  }

  return (
    <div>
      <h1>7-Day Weather Forecast</h1>
      <div className='search-box'>
        <label className='styleForm'>
          <input placeholder='Search a city' type="text" value={city} onChange={handleCityChange} />
        </label>
      </div>

      {weatherData && (
        <div className="forecast-container">
          {weatherData.map((forecast, index) => (
            <div key={index} className={`card ${getCardClass(forecast.weather[0].description)}`}>
              <h2>{getDayOfWeek(forecast.dt)}</h2>
              <p>Temperature: {forecast.main.temp}°C</p>
              <p>Description: {forecast.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherPage;