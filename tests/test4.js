var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aa123456",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});