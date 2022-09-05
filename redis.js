const redis = require('redis');
const redisClient = redis.createClient(6379,'127.0.0.1');

const null_obj = 'Null object' 

async function init_connection(){
    await redisClient.connect().then((response) => {},(err) => {
        console.error(err);
        // An error occured
    });
}

async function getValFromRedis(key){
   await redisClient.get(key).then((val)=>{
        if(!val) throw null_obj
        json_obj = parse_to_json(val)
        console.log(json_obj)
        // Use the data here

    },(err) => {
        console.error(err)
    })
}

async function setValToRedis(key, value){
    await redisClient.set(key,value).then((response) => {
        if(response != 'OK') throw 'Could not set the key'
    },(err) => {
        console.error(err);
        // An error occured
    });
}

function parse_to_json(str_json){
    return JSON.parse(str_json)
}

function insert_to_redis(data){
    json_data = parse_to_json(data)
    // new_arr = addId(json_data)
    console.log('arr size: ' + json_data.length)
    for(var i=0; i<json_data.length;i++){
        element = json_data[i];
        var id = element["hex"]
        delete element["hex"]
        str_rest = JSON.stringify(element)
        console.log(`inserting flight number: ${id}`)
        setValToRedis(id,str_rest)
    }
}

function quit_func(){
    redisClient.quit()
}

a = 
[
        {
          hex: '1',
          reg_number: 'F-GSPX',
          flag: 'Uriya',
          lat: 45.8545,
          lng: 7.50888},
        {
          hex: '2',
          reg_number: 'F-GSPX',
          flag: 'FR',
          lat: 45.8545,
          lng: 7.50888
        }
]

module.exports.connect_db= function()
{ 
  init_connection();
}

module.exports.insert_data= function(data)
{ 
  insert_to_redis(data);
}

module.exports.quit= function()
{ 
  quit_func();
}
