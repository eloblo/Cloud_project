const flightdata = require('flight-data');

flightdata.flights(
    {
      API_TOKEN: '95c3886ccf657ece4cc1b3e06e09d04c',
      options: {
        limit: 100,
        dep_iata: 'TLV'
      }
    })
    .then(response => {
        var r = response.data
        var i = 0
        r.forEach(element => {
         if(element.flight_status == 'active') {
          console.log(element);
          i ++;
        } 
        });
        console.log(i)
      })
    .catch(error => {
        console.log(error)
    });


