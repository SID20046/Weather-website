const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");

const API_key = "8689d172adbb21a6b244776e6cdc0369";

const createWeatherCard = (cityName, weatherItem,index) => {
    if(index === 0){

        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${(weatherItem.wind.speed)}M/S</h4>
                    <h4>Humidity: ${(weatherItem.main.humidity)}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    }
    else{
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                <h4>Tempe: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${(weatherItem.wind.speed)}M/S</h4>
                <h4>Humidity: ${(weatherItem.main.humidity)}%</h4>
            </li>`;
    }
    
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value="";
        currentWeatherDiv.innerHTML="";
        weatherCardDiv.innerHTML="";

        // console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem,index) => {
            if(index === 0){
                currentWeatherDiv.innerHTML=createWeatherCard(cityName, weatherItem , index);
            }
            else{
                weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem , index));
            }
            
        });
    }).catch(() => {
        alert("an error occured while fetching the weather forecast")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        console.log(data)
        if (!data.length) return alert(`no coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(() => {
        alert("an error occured for fetching data")
    });
}

const getUserCoordinates=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
            const {latitude,longitude}=position.coords;
            const  REVERSE_GEOCODING_URL=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name,latitude,longitude);
            }).catch(() => {
                alert("an error occured for fetching CITY")
            });

        },
        error=>{
            if (error.code ===error.PERMISSION_DENIED) {
                alert("Geolocation request denied. please reset location permission to grant access.")
            }
        }    
    )
}


searchButton.addEventListener("click", ()=>{
    getCityCoordinates();
    changeColorTemporary("rgb(13 13 181)"); 
}
)

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        changeColorTemporary("rgb(13 13 181)"); 
      getCityCoordinates();
      console.log("Enter key was pressed.");
    }
  });
  
  locationButton.addEventListener("click",()=>{
    getUserCoordinates();
    lbuttoncolorchange("#3b3838");
  }
    
    );

  function changeColorTemporary(color) {
    
    searchButton.style.backgroundColor = color;
  
    setTimeout(function() {
      searchButton.style.backgroundColor = ""; 
    }, 100); 
  }

  function lbuttoncolorchange(color) {
    
    locationButton.style.backgroundColor = color;
  
    setTimeout(function() {
      locationButton.style.backgroundColor = ""; 
    }, 100); 
  }
