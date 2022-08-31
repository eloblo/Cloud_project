("use strict");

const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const PORT = 8181;
const SERVER_DOMAIN = "localhost";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//
const rawdata = fs.readFileSync("./data/flight_data.json");
const flight_data = JSON.parse(rawdata);

//

app.use(express.static("public"));



app.get("/testData", (req, res) => {
  res.send(flight_data);
});

//

server.listen(PORT, () => {
  console.log(`app listening at http://${SERVER_DOMAIN}:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("test data", (data) => {
    console.log("gives test data");

    io.emit("test data", flight_data);
  });
});

app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname + "/" });
});
