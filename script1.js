const apiKey = "e4b5251ee48a1a3a03c95f1b4be2a02e";
const apiUri = "https://api.openweathermap.org/data/2.5/weather?";
const forecastApiUri = "https://api.openweathermap.org/data/2.5/forecast?";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const city = document.getElementById("city");
const country = document.getElementById("country");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value; //получает текст 
  if (cityName === "") return; //проверка пустое ли поля
  getWeatherData(cityName);//вызывает функция текущей погоды
  getWeatherForecast(cityName); // Получаем прогноз погоды
});

const getWeatherData = async (cityName) => {
  const url = `${apiUri}appid=${apiKey}&q=${cityName}&units=metric`;//${apiUri}: добавляем базовый URL.
                                                                    //appid=${apiKey}: добавляем ключ API
                                                                    //q=${cityName}: добавляем название города.
                                                                    //units=metric: указываем, что температура должна быть в градусах Цельсия.



  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      updateWeatherUI(data);
    } else {
      console.error("Error fetching data:", response.status);
      alert("City not found. Please try again.");
    }
  } catch (error) { //блок для обработки ошибок
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
};

const getWeatherForecast = async (cityName) => {
  const url = `${forecastApiUri}appid=${apiKey}&q=${cityName}&units=metric`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      updateForecastUI(data);
    } else {
      console.error("Error fetching forecast data:", response.status);
      alert("Unable to fetch forecast data. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching the forecast.");
  }
};

const updateWeatherUI = (data) => {
  city.textContent = data.name;
  country.textContent = data.sys.country;
  temperature.textContent = Math.round(data.main.temp) + "°C"; //округление число
  description.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity + "%";
  windSpeed.textContent = data.wind.speed + " m/s";
  pressure.textContent = data.main.pressure + " hPa";
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

const updateForecastUI = (data) => {
  forecastContainer.innerHTML = ""; // Очищаем старые данные

  // Пробегаемся по прогнозу, выбирая данные для каждого дня
  for (let i = 0; i < data.list.length; i += 8) { // каждый 8-й элемент - это следующий день
    const forecast = data.list[i];
    const date = new Date(forecast.dt_txt).toLocaleDateString();
    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    const icon = forecast.weather[0].icon;

    const forecastDay = document.createElement("div");
    forecastDay.classList.add("forecast-day");
    forecastDay.innerHTML = `
      <h4>${date}</h4>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p>${description}</p>
      <p>${temp}°C</p>
    `;
    
    forecastContainer.appendChild(forecastDay);
  }
};
