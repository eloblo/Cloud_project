("use strict");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const redis = require('./redis.js')
const kafka_default = require('./consumers/consumer_default.js')


// config
const PORT = 8080;
const SERVER_DOMAIN = "localhost";

const UPDATE_DELEY = 15 * 1000;

// init server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// globals
let test_flight_data = null;

async function initServer() {
  redis.connect_db()
  test_flight_data = await redis.get_flights();
}

initServer();

// routes
app.use(express.static("public"));
app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

app.get("/testData", (req, res) => {
  res.send(test_flight_data);
});

// open server
server.listen(PORT, () => {
  console.log(`app listening at http://${SERVER_DOMAIN}:${PORT}`);
});

io.on("connection", (socket) => {
  // connection
  console.log("INFO: A user connected");

  // routes
  socket.on("disconnect", () => {
    console.log("INFO: User disconnected");
    clearInterval(interval);
  });

  socket.on("get_test_data", (data) => {
    console.log("INFO: get_test_data");

    const res = {
      flights: test_flight_data,
    };

    io.emit("get_test_data", res);
  });

  const interval = setInterval(async () => {
    console.log(`system-b: refresh_data`);
    test_flight_data = await redis.get_flights();
    var to_fligh = await redis.get_value("2fligh");
    var to_land = await redis.get_value("2land");
    var str_weather = await redis.get_value("weather");
    var weather = JSON.parse(str_weather.toString());

    const res = {
      flights: test_flight_data,
    };

    io.emit("refrsh_data", res);
    io.emit("2fligh",to_fligh);
    io.emit("2land",to_land);
    io.emit("weather",weather);
  }, UPDATE_DELEY);
});
