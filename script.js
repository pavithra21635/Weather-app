const url =
	'https://api.openweathermap.org/data/2.5/weather';
const apiKey =
	'f00c38e0279b7bc85480c3fe775d518c';

const weatherImageMap = {
    'Clear': {
        day: 'Images/Sun.png',
        night: 'Images/Moon.png'
    },
    'Clouds': {
        day: 'Images/CloudyDay.png',
        night: 'Images/CloudyNight.png'
    },
    'Rain': {
        day: 'Images/RainDay.png',
        night: 'Images/RainNight.png'
    },
    'Drizzle': {
        day: 'Images/DrizzleDay.png',
        night: 'Images/DrizzleNight.png'
    },
    'Thunderstorm': {
        day: 'Images/StormDay.png',
        night: 'Images/StormNight.png'
    },
    'Snow': {
        day: 'Images/SnowDay.png',
        night: 'Images/SnowNight.png'
    },
    'Mist': {
        day: 'Images/MistDay.png',
        night: 'Images/MistNight.png'
    }
};

const weatherCodeToImage = {
    0: 'Images/Sun.png',            // Clear sky
    1: 'Images/Sun.png',            // Mainly clear
    2: 'Images/CloudyDay.png',      // Partly cloudy
    3: 'Images/CloudyDay.png',      // Overcast
    45: 'Images/MistDay.png',       // Fog
    48: 'Images/MistDay.png',
    51: 'Images/DrizzleDay.png',    // Drizzle
    53: 'Images/DrizzleDay.png',
    55: 'Images/DrizzleDay.png',
    61: 'Images/RainDay.png',       // Rain
    63: 'Images/RainDay.png',
    65: 'Images/RainDay.png',
    80: 'Images/RainDay.png',
    81: 'Images/RainDay.png',
    82: 'Images/RainDay.png',
    95: 'Images/StormDay.png',      // Thunderstorm
    96: 'Images/StormDay.png',
    99: 'Images/StormDay.png'
};


$(document).ready(function () {
    searchCity('Moratuwa');
});

async function searchCity(cName) {
    const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        if (res.ok) {
            weatherShowFn(data);

             const lat = data.coord.lat;
            const lon = data.coord.lon;

            fetch7DayForecast(lat, lon);
            }else if (data.cod === '404') {
        
        } else {
            alert('❌ City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        if (!navigator.onLine) {
            alert("⚠️ No internet connection. Please check your connection and try again.");
        } else {
            alert("⚠️ Failed to fetch weather data. Please try again later.");
        }
    }
}


function weatherShowFn(data) {
	$('#city-name').text(data.name);
	$('#date').text(moment().
		format('MMMM Do YYYY, h:mm:ss a')); 
	$('#temperature').
		html(`${Math.round(data.main.temp)}°C`);
	$('#description').
		text(data.weather[0].description);
	//Rain
    if (data.rain && data.rain['1h']) {
    $('.p-rain').text(`Rain (last hour): ${data.rain['1h']} mm`);
     } else {
    $('.p-rain').text(`No rain`);
	 }

	//Determine day or night
	const currentTime = data.dt;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;
    const isDay = currentTime >= sunrise && currentTime < sunset;

	// Pick image
    const condition = data.weather[0].main;
    const imageData = weatherImageMap[condition];
    const customImage = imageData
        ? (isDay ? imageData.day : imageData.night)
        : 'Images/Default.png'; // fallback

    $('.image-weather').attr('src', customImage);

	//feelslike
	
	const feelsLike = data.main.feels_like;
	$('#feelliketemp').
		html(`${Math.round(feelsLike)}°C`); 

	const temp = data.main.temp;
	$('#feelslikedesc').
		text(getFeelsLikeStatus(temp, feelsLike));

	//wind status
		const windSpeed = data.wind.speed;
		$('#windspeed').text(`${Math.round(windSpeed)} m/s`);

		$('#windspeeddesc').
		text(getWindStatus(windSpeed));

		//sunrise & suset

		// Format and display sunrise and sunset with emojis
        $('#sunrise').text(`⬆️ ${formatTime(sunrise)}`);
        $('#sunset').text(`⬇️ ${formatTime(sunset)}`);
        //humidity

        const humidity = data.main.humidity;
        $('#humidity').text(`${humidity}%`);
        $('#humiditydesc').text(getHumidityStatus(humidity));

        //visibility

        const visibility = data.visibility;
         $('#visibility').text(`${visibility}m`);
        $('#visibilitydesc').text(getVisibilityStatus(visibility));

        //pressure

        const pressure = data.main.pressure;
        $('#pressure').text( `${pressure} hPa`);
        $('#pressuredesc').text(getPressureStatus(pressure));


}

function getFeelsLikeStatus(temp, feelsLike) {
    const diff = feelsLike - temp;
    if (diff > 2) return "🌞 Feels warmer than actual";
    if (diff < -2) return "❄️ Feels cooler than actual";
    return "🌡️ Feels like actual temperature";
}

function getWindStatus(speed) {
    if (speed < 3) return "🍃 Light breeze";         // gentle leaves fluttering
    if (speed < 8) return "🌬️ Moderate breeze";     // air blowing face
    if (speed < 13) return "💨 Strong breeze";       // motion air dash
    return "🌪️ Windy";                              // tornado for strong winds
}

function formatTime(timestamp) {
    return moment.unix(timestamp).format("h:mm A");
}

function getHumidityStatus(humidity) {
    if (humidity < 30) return "💨 Low (dry)";
    if (humidity < 60) return "😊 Normal";
    if (humidity < 80) return "😓 High";
    return "🥵 Very high (muggy)";
}


function getVisibilityStatus(visibility) {
    if (visibility > 10000) return "🔭 Excellent";
    if (visibility > 6000) return "👀 Good";
    if (visibility > 3000) return "🌁 Moderate";
    return "🚫 Poor";
}


function getPressureStatus(pressure) {
    if (pressure < 1000) return "🌧️ Low (chance of rain)";
    if (pressure <= 1015) return "🌤️ Normal";
    return "☀️ High (clear weather likely)";
}


async function fetch7DayForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&timezone=auto`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyTemps = data.daily.temperature_2m_max;
    const weatherCodes = data.daily.weathercode;
    const dates = data.daily.time;

    // Loop through 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(dates[i]);
      const day = days[date.getDay()];
      const temp = Math.round(dailyTemps[i]) + '°C';
      const code = weatherCodes[i];
      const icon = weatherCodeToImage[code] || 'Images/Default.png';

      // Select the box dynamically
      const box = document.querySelectorAll('.box-week > div')[i];
      box.querySelector('.p-sun').textContent = day;
      box.querySelector('.image-lightening').src = icon;
      box.querySelector('.p-temp').textContent = temp;
    }

  } catch (error) {
    console.error('Error fetching 7-day forecast:', error);
  }
}


