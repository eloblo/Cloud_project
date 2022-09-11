const socket_fligh = io();

socket_fligh.on("2fligh", function(data){
    var card = document.getElementById("2fligh");
    card.innerHTML=`<br><h3><b>Flights before take off</b></h3><h4><b>${data}<b></h4>`                
})