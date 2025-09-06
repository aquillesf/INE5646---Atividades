function convertCelciusToFahrenheit(celcius) {
	let total = (celcius * 1.8) + 32;
	return total;
}


// -- Não edite abaixo!

function conversaoCtoF() {
	let textCelcius = document.getElementById("celciusText")
	let textFahrenheit = document.getElementById("resultFahrenheit")
	textFahrenheit.textContent = convertCelciusToFahrenheit(textCelcius.value) + "ºF"
}