const axios = require('axios');

function get_weather(){
    const params = {
      access_key: '3a5c517fbb651008e36c76ef39054cf9',
      query: 'Tel Aviv',
      units: 'm'
    };
    const url = `http://api.weatherstack.com/current`;
    axios.get(url, {params})  
    .then(response => {
      console.log(response);
      //sendmsg(response, topics[3]);
    }).catch(error => {
      console.log(error);
    });
  }

  get_weather();