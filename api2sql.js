const axios = require('axios');
const MysqlJson = require('mysql-json');


const mysqlJson = new MysqlJson({  // make sure it matches mysql docker
  host:'0.0.0.0',     
  user:'root',
  password:'Aa123456',
  database:'mysql'
});

const key = '3b07d91e-6ba8-403e-81a7-bb3de148bba3';
const flight_api = 'https://airlabs.co/api/v9/flights';
const schedule_api = 'https://airlabs.co/api/v9/schedules';
//table name, api path, params  // maybe write array to a json file and load from there
const tables = [['flights_to', flight_api,{api_key: key, arr_iata: 'TLV'}],
                ['flights_from', flight_api,{api_key: key, dep_iata: 'TLV'}],
                ['schedules_to', schedule_api,{api_key: key, arr_iata: 'TLV'}],
                ['schedules_from', schedule_api,{api_key: key, dep_iata: 'TLV'}]];

async function getAPI(table, url, params){
// use schedules endpoint to get the arrival time by merging flights flight_number to schedules cs_flight_number
// need seperate params for departure and arrival, api cannot do or between oprions only and
  try{
    let response = await axios.get(url, {params})  
    var apiResponse = response.data.response;
    await mysqlJson.query("TRUNCATE "+table, function(err, res){})
    for(var object of apiResponse) {
      try{
        if(object.status != 'cancelled'){
          if(object.delayed){ 
            object.delay = object.delayed;
            delete object.delayed;
          }
          else{
            delete object.delayed;
          }
        }
          await mysqlJson.insert(table, object, function(err, res){});
      }
      catch (error){
        console.log(error);
      }
    }
  }
  catch (error){
    console.log(error);
  }
  console.log(`Mysql: uploaded data to ${table}`)
}

async function init_connection(){
  // if exist create the tables in tables[x][0]. table format according to air lab response format
  const flights_table_to = `CREATE TABLE IF NOT EXISTS ${tables[0][0]} (hex VARCHAR(16), reg_number VARCHAR(16), flag VARCHAR(8), lat FLOAT(24), \
                          lng FLOAT(24), alt FLOAT(24), dir FLOAT(24), speed FLOAT(24), v_speed FLOAT(24), squawk VARCHAR(16), flight_number VARCHAR(16), \
                          flight_icao VARCHAR(32), flight_iata VARCHAR(32), dep_icao VARCHAR(16), dep_iata VARCHAR(16), arr_icao VARCHAR(16), arr_iata VARCHAR(16), \
                          airline_icao VARCHAR(16), airline_iata VARCHAR(16), aircraft_icao VARCHAR(16), updated BIGINT, status VARCHAR(16));`

  const schedules_table_to = `CREATE TABLE IF NOT EXISTS ${tables[2][0]} (airline_iata VARCHAR(16), airline_icao VARCHAR(16), flight_iata VARCHAR(32), flight_icao VARCHAR(32), \
                              flight_number VARCHAR(16), dep_iata VARCHAR(16), dep_icao VARCHAR(16), dep_terminal VARCHAR(16), dep_gate VARCHAR(16), dep_time DATETIME, \
                              dep_time_utc DATETIME, dep_estimated DATETIME, dep_estimated_utc DATETIME, dep_actual DATETIME, dep_actual_utc DATETIME, arr_iata VARCHAR(16), \
                              arr_icao VARCHAR(16), arr_terminal VARCHAR(16), arr_gate VARCHAR(16), arr_baggage VARCHAR(16), arr_time DATETIME, arr_time_utc DATETIME,\
                              arr_estimated DATETIME, arr_estimated_utc DATETIME, cs_airline_iata VARCHAR(16), cs_flight_number VARCHAR(16), cs_flight_iata VARCHAR(32), \
                              dep_time_ts BIGINT, status VARCHAR(16), duration INT, delay INT, dep_delayed INT, arr_delayed INT, aircraft_icao VARCHAR(16), arr_time_ts BIGINT, \
                              arr_estimated_ts BIGINT, dep_estimated_ts BIGINT, arr_actual DATETIME, arr_actual_utc DATETIME, arr_actual_ts BIGINT, dep_actual_ts BIGINT);`
                        
  const flights_table_from = `CREATE TABLE IF NOT EXISTS ${tables[1][0]} (hex VARCHAR(16), reg_number VARCHAR(16), flag VARCHAR(8), lat FLOAT(24), \
                              lng FLOAT(24), alt FLOAT(24), dir FLOAT(24), speed FLOAT(24), v_speed FLOAT(24), squawk VARCHAR(16), flight_number VARCHAR(16), \
                              flight_icao VARCHAR(32), flight_iata VARCHAR(32), dep_icao VARCHAR(16), dep_iata VARCHAR(16), arr_icao VARCHAR(16), arr_iata VARCHAR(16), \
                              airline_icao VARCHAR(16), airline_iata VARCHAR(16), aircraft_icao VARCHAR(16), updated BIGINT, status VARCHAR(16));`

  const schedules_table_from = `CREATE TABLE IF NOT EXISTS ${tables[3][0]} (airline_iata VARCHAR(16), airline_icao VARCHAR(16), flight_iata VARCHAR(32), flight_icao VARCHAR(32), \
                                flight_number VARCHAR(16), dep_iata VARCHAR(16), dep_icao VARCHAR(16), dep_terminal VARCHAR(16), dep_gate VARCHAR(16), dep_time DATETIME, \
                                dep_time_utc DATETIME, dep_estimated DATETIME, dep_estimated_utc DATETIME, dep_actual DATETIME, dep_actual_utc DATETIME, arr_iata VARCHAR(16), \
                                arr_icao VARCHAR(16), arr_terminal VARCHAR(16), arr_gate VARCHAR(16), arr_baggage VARCHAR(16), arr_time DATETIME, arr_time_utc DATETIME,\
                                arr_estimated DATETIME, arr_estimated_utc DATETIME, cs_airline_iata VARCHAR(16), cs_flight_number VARCHAR(16), cs_flight_iata VARCHAR(32), \
                                dep_time_ts BIGINT, status VARCHAR(16), duration INT, delay INT, dep_delayed INT, arr_delayed INT, aircraft_icao VARCHAR(16), arr_time_ts BIGINT, \
                                arr_estimated_ts BIGINT, dep_estimated_ts BIGINT, arr_actual DATETIME, arr_actual_utc DATETIME, arr_actual_ts BIGINT, dep_actual_ts BIGINT);`

  const queries = [flights_table_to, flights_table_from, schedules_table_to, schedules_table_from]
  // connect to mysql server
  await mysqlJson.connect(function(err, res){})
  console.log('System-a: connected to MYSQL');
  for(const query of queries){
    await mysqlJson.query(query, function(err, res){})
  }
}

function upload_data(time){
  setInterval(() => {
    for(const element of tables) {
      try{
        getAPI(element[0],element[1],element[2]);
      }
      catch(error){
        console.log(error);
      }
    }
  }, time)
}

module.exports.connect_sql=async function()
{ 
  await init_connection();
}

module.exports.load_data=function(time)
{ 
  upload_data(time);
}