const axios = require('axios');
const express = require('express');
const MysqlJson = require('mysql-json');

const mysqlJson = new MysqlJson({  // make sure it matches mysql docker
  host:'0.0.0.0',     
  user:'root',
  password:'Aa123456',
  database:'mysql'
});

const key = 'c453d429-c2f1-42e5-b087-0a701ff0bccf';
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
  
  axios.get(url, {params})  
    .then(response => {
      var apiResponse = response.data.response;
      mysqlJson.query("TRUNCATE "+table, function(err, response) {
        if (err) throw err;
      });
      Promise.all(apiResponse.map((object) => {
        return new Promise((resolve, reject) => {
          if(object.status != 'cancelled'){
            if(object.delayed){ 
              object.delay = object.delayed;
              delete object.delayed;
            }
            else{
              delete object.delayed;
            }
            mysqlJson.insert(table, object, (err, response) => {
              if (err) {
                console.log(err);
                reject(err);
              }
              else resolve(response);
            });
          }
          else resolve(object);
        });
      })).then((response) => {
        // ALL data are inserted, you can continue here !
        console.log(`Mysql: uploaded data to ${table}`)
      }, (err) => {
        console.error(err);
      });
    }).catch(error => {
      console.log(error);
  });
}

function init_connection(){
  mysqlJson.connect(function(err, response){
    if(err) throw err;
    console.log('System-a: connected to MYSQL');
  });
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

  
  // create tables
  mysqlJson.query(flights_table_to, function(err, response) {
    if (err) throw err;
  });

  mysqlJson.query(schedules_table_to, function(err, response) {
    if (err) throw err;
  });

  mysqlJson.query(flights_table_from, function(err, response) {
    if (err) throw err;
  });

  mysqlJson.query(schedules_table_from, function(err, response) {
    if (err) throw err;
  });
  console.log('System-a: initialized MYSQL data sets');
}

module.exports.connect_sql= function()
{ 
  init_connection();
}

module.exports.load_data= function(time)
{ 
  setInterval(() => {
    tables.forEach(element => {
      getAPI(element[0],element[1],element[2])
    });
  }, time)
}