const socket_weather = io();

socket_weather.on("weather", function(data){
    var card = document.getElementById("weather");
    console.log(data)
    card.innerHTML=`<h1><b>Current tempeture at TLV</b></h1>
    <h2><b>${data.temperature} C<b></h2>`;
})