const Kafka = require("node-rdkafka");
const MysqlJson = require('mysql-json');
const axios = require('axios');

const mysqlJson = new MysqlJson({ // make sure it matches mysql docker
  host:'0.0.0.0',
  user:'root',
  password:'Aa123456',
  database:'mysql'
});

const kafkaConf = {
    "group.id": "Ariel_cloud_project",
    "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094".split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "w7rglkzc",
    "sasl.password": "7w4xX7riGgVOzOZqcCh_ET55EWoSh9n2",
  };

const prefix = "w7rglkzc-";
// default: returns an array of all flights and their information. importently location, schedules, delay, country of origin and destinetion
// 2fligh: returns an array of up to the length of 2 [to_fligh: number, ...]. the sum of numbers is the number of total planes that will takeof in the next 15 minutes
// 2land: returns an array of up to the length of 2 [to_land: number, ...]. the sum of numbers is the number of total planes that will land in the next 15 minutes
// weather: returns data of the current weather in TLV (untis are in metrics) example:
// {"observation_time":"02:14 PM","temperature":32,"weather_code":113,"weather_icons":["https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"],
// "weather_descriptions":["Sunny"],"wind_speed":20,"wind_degree":300,"wind_dir":"WNW","pressure":1004,"precip":0,"humidity":43,"cloudcover":0,"feelslike":36,"uv_index":8,
// "visibility":10,"is_day":"yes"}
// landed: contains schedulles of flights that landed. used for gathering dataset for ml
const topics = [`${prefix}default`,`${prefix}2fligh`,`${prefix}2land`,`${prefix}weather`,`${prefix}landed`]
const tables = ['flights_to', 'flights_from', 'schedules_to', 'schedules_from']
const producer = new Kafka.Producer(kafkaConf);

function sendmsg(msg, topic){
  var data = JSON.stringify(msg)
  // dont send empty data
  if(data != '[]') {
    producer.produce(topic, -1, Buffer.from(data));
  }
}

function get_total_data(){
  // mysql code for combined stored data, left join produces more data but lacks schedules
  mysqlJson.query(`SELECT f2.* , s2.dep_time_utc, s2.dep_estimated_utc, s2.dep_actual_utc, s2.arr_time_utc, s2.arr_estimated_utc, s2.cs_flight_number, \
                  s2.cs_flight_iata, s2.dep_time_ts, s2.duration, s2.delay, s2.arr_time_ts, s2.dep_time_ts, s2.arr_estimated_ts, s2.dep_estimated_ts, \
                  s2.dep_actual_ts FROM ${tables[0]} f2 JOIN ${tables[2]} s2 ON f2.flight_number=s2.cs_flight_number UNION \
                  SELECT f1.* , s1.dep_time_utc, s1.dep_estimated_utc, s1.dep_actual_utc, s1.arr_time_utc, s1.arr_estimated_utc, s1.cs_flight_number, \
                  s1.cs_flight_iata, s1.dep_time_ts, s1.duration, s1.delay, s1.arr_time_ts, s1.dep_time_ts, s1.arr_estimated_ts, s1.dep_estimated_ts, \
                  s1.dep_actual_ts FROM ${tables[1]} f1 JOIN ${tables[3]} s1 ON f1.flight_number=s1.cs_flight_number`, function(err, response) {
    if (err) throw err;
    sendmsg(response, topics[0]);
  });
}

function get2fligh(){
  var now = Math.floor(Date.now() / 1000);
  var min = now + 900;
  // mysql code for total flight waiting to takeof in the next 15 minutes
  mysqlJson.query(`SELECT COUNT(*) to_fligh FROM ${tables[3]} s1 \
                  WHERE s1.status='scheduled' AND s1.dep_estimated_ts IS NOT NULL AND s1.dep_estimated_ts < ${min} UNION \
                  SELECT COUNT(*) to_fligh FROM ${tables[2]} s2 \
                  WHERE s2.status='scheduled' AND s2.dep_estimated_ts IS NOT NULL AND s2.dep_estimated_ts < ${min};`, function(err, response) {
    if (err) throw err;
    sendmsg(response, topics[1]);
  });
}

function get2land(){
  var now = Math.floor(Date.now() / 1000);
  var min = now + 900;
  // mysql code for total flight waiting to landf in the next 15 minutes
  mysqlJson.query(`SELECT COUNT(DISTINCT hex) to_land FROM ${tables[1]} f1 JOIN ${tables[3]} s1 ON f1.flight_number=s1.cs_flight_number \
                  WHERE s1.status='active' AND s1.arr_estimated_ts IS NOT NULL AND s1.arr_estimated_ts < ${min} UNION \
                  SELECT COUNT(DISTINCT hex) to_land FROM ${tables[0]} f2 JOIN ${tables[2]} s2 ON f2.flight_number=s2.cs_flight_number \
                  WHERE s2.status='active' AND s2.arr_estimated_ts IS NOT NULL AND s2.arr_estimated_ts < ${min};`, function(err, response) {
    if (err) throw err;
    sendmsg(response, topics[2]);
  });
}

function get_weather(){
  const params = {
    access_key: '3a5c517fbb651008e36c76ef39054cf9',
    query: 'Tel Aviv',
    units: 'm'
  };
  const url = `http://api.weatherstack.com/current`;
  axios.get(url, {params})  
  .then(response => {
    sendmsg(response.data.current, topics[3]);
  }).catch(error => {
    console.log(error);
  });
}

function get_landed(){
  mysqlJson.query(`SELECT * FROM ${tables[2]} s2 WHERE s2.status='landed' UNION SELECT * FROM ${tables[3]} s1 WHERE s1.status='landed';`, function(err, response){
    if(err) {throw err}
    sendmsg(response, topics[4])
  })
}

module.exports.produce= async function(time)
{ 
  mysqlJson.connect(function(err, response){
    if(err) throw err;
  });
  await producer.connect();
  console.log('system-a: producer connected');
  setInterval(() => {
    get_total_data();
    get2fligh();
    get2land();
    get_weather();
    get_landed();
  }, time);
}
