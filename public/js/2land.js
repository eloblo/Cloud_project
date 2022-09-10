const socket_land = io();

socket_land.on("2land", function(data){
    var card = document.getElementById("2land");
    card.innerHTML=`<h1><b>Flights before landing</b></h1>
    <h2><b>${data}<b></h2>`;
})