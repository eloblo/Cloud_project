const kafka = require('./producer');
const AirAPI = require('./api2sql');

console.log("starting system-a:");
const refresh = 15 * 1000; // refresh time of data in miliseconds. do not put lower than 5 seconds
AirAPI.load_data(refresh);
kafka.produce(refresh);
