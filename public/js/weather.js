const socket_weather = io();

socket_weather.on("weather", function(data){
    var card = document.getElementById("weather");
    card.innerHTML=`<br><h3><b>Current tempeture at TLV</b></h3><h4><b>${data.temperature} C<b></h4>`;
})