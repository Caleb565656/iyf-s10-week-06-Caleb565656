// ------------------ Task 11: Async & Promises ------------------

// Dummy async functions simulating database/API
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) resolve({ id: userId, name: "John" });
            else reject("Invalid ID");
        }, 1000);
    });
}

function getUserPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, title: "Post 1" },
                { id: 2, title: "Post 2" }
            ]);
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, text: "Great post!" },
                { id: 2, text: "Thanks for sharing" }
            ]);
        }, 1000);
    });
}

// Async/Await function
async function loadAsyncData() {
    const output = document.getElementById("async-output");
    output.textContent = "Loading...";
    try {
        const user = await getUserData(1);
        const posts = await getUserPosts(user.id);
        const comments = await getPostComments(posts[0].id);
        output.textContent = `
User: ${JSON.stringify(user)}
Posts: ${JSON.stringify(posts)}
Comments: ${JSON.stringify(comments)}
        `;
    } catch (err) {
        output.textContent = "Error: " + err;
    }
}

// Button click
document.getElementById("async-btn").addEventListener("click", loadAsyncData);

// ------------------ Task 12: Fetch API & Weather ------------------

const API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");

const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const searchHistory = document.getElementById("search-history");

function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
    error.classList.add("hidden");
}
function hideLoading() { loading.classList.add("hidden"); }
function showError(msg) { error.textContent = msg; error.classList.remove("hidden"); }

async function getWeather(city) {
    showLoading();
    try {
        const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!res.ok) throw new Error(res.status === 404 ? "City not found" : "Fetch failed");
        const data = await res.json();
        displayWeather(data);
        saveToHistory(city);
    } catch (err) {
        showError(err.message);
    } finally { hideLoading(); }
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    temperature.textContent = `Temp: ${data.main.temp}°C`;
    description.textContent = `Weather: ${data.weather[0].description}`;
    feelsLike.textContent = `Feels like: ${data.main.feels_like}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed} m/s`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    weatherDisplay.classList.remove("hidden");
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    history = [city, ...history.filter(c => c !== city)].slice(0,5);
    localStorage.setItem("cities", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem("cities")) || [];
    searchHistory.innerHTML = history.map(c => `<li>${c}</li>`).join("");
    document.querySelectorAll("#search-history li").forEach(li => {
        li.addEventListener("click", () => getWeather(li.textContent));
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

// Initialize
loadHistory();
