const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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
const producer = new Kafka.Producer.createWriteStream(kafkaConf, {}, {
    topic: topic
});

console.log('producer');
producer.on("ready", function(arg) {
    console.log(`producer Ariel is ready.`);
  });
producer.connect();

function sendmsg(msg){
    var s = producer.write(msg);
    if(s) {console.log('sent msg');}
    else {console.log('failed');}
}

setInterval(() => {
    sendmsg('hello world');
}, 3000)