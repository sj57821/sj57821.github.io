const API_KEY = '89a9e037da0b5c2acb864c6de47e1027';
 
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const currentContent = document.getElementById('currentContent');
const forecastContent = document.getElementById('forecastContent');
 
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Wpisz nazwę miasta');
        return;
    }
    
    currentContent.innerHTML = '<div class="loading">Ładowanie pogody...</div>';
    forecastContent.innerHTML = '<div class="loading">Ładowanie prognozy...</div>';
    
    getCurrentWeatherXHR(city);
    getForecastFetch(city);
});
 
function getCurrentWeatherXHR(city) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                displayCurrentWeather(data);
                console.log('Current Weather:', data);
            } else {
                currentContent.innerHTML = `<div class="error"> Błąd: Nie znaleziono miasta "${city}"</div>`;
            }
        }
    };
    xhr.send();
}
 
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const cityName = data.name;
    
    currentContent.innerHTML = `
        <div style="text-align: center;">
            <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}">
            <div style="font-size: 48px; font-weight: bold;">${temp}°C</div>
            <div style="font-size: 20px; margin: 10px 0;">${cityName}</div>
            <div style="color: #666;">${description}</div>
            <div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-top: 20px;">
                <div> Odczuwalna: ${feelsLike}°C</div>
                <div> Wilgotność: ${humidity}%</div>
                <div> Ciśnienie: ${pressure} hPa</div>
                <div> Wiatr: ${windSpeed} m/s</div>
            </div>
        </div>
    `;
}
 
async function getForecastFetch(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Błąd pobierania prognozy');
        const data = await response.json();
        console.log('Forecast:', data);
        displayForecast(data);
    } catch (error) {
        forecastContent.innerHTML = `<div class="error"> Błąd: ${error.message}</div>`;
    }
}
 
function displayForecast(data) {
    const dailyForecasts = [];
    const processedDates = new Set();
    
    for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('pl-PL');
        const hour = date.getHours();
        
        if (!processedDates.has(dateStr) && hour >= 11 && hour <= 14) {
            processedDates.add(dateStr);
            dailyForecasts.push({
                date: dateStr,
                dayName: date.toLocaleDateString('pl-PL', { weekday: 'short' }),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity,
                wind: item.wind.speed
            });
        }
    }
    
    const fiveDays = dailyForecasts.slice(0, 5);
    
    if (fiveDays.length === 0) {
        forecastContent.innerHTML = '<div class="error">Brak danych prognozy</div>';
        return;
    }
    
    forecastContent.innerHTML = fiveDays.map(day => `
        <div class="forecast-item">
            <div class="date">${day.dayName}<br>${day.date}</div>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
            <div class="temp">${day.temp}°C</div>
            <div class="desc">${day.description}</div>
            <div style="font-size: 12px; margin-top: 8px;"> ${day.humidity}% |  ${day.wind} m/s</div>
        </div>
    `).join('');
}Z