// Your WeatherAPI Key
const API_KEY = 'b540e60ef1574039a2361312242110';
const BASE_URL = 'https://api.weatherapi.com/v1/';

// Get DOM elements
const citySearch = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const iconEl = document.getElementById('icon');
const forecastCardsEl = document.getElementById('forecast-cards');

// Fetch weather data based on city name
searchBtn.addEventListener('click', () => {
    const city = citySearch.value;
    if (city) {
        getWeatherData(city);
    }
});

// Function to get current weather and forecast data
function getWeatherData(city) {
    const currentWeatherUrl = `${BASE_URL}current.json?key=${API_KEY}&q=${city}`;
    const forecastUrl = `${BASE_URL}forecast.json?key=${API_KEY}&q=${city}&days=5`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Current weather fetch failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Error fetching current weather. Please check your API key or city name.');
        });

    // Fetch 5-day forecast
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Forecast fetch failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            alert('Error fetching forecast data. Please try again later.');
        });
}

// Update the current weather display
function updateCurrentWeather(data) {
    cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;
    tempEl.textContent = `${data.current.temp_c}°C`;
    descEl.textContent = data.current.condition.text;
    humidityEl.textContent = `Humidity: ${data.current.humidity}%`;
    windSpeedEl.textContent = `Wind Speed: ${data.current.wind_kph} km/h`;
    iconEl.src = `https:${data.current.condition.icon}`;
}

// Update the 5-day forecast
function updateForecast(data) {
    forecastCardsEl.innerHTML = ''; // Clear previous forecast

    if (data.forecast && data.forecast.forecastday.length > 0) {
        data.forecast.forecastday.forEach(day => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            // Create forecast card
            const card = document.createElement('div');
            card.classList.add('card');

            const dayEl = document.createElement('h4');
            dayEl.textContent = dayName;

            const iconEl = document.createElement('img');
            iconEl.src = `https:${day.day.condition.icon}`;

            const tempEl = document.createElement('p');
            tempEl.textContent = `${Math.round(day.day.avgtemp_c)}°C`;

            // Append to card
            card.appendChild(dayEl);
            card.appendChild(iconEl);
            card.appendChild(tempEl);

            // Append card to forecast section
            forecastCardsEl.appendChild(card);
        });
    } else {
        forecastCardsEl.innerHTML = '<p>No forecast data available.</p>';
    }
}

const countries = [
    { name: "India", elementTemp: "temp-india", elementHumidity: "humidity-india", elementWind: "wind-india" },
    { name: "New York", elementTemp: "temp-usa", elementHumidity: "humidity-usa", elementWind: "wind-usa" },
    { name: "United Arab Emirates", elementTemp: "temp-uae", elementHumidity: "humidity-uae", elementWind: "wind-uae" },
    { name: "Russia", elementTemp: "temp-russia", elementHumidity: "humidity-russia", elementWind: "wind-russia" },
    { name: "France", elementTemp: "temp-france", elementHumidity: "humidity-france", elementWind: "wind-france" }
];

// Function to fetch and update weather for all countries
function updateCountriesWeather() {
    countries.forEach(country => {
        const weatherUrl = `${BASE_URL}current.json?key=${API_KEY}&q=${country.name}`;

        fetch(weatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Weather fetch for ${country.name} failed with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById(country.elementTemp).textContent = `Temperature: ${data.current.temp_c}°C`;
                document.getElementById(country.elementHumidity).textContent = `Humidity: ${data.current.humidity}%`;
                document.getElementById(country.elementWind).textContent = `Wind Speed: ${data.current.wind_kph} km/h`;
            })
            .catch(error => {
                console.error(`Error fetching weather for ${country.name}:`, error);
            });
    });
}

// Update weather every 5 minutes (300,000 milliseconds)
setInterval(updateCountriesWeather, 300000);

// Initial call to fetch weather immediately on page load
updateCountriesWeather();
