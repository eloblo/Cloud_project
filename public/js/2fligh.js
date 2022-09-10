const socket_fligh = io();

socket_fligh.on("2fligh", function(data){
    var card = document.getElementById("2fligh");
    card.innerHTML=`<h1><b>Flights before take off</b></h1><h2><b>${data}<b></h2>`;
})