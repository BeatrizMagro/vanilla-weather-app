function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#city");
  city.innerHTML = response.data.city;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.condition.description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.temperature.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
  getForecast(response.data.city);
}

function search(city) {
  let apiKey = "5d058618c14cod5a413bf1b34t180400";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then((response) => {
    showTemperatureData();
    displayTemperature(response);
  });
}

function showTemperatureData() {
  document.querySelector("#temperature-data").style.display = "contents";
}

let celsiusTemperature = null;
let hasAlreadyConvertedToFahrenheit = false;
let hasAlreadyConvertedToCelsius = true;

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  if (hasAlreadyConvertedToFahrenheit === true) {
    return;
  }

  let temperatureElement = document.querySelector("#temperature");
  let currentTemperature = temperatureElement.innerHTML;

  let fahrenheitTemperature = (currentTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  hasAlreadyConvertedToFahrenheit = true;
  hasAlreadyConvertedToCelsius = false;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();

  if (hasAlreadyConvertedToCelsius === true) {
    return;
  }

  let temperatureElement = document.querySelector("#temperature");
  let currentTemperature = temperatureElement.innerHTML;
  let celsiusTemperature = ((currentTemperature - 32) * 5) / 9;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  hasAlreadyConvertedToCelsius = true;
  hasAlreadyConvertedToFahrenheit = false;
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

document.addEventListener("DOMContentLoaded", function () {
  let nightModeToggle = document.getElementById("night-mode-toggle");

  nightModeToggle.addEventListener("click", function () {
    toggleNightMode();
  });

  function toggleNightMode() {
    document.body.classList.toggle("night-mode");
    var container = document.querySelector(".container");
    container.style.backgroundColor = document.body.classList.contains(
      "night-mode"
    )
      ? "#222831"
      : "";
    let city = document.getElementById("city");
    city.style.color = document.body.classList.contains("night-mode")
      ? "#929aab"
      : "";
    let weatherTemperatureStrong = document.querySelector(
      ".weather-temperature strong"
    );
    weatherTemperatureStrong.style.color = document.body.classList.contains(
      "night-mode"
    )
      ? "#929aab"
      : "";

    let weatherTemperatureUnits = document.querySelector(
      ".weather-temperature .units"
    );
    weatherTemperatureUnits.style.color = document.body.classList.contains(
      "night-mode"
    )
      ? "#929aab"
      : "";

    let listItems = document.querySelectorAll("li");
    listItems.forEach(function (li) {
      li.style.color = document.body.classList.contains("night-mode")
        ? "#929aab"
        : "";
    });

    let bodyBackgroundColor = document.body.classList.contains("night-mode")
      ? "#474a56"
      : "";
    document.body.style.backgroundColor = bodyBackgroundColor;
  }
});

function getForecast(city) {
  let apiKey = "5d058618c14cod5a413bf1b34t180400";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
  console.log(apiUrl);
}

function displayForecast(response) {
  console.log(response.data);

  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
  <div class="weather-forecast-day">
    <div class="weather-forecast-date">${formatDay(day.time)}</div>
    <div class="weather-forecast-icon">
      <img src="${day.condition.icon_url}" />
    </div>
    <div class="weather-forecast-temperatures">
      <div class="weather-forecast-temperature">
        <strong>${Math.round(day.temperature.maximum)}º</strong>
      </div>
      <div class="weather-forecast-temperature">${Math.round(
        day.temperature.minimum
      )}º</div>
    </div>
  </div>
  `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

getForecast("Lisbon");
