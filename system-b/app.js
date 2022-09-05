("use strict");

const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

// config
const PORT = 8080;
const SERVER_DOMAIN = "localhost";

// init server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// globals
let test_flight_data = null;

function initServer() {
  const rawdata = fs.readFileSync("./data/test_flight_data.json");
  test_flight_data = JSON.parse(rawdata);
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
  });

  socket.on("get_test_data", (data) => {
    console.log("INFO: get_test_data");

    const res = {
      flights: test_flight_data,
    };

    io.emit("get_test_data", res);
  });
});
