const axios = require('axios');
const express = require('express');
const MysqlJson = require('mysql-json');

const mysqlJson = new MysqlJson({
  host:'127.0.0.1',
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
                ['schedules_to', schedule_api,{api_key: key, arr_iata: 'TLV',
                _fields: ['airline_icao', 'flight_icao', 'cs_airline_iata', 'cs_flight_number', 'cs_flight_iata', 'dep_iata', 'dep_icao', 'dep_time_ts',
                          'dep_time_utc', 'dep_estimated_ts','dep_estimated_utc', 'arr_iata', 'arr_icao', 'arr_time_ts', 'arr_time_utc', 'arr_estimated_ts',
                          'arr_estimated_utc', 'status', 'duration']}],
                ['schedules_from', schedule_api,{api_key: key, dep_iata: 'TLV',
                _fields: ['airline_icao', 'flight_icao', 'cs_airline_iata', 'cs_flight_number', 'cs_flight_iata', 'dep_iata', 'dep_icao', 'dep_time_ts',
                          'dep_time_utc', 'dep_estimated_ts','dep_estimated_utc', 'arr_iata', 'arr_icao', 'arr_time_ts', 'arr_time_utc', 'arr_estimated_ts',
                          'arr_estimated_utc', 'status', 'duration']}]];



function getAPI(table, url, params){

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
          if(object.status == 'active' || object.status == 'en-route'){
            console.log(object)
            mysqlJson.insert(table, object, (err, response) => {
              if (err) {
                console.log(err);
                reject(err);
              }
              else resolve(response);
            });
          }
        });
      })).then((response) => {
        // ALL data are inserted, you can continue here !
        console.log('uploaded data')
      }, (err) => {
        console.error(err);
        // An error occured
      });
    }).catch(error => {
      console.log(error);
  });
}

function init_connection(){
  const flights_table_to = "CREATE TABLE IF NOT EXISTS flights_to (hex VARCHAR(16), reg_number VARCHAR(16), flag VARCHAR(8), lat FLOAT(24), \
                          lng FLOAT(24), alt FLOAT(24), dir FLOAT(24), speed FLOAT(24), squawk VARCHAR(16), flight_number VARCHAR(16), \
                          flight_icao VARCHAR(32), flight_iata VARCHAR(32), dep_icao VARCHAR(16), dep_iata VARCHAR(16), arr_icao VARCHAR(16), arr_iata VARCHAR(16), \
                          airline_icao VARCHAR(16), airline_iata VARCHAR(16), aircraft_icao VARCHAR(16), updated BIGINT, status VARCHAR(16));"

  const schedules_table_to = "CREATE TABLE IF NOT EXISTS schedules_to (airline_icao VARCHAR(16), flight_icao VARCHAR(32), \
                              cs_airline_iata VARCHAR(16), cs_flight_number VARCHAR(16) , cs_flight_iata VARCHAR(32), dep_iata VARCHAR(16), \
                              dep_icao VARCHAR(16), dep_time_ts BIGINT, dep_time_utc DATETIME, \
                              dep_estimated_ts BIGINT, dep_estimated_utc DATETIME, arr_iata VARCHAR(16), arr_icao VARCHAR(16), \
                              arr_time_ts BIGINT, arr_time_utc DATETIME, \
                              arr_estimated_ts BIGINT, arr_estimated_utc DATETIME, status VARCHAR(16), duration INT);"
                        
  const flights_table_from = "CREATE TABLE IF NOT EXISTS flights_from (hex VARCHAR(16), reg_number VARCHAR(16), flag VARCHAR(8), lat FLOAT(24), \
                              lng FLOAT(24), alt FLOAT(24), dir FLOAT(24), speed FLOAT(24), squawk VARCHAR(16), flight_number VARCHAR(16), \
                              flight_icao VARCHAR(32), flight_iata VARCHAR(32), dep_icao VARCHAR(16), dep_iata VARCHAR(16), arr_icao VARCHAR(16), arr_iata VARCHAR(16), \
                              airline_icao VARCHAR(16), airline_iata VARCHAR(16), aircraft_icao VARCHAR(16), updated BIGINT, status VARCHAR(16));"

  const schedules_table_from = "CREATE TABLE IF NOT EXISTS schedules_from (airline_icao VARCHAR(16), flight_icao VARCHAR(32), \
                                cs_airline_iata VARCHAR(16), cs_flight_number VARCHAR(16) , cs_flight_iata VARCHAR(32), dep_iata VARCHAR(16), \
                                dep_icao VARCHAR(16), dep_time_ts BIGINT, dep_time_utc DATETIME, \
                                dep_estimated_ts BIGINT, dep_estimated_utc DATETIME, arr_iata VARCHAR(16), arr_icao VARCHAR(16), \
                                arr_time_ts BIGINT, arr_time_utc DATETIME, \
                                arr_estimated_ts BIGINT, arr_estimated_utc DATETIME, status VARCHAR(16), duration INT);"

  mysqlJson.connect(function(err, response){
    if(err) throw err;
    console.log('connected');
  });
  
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
}

init_connection();
tables.forEach(element => {
  getAPI(element[0],element[1],element[2])
})
// unfit due to timing of connection
//mysqlJson.query("SELECT * FROM flights_to LEFT JOIN schedules_to ON flights_to.flight_number=schedules_to.cs_flight_number UNION \
//                SELECT * FROM flights_from LEFT JOIN schedules_from ON flights_from.flight_number=schedules_from.cs_flight_number", function(err, response) {
//  if (err) throw err;
//  console.log(response);
//});