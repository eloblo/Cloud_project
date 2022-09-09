const redis = require('redis');
const kafka_default = require('./consumers/consumer_default.js')
const kafka_weather = require('./consumers/consumer_weather.js')

const redisClient = redis.createClient(6379,'0.0.0.0');
const null_obj = 'Null object' 
var hexes = []

async function init_connection(){
    await redisClient.connect().then((response) => {},(err) => {
        //console.error(err);
        // An error occured
    }).catch((reason) =>{
        throw reason
    });
}

async function getValFromRedis(key,arr,len){

    return await redisClient.get(key).then((val)=>{
        if(!val) throw null_obj
        json_obj = parse_to_json(val)
        json_obj["hex"] = key
        return push_to_arr(arr,json_obj,len)
    }).catch((reason)=>{
        throw reason
    })   
}

async function push_to_arr(arr,val,len){
    arr.push(val)
    return arr
}


async function getAllValues(a){
    c = []
    for(element of a){
        await getValFromRedis(element,c,a.length)
    }
    return c
}


async function pullAllFlights(){
    return await redisClient.keys("*").then((val)=>{
        if(!val) throw null_obj
        // console.log(val)
        return val
        },(err) => {
            console.error(err)
        }
    ).then((val)=>{
        return getAllValues(val)
    }).catch((reason)=>{
        throw reason
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
    filghts_in_sky_arr = []
    //console.log('arr size: ' + json_data.length)
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

module.exports.connect_db= function()
{ 
  init_connection();
}

module.exports.insert_data= function(data)
{ 
  insert_to_redis(data);
}

module.exports.pull_all= function()
{ 
  return pullAllFlights();
}

module.exports.quit= function()
{ 
  quit_func();
}

module.exports.set_flights= function(hex)
{ 
  hexes = hex;
}

module.exports.get_flights= async function(hex)
{ 
  return await getAllValues(hexes)
}
