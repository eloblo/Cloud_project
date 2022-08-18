const Kafka = require("node-rdkafka");
const MysqlJson = require('mysql-json');

const mysqlJson = new MysqlJson({
  host:'127.0.0.1',
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
const topics = [`${prefix}default`,`${prefix}2fligh`,`${prefix}2land`]
const producer = new Kafka.Producer(kafkaConf);

console.log('producer');
producer.connect();

function sendmsg(msg, topic){
  producer.produce(topic, -1, Buffer.from(JSON.stringify(msg))); 
}

function get_total_data(){
  // mysql code for combined stored data, left join produces more data but lacks schedules
  mysqlJson.query("SELECT f2.* , s2.dep_time_utc, s2.dep_estimated_utc, s2.dep_actual_utc, s2.arr_time_utc, s2.arr_estimated_utc, s2.cs_flight_number, \
                  s2.cs_flight_iata, s2.dep_time_ts, s2.duration, s2.delay, s2.arr_time_ts, s2.dep_time_ts, s2.arr_estimated_ts, s2.dep_estimated_ts, \
                  s2.dep_actual_ts FROM flights_to f2 JOIN schedules_to s2 ON f2.flight_number=s2.cs_flight_number UNION \
                  SELECT f1.* , s1.dep_time_utc, s1.dep_estimated_utc, s1.dep_actual_utc, s1.arr_time_utc, s1.arr_estimated_utc, s1.cs_flight_number, \
                  s1.cs_flight_iata, s1.dep_time_ts, s1.duration, s1.delay, s1.arr_time_ts, s1.dep_time_ts, s1.arr_estimated_ts, s1.dep_estimated_ts, \
                  s1.dep_actual_ts FROM flights_from f1 JOIN schedules_from s1 ON f1.flight_number=s1.cs_flight_number", function(err, response) {
    if (err) throw err;
    sendmsg(response, topics[0]);
  });
}

function get2fligh(){
  var now = Math.floor(Date.now() / 1000);
  var min = now + 900;
  mysqlJson.query(`SELECT COUNT(DISTINCT hex) to_fligh FROM flights_from f1 JOIN schedules_from s1 ON f1.flight_number=s1.cs_flight_number \
                  WHERE s1.status='scheduled' AND s1.dep_estimated_ts < ${min} UNION \
                  SELECT COUNT(DISTINCT hex) to_fligh FROM flights_from f2 JOIN schedules_from s2 ON f2.flight_number=s2.cs_flight_number \
                  WHERE s2.status='scheduled' AND s2.dep_estimated_ts < ${min};`, function(err, response) {
    if (err) throw err;
    sendmsg(response, topics[1]);
  });
}

function get2land(){
  var now = Math.floor(Date.now() / 1000);
  var min = now + 900;
  mysqlJson.query(`SELECT COUNT(DISTINCT hex) to_land FROM flights_from f1 JOIN schedules_from s1 ON f1.flight_number=s1.cs_flight_number \
                  WHERE s1.status='active' AND s1.arr_estimated_ts < ${min} UNION \
                  SELECT COUNT(DISTINCT hex) to_land FROM flights_from f2 JOIN schedules_from s2 ON f2.flight_number=s2.cs_flight_number \
                  WHERE s2.status='active' AND s2.arr_estimated_ts < ${min};`, function(err, response) {
    if (err) throw err;
    sendmsg(response, topics[2]);
  });
}

mysqlJson.connect(function(err, response){
  if(err) throw err;
  console.log('connected');
});
setInterval(() => {
  get_total_data();
  get2fligh();
  get2land();
}, 3000)