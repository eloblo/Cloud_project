const fs = require('fs');
const axios = require('axios');

const file = './ml/data.txt';
const params = {
  api_key: '3b07d91e-6ba8-403e-81a7-bb3de148bba3',
  dep_iata: 'TLV'
}
axios.get('https://airlabs.co/api/v9/schedules', {params})  
  .then(response => {
    var apiResponse = response.data.response;
    var d = Buffer.from(JSON.stringify(apiResponse));
    fs.writeFile(file, d, function(err){
      if(err) {throw(err)}
    });
  }).catch(error => {
    console.log(error);
});





