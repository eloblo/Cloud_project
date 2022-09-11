const socket_land = io();

socket_land.on("2land", function(data){
    var card = document.getElementById("2land");
    card.innerHTML=`<br><h3><b>Flights before landing</b></h3><h4><b>${data}<b></h4>`;
})