("use strict");

const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const axios = require('axios');
const airports = {'VIE':40001, 'BRU':56001, 'CRL':56002, 'BAH':48001, 'SOF':100001, 'VAR':100002, 'YUL':124001, 'YYZ':124002, 'PEK':156001, 'SZX':156002, 'CAN':156003,
'HKG':156004, 'PVG':156005, 'CTU':156006, 'LCA':196001, 'PFO':196002, 'PRG':203001, 'CPH':208001, 'CAI':818001, 'HEL':246001, 'LBG':250001, 'CDG':250002, 'ORY':250003,
'LYS':250004, 'BOD':250005, 'MRS':250006, 'NTE':250007, 'NCE':250008, 'TLS':250009, 'FKB':276001, 'BER':276002, 'DUS':276003, 'FRA':276004, 'HAM':276005, 'FMM':276006,
'MUC':276007, 'ATH':300001, 'SKG':300002, 'HER':300003, 'JTR':300004, 'JMK':300005, 'PAS':300006, 'CHQ':300007, 'CFU':300008, 'RHO':300009, 'ZTH':300010, 'KGS':300011,
'KLX':300012, 'BUD':348001, 'DEB':348002, 'BLR':356001, 'BOM':356002, 'DEL':356003, 'TLV':376001, 'BRI':380001, 'BLQ':380002, 'CTA':380003, 'MXP':380004, 'NAP':380005,
'FCO':380006, 'TRN':380007, 'VCE':380008, 'TSF':380009, 'VRN':380010, 'NRT':392001, 'VNO':440001, 'CAS':504001, 'RAK':504002, 'AMS':528001, 'EIN':528002, 'OSL':578001,
'MNL':608001, 'GDN':616001, 'KTW':616002, 'KRK':616003, 'LUZ':616004, 'POZ':616005, 'RZE':616006, 'WAW':616007, 'LIS':620001, 'OTP':642001, 'CLJ':642002, 'IAS':642003,
'SEZ':690001, 'LED':643001, 'DME':643002, 'KRR':643003, 'ROV':643004, 'AER':643005, 'MRV':643006, 'SVX':643007, 'LJU':705001, 'ZAG':191001, 'DBV':191002, 'RJK':191003,
'KBP':804001, 'HRK':804002, 'LWO':804003, 'ODS':804004, 'VIN':804005, 'OZH':804006, 'DNK':804007, 'GYD':31001, 'BUS':268001, 'TBS':268002, 'NVI':860001, 'TAS':860002,
'JNB':710001, 'CPT':710002, 'ARN':752001, 'GVA':756001, 'BSL':756002, 'MLH':756002, 'EAP':756002, 'ZRH':756003, 'BKK':764001, 'IST':792001, 'ADB':792002,  // bsl has 3 iata codes
'AYT':792003, 'AUH':784001, 'DXB':784002, 'LTN':826001, 'LHR':826002, 'MAN':826003, 'LGW':826004, 'ATL':840001, 'BOS':840002, 'ORD':840003, 'LAX':840004, 'MIA':840005,
'JFK':840006, 'SFO':840007, 'IAD':840008, 'MLA':470001, 'MEX':484001, 'RIX':428001, 'MAD':724001, 'BCN':724002, 'SAW':792004, 'EWR':840009, 'BOJ':100003, 'KIV':498001,
'ZIA':643008, 'DLM':792005, 'CMN':504003, 'BEG':688001, 'ADD':231001, 'PDL':620002, 'PVK':300013, 'BGY':380011, 'SSH':818002, 'AMM':400001, 'ETM':376002, 'HKT':764002,
'FRG':840010, 'FNC':620003, 'FLR':380012
};

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

function initServer() {
  const rawdata = fs.readFileSync("./data/test_flight_data_1.json");
  test_flight_data = JSON.parse(rawdata);
}

async function call_ml(flight){
  var dep_delayed = 0
  if(flight.dep_delayed){
      if(flight.dep_delayed > 15){ dep_delayed = 1}
      if(flight.dep_delayed > 60){ dep_delayed = 2}
  }

  var date = new Date(flight.dep_time)
  const params = {
    arr_airport: flight.arr_iata,
    dep_airport: flight.dep_iata,
    month: date.getMonth() +1,
    day_date: date.getDate(),
    day_week: date.getDay() +1,
    hour: date.getHours(),
    dep_delay: dep_delayed,
    duration: flight.duration
  }
  var data = await axios.get('http://127.0.0.1:4000/flight_delay', {params});
  return data;
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

  const interval = setInterval(() => {
    console.log(`INFO ${counter}: refrsh_data`);

    const rawdata = fs.readFileSync(`./data/test_flight_data_${counter}.json`);
    test_flight_data = JSON.parse(rawdata);

    const res = {
      flights: test_flight_data,
    };

    io.emit("refrsh_data", res);

    counter = (counter + 1) % 7;
  }, UPDATE_DELEY);
});
