const kafka_2land = require('./consumer_2land.js')
const kafka_2fligh = require('./consumer_2flight.js')
const kafka_weather = require('./consumer_weather.js')
// there is a bug in app if there are at least 3 consumers running the server stops