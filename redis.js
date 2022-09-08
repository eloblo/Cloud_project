const redis = require('redis');

const redisClient = redis.createClient(6379,'127.0.0.1');
const null_obj = 'Null object' 

async function init_connection(){
    await redisClient.connect().then((response) => {},(err) => {
        //console.error(err);
        // An error occured
    }).catch((reason) =>{
        throw reason
    });
}

async function getValFromRedis(key,arr,len){

    await redisClient.get(key).then((val)=>{
        if(!val) throw null_obj
        json_obj = parse_to_json(val)
        json_obj["hex"] = key
        push_to_arr(arr,json_obj,len)
    }).catch((reason)=>{
        throw reason
    })   
}

async function push_to_arr(arr,val,len){
    arr.push(val)
    if (arr.length==len){
        // Almog use arr here
        console.log(arr)
    }
}


async function getAllValues(a){
    c = []
    a.forEach(element => {
        getValFromRedis(element,c,a.length)
    });
}


async function pullAllFlights(){
    await redisClient.keys("*").then((val)=>{
        if(!val) throw null_obj
        // console.log(val)
        return val
        },(err) => {
            console.error(err)
        }
    ).then((val)=>{
        getAllValues(val)
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
  pullAllFlights();
}

module.exports.quit= function()
{ 
  quit_func();
}
