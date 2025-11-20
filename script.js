const apiKey = "899e26a8860a71e12da62fd10e270633";

document.getElementById("btn").addEventListener("click", () => {
    const city = document.getElementById("search").value.trim();

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    getWeather(city);
    getForecast(city);
});

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod != 200) {
            alert(data.message);
            return;
        }

        document.querySelector(".list h2").textContent = data.name;
        document.querySelector(".list p:nth-of-type(1)").textContent =
            `Temperature : ${data.main.temp}°C`;
        document.querySelector(".list p:nth-of-type(2)").textContent =
            data.weather[0].description;
        document.querySelector(".circle").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    } catch (err) {
        alert("Error fetching weather!");
    }
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod != "200") {
            alert(data.message);
            return;
        }

        const forecastDiv = document.querySelector(".days");
        forecastDiv.innerHTML = ""; // clear old data

        // Filter 12:00 PM entries for next 4 days
        const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0,4);

        daily.forEach(item => {
            const date = new Date(item.dt_txt);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
            const temp = Math.round(item.main.temp);
            const emoji = getWeatherEmoji(item.weather[0].main);

            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");

            dayDiv.innerHTML = `
                <ul>
                    <li>${dayName}</li>
                    <li>${emoji}</li>
                    <li><p>${temp}°C</p></li>
                </ul>
            `;

            forecastDiv.appendChild(dayDiv);
        });

    } catch (err) {
        alert("Error fetching forecast!");
    }
}

function getWeatherEmoji(main) {
    switch(main) {
        case "Clear": return "🌞";
        case "Clouds": return "☁️";
        case "Rain": return "🌧️";
        case "Snow": return "❄️";
        case "Drizzle": return "💧";
        case "Thunderstorm": return "⛈️";
        default: return "🌡️";
    }
}