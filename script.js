const url =
	'https://api.openweathermap.org/data/2.5/weather';
const apiKey =
	'f00c38e0279b7bc85480c3fe775d518c';



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
        if (data.rain && data.rain['1h']) {
    $('.p-rain').text(`Rain (last hour): ${data.rain['1h']} mm`);
} else {
    $('.p-rain').text(`No rain`);
   
}

	
}


