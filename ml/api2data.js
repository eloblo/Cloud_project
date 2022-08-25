const fs = require('fs');
const axios = require('axios');

const file = './ml/data.txt';
const params = {
  api_key: 'c453d429-c2f1-42e5-b087-0a701ff0bccf',
  arr_iata: 'TLV'
}
axios.get('https://airlabs.co/api/v9/schedules', {params})  
  .then(response => {
    var apiResponse = response.data.response;
    var d = Buffer.from(JSON.stringify(apiResponse));
    fs.appendFile(file, d, function(err){
      if(err) {throw(err)}
    });
    fs.appendFile(file, '\n\n\n', function(err){
      if(err) {throw(err)}
    });
  }).catch(error => {
    console.log(error);
});





