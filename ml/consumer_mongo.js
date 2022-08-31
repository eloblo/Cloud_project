const Kafka = require("node-rdkafka");
const MongoClient = require('mongodb').MongoClient;

// kafka info

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
const topic = `${prefix}landed`;
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf);

// mongodb info
const port = 27017
const database = "flights"
const collection = "historical"
const url = `mongodb://localhost:${port}`;


module.exports.save_flights = function(){
    consumer.connect();
    consumer.on('ready', () => {
        consumer.subscribe(topics);
        console.log('consumer mongodb: connected and ready')
        consumer.consume();
    }).on('data', (data) => {
        var res = JSON.parse(data.value.toString())
        res.forEach(flight => {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db(database);
                // no need for duplicated data. check if the flight exist in the database
                dbo.collection(collection).find(flight).toArray(function(err, result) {
                    if (err) throw err;
                    if(result.length == 0){
                        dbo.collection(collection).insertOne(flight, function(err, response){
                            if (err) throw err;
                            console.log(`mongodb: flight ${flight.cs_flight_number} was uploaded`)
                        })
                    }
                });
            });
        });
    })
}



