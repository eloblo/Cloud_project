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
const topic = `${prefix}default`;
const producer = new Kafka.Producer(kafkaConf);

console.log('producer');
producer.connect();

function sendmsg(msg){
  producer.produce(topic, -1, Buffer.from(JSON.stringify(msg))); 
}

mysqlJson.connect(function(err, response){
  if(err) throw err;
  console.log('connected');
});
setInterval(() => {
  // mysql code for combined stored data, left join produces more data but lacks schedules
  mysqlJson.query("SELECT * FROM flights_to JOIN schedules_to ON flights_to.flight_number=schedules_to.cs_flight_number UNION \
                  SELECT * FROM flights_from JOIN schedules_from ON flights_from.flight_number=schedules_from.cs_flight_number", function(err, response) {
    if (err) throw err;
    sendmsg(response);
  });
}, 3000)