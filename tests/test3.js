const radar = require('flightradar24-client/lib/radar')
const flight = require('flightradar24-client/lib/flight')

radar(53, 13, 52, 14)
.then(response => {
    response.forEach(f =>{
        flight(f.id)
        .then(console.log)
        .catch(console.error)
    })
  })
.catch(console.error)