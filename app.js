("use strict");

const express = require("express");
//const fs = require("fs");
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
let counter = 0;

async function initServer() {
  //const rawdata = fs.readFileSync("./data/test_flight_data_1.json");
  //test_flight_data = JSON.parse(rawdata);
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
    console.log(`INFO ${counter}: refresh_data`);

    //const rawdata = fs.readFileSync(`./data/test_flight_data_${counter}.json`);
    test_flight_data = await redis.get_flights();

    const res = {
      flights: test_flight_data,
    };

    io.emit("refrsh_data", res);

    //counter = (counter + 1) % 7;
  }, UPDATE_DELEY);
});
