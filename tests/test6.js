const fs = require('fs');
const MysqlJson = require('mysql-json');

const mysqlJson = new MysqlJson({
    host:'127.0.0.1',
    user:'root',
    password:'Aa123456',
    database:'mysql'
});

const tables = ['flights_to', 'flights_from', 'schedules_to', 'schedules_from']

mysqlJson.connect(function(err, response){
    if(err) throw err;
});

mysqlJson.query(`SELECT f2.* , s2.dep_time_utc, s2.dep_estimated_utc, s2.dep_actual_utc, s2.arr_time_utc, s2.arr_estimated_utc, s2.cs_flight_number, \
                  s2.cs_flight_iata, s2.dep_time_ts, s2.duration, s2.delay, s2.arr_time_ts, s2.dep_time_ts, s2.arr_estimated_ts, s2.dep_estimated_ts, \
                  s2.dep_actual_ts FROM ${tables[0]} f2 JOIN ${tables[2]} s2 ON f2.flight_number=s2.cs_flight_number UNION \
                  SELECT f1.* , s1.dep_time_utc, s1.dep_estimated_utc, s1.dep_actual_utc, s1.arr_time_utc, s1.arr_estimated_utc, s1.cs_flight_number, \
                  s1.cs_flight_iata, s1.dep_time_ts, s1.duration, s1.delay, s1.arr_time_ts, s1.dep_time_ts, s1.arr_estimated_ts, s1.dep_estimated_ts, \
                  s1.dep_actual_ts FROM ${tables[1]} f1 JOIN ${tables[3]} s1 ON f1.flight_number=s1.cs_flight_number`, function(err, response) {
    if (err) throw err;
    var raw = JSON.stringify(response)
    fs.writeFileSync('./test/flight_data.json', raw, function(err){
        if(err) throw err;
    })
});