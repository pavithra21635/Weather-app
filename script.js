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


$(document).ready(function () {
    searchCity('Moratuwa');
});

async function searchCity(cName) {
    const temp =
		`${url}?q=${cName}&appid=${apiKey}&units=metric`;
        try{
            const res = await fetch(temp);
            const data = await res.json();
            if (res.ok) {
			weatherShowFn(data);
		} else {
			alert('City not found. Please try again.');
		}

        }  catch (error) {
		console.error('Error fetching weather data:', error);
	}
}

function weatherShowFn(data) {
	$('#city-name').text(data.name);
	$('#date').text(moment().
		format('MMMM Do YYYY, h:mm:ss a')); // Corrected date format to include year
	$('#temperature').
		html(`${Math.round(data.main.temp)}°C`); // Rounded temperature
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

		$('#sunrise').
		text(formatTime(sunrise));
		$('#sunrise').
		text(formatTime(sunset));

	
	

}

function getFeelsLikeStatus(temp, feelsLike) {
    const diff = feelsLike - temp;
    if (diff > 2) return "🌞 Feels warmer than actual";
    if (diff < -2) return "❄️ Feels cooler than actual";
    return "🌡️ Feels like actual temperature";
}

function getWindStatus(speed) {
    if (speed < 3) return "Light breeze";
    if (speed < 8) return "Moderate breeze";
    if (speed < 13) return "Strong breeze";
    return "Windy";
}

function formatTime(timestamp) {
    return moment.unix(timestamp).format("h:mm A");
}

