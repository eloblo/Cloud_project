const exp = require('express');
const {PythonShell} = require('python-shell');
const consumer = require('./../consumer_mongo');

const script = 'ml.py';  // will respond: Normal <= 15, Late > 15, Delayed > 60
const app = exp();

// API call must contain parameters ['dep_airport', 'arr_airport', 'month', 'day_date', 'day_week', 'hour', 'duration']
app.get('/flight_delay', function(req,res) {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], 
          scriptPath: './ml', 
        args: [req.query.dep_airport, req.query.arr_airport, req.query.month, req.query.day_date, req.query.day_week, req.query.hour, req.query.duration] 
    };
    // run the ML script and send the result
    PythonShell.run(script, options, function (err, results) {
        if (err) {throw err};
        res.send(results);
    })
})

const port = 4000
const server = app.listen(port);

console.log(`system-c: flight_delay machine learning server on port ${port}`)
// start consuming landed flight data and upload to mongodb
consumer.save_flights()