const axios = require('axios');

const params = {
    arr_airport: 840005,
    dep_airport: 376001,
    month: 8,
    day_date: 25,
    day_week: 5,
    hour: 16,
    dep_delay: 1,
    duration: 720
}

axios.get('http://127.0.0.1:4000/flight_delay', {params})  
  .then(response => {
    console.log(response.data)
  }).catch(error => {
    console.log(error);
});
