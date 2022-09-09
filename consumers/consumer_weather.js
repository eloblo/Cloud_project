const Kafka = require("node-rdkafka");

const kafkaConf = {
  "group.id": "Ariel_cloud_project",
  "metadata.broker.list": "moped-01.srvs.cloudkafka.com:9094,moped-02.srvs.cloudkafka.com:9094,moped-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "w7rglkzc",
  "sasl.password": "7w4xX7riGgVOzOZqcCh_ET55EWoSh9n2"
};

const prefix = "w7rglkzc-";
// default: returns an array of all flights and their information. importently location, schedules, delay, country of origin and destinetion
// 2fligh: returns an array of up to the length of 2 [to_fligh: number, ...]. the sum of numbers is the number of total planes that will takeof in the next 15 minutes
// 2land: returns an array of up to the length of 2 [to_land: number, ...]. the sum of numbers is the number of total planes that will land in the next 15 minutes
// weather: returns data of the current weather in TLV (untis are in metrics) example:
// {"observation_time":"02:14 PM","temperature":32,"weather_code":113,"weather_icons":["https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"],
// "weather_descriptions":["Sunny"],"wind_speed":20,"wind_degree":300,"wind_dir":"WNW","pressure":1004,"precip":0,"humidity":43,"cloudcover":0,"feelslike":36,"uv_index":8,
// "visibility":10,"is_day":"yes"}
//const topics = [`${prefix}default`,`${prefix}2fligh`,`${prefix}2land`,`${prefix}weather`]
const topic = `${prefix}weather`;
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf);

console.log('consumer weather');
consumer.connect();
consumer.on('ready', () => {
    consumer.subscribe(topics);
    consumer.consume();
}).on('data', (data) => {
    // add whatever needs to be done with the newly uploaded kafka data
    console.log(data.value.toString());  
})
