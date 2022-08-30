const axios = require('axios');

// use schedules endpoint to get the arrival time by merging by flights flight_number to schedules cs_flight_number
// drop all flights who's status is not en-route/active or alt = 0
// need seperate params for departure and arrival, api cannot do or between oprions only and
var params = {
  api_key: 'c453d429-c2f1-42e5-b087-0a701ff0bccf',
  dep_iata: 'TLV'
}

axios.get('https://airlabs.co/api/v9/schedules', {params})  
  .then(response => {
    var apiResponse = response.data.response;
    apiResponse.forEach(element => {
      if(element.delayed){
        delete element.delayed
        console.log(element)
      }
    });
  }).catch(error => {
    console.log(error);
});
