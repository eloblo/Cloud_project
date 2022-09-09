// init socket
const socket = io();

// globals
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
let map;
let infobox;

let flights = [];

const icons = {
  airplane: "images/airplane-32.png",
};

// Map
function getMap() {
  // Create Map
  map = new Microsoft.Maps.Map("#map", {});

  // Create Infobox
  infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
    visible: false,
  });

  infobox.setMap(map);

  // load data
  refresh();
}

function refresh() {
  map.entities.clear();

  for (let i = 0; i < flights.length; i++) {
    const flight = flights[i];

    createFlight(flight);
  }
}

function createRedArrow(heading) {
  var c = document.createElement('canvas');
  c.width = 24;
  c.height = 24;
  var ctx = c.getContext('2d');
  // Offset the canvas such that we will rotate around the center of our arrow
  ctx.translate(c.width * 0.5, c.height * 0.5);
  // Rotate the canvas by the desired heading
  ctx.rotate(heading * Math.PI / 180);
  //Return the canvas offset back to it's original position
  ctx.translate(-c.width * 0.5, -c.height * 0.5);
  ctx.fillStyle = '#f00';
  // Draw a path in the shape of an arrow.
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(5, 20);
  ctx.lineTo(12, 15);
  ctx.lineTo(19, 20);
  ctx.lineTo(12, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Generate the base64 image URL from the canvas.
  return c.toDataURL();
}

async function createFlight(flight) {
  const title = flight.flight_iata;
  const location = new Microsoft.Maps.Location(flight.lat, flight.lng);
  const pin = new Microsoft.Maps.Pushpin(location,  { icon: createRedArrow(flight.dir)});
  pin.metadata = {
    title: `Title of ${title}`,
    flight: flight
    // description: description,
  };

  // event handlers
  Microsoft.Maps.Events.addHandler(pin, "click", pushpinClicked);

  // add the pin to the map.
  map.entities.push(pin);
}

async function pushpinClicked(e) {
  if (e.target.metadata) {
    const flight = e.target.metadata.flight
    var dep_delayed = 0
    if(flight.dep_delayed){
        if(flight.dep_delayed > 15){ dep_delayed = 1}
        if(flight.dep_delayed > 60){ dep_delayed = 2}
    }
    var date = new Date(flight.dep_time_utc)
    const params = {
      arr_airport: airports[flight.arr_iata],
      dep_airport: airports[flight.dep_iata],
      month: date.getMonth() +1,
      day_date: date.getDate(),
      day_week: date.getDay() +1,
      hour: date.getHours(),
      dep_delay: dep_delayed,
      duration: flight.duration
    }
    var res = await fetch(`http://127.0.0.1:4000/flight_delay?arr_airport=${params.arr_airport}&dep_airport=${params.dep_airport}&month=${params.month}&day_date=${params.day_date}&day_week=${params.day_week}&hour=${params.hour}&duration=${params.duration}&dep_delay=${params.dep_delay}`)
    var js = await res.json()
    infobox.setOptions({
      location: e.target.getLocation(),
      title: e.target.metadata.title,
      description: `location: lat:${e.target.getLocation().latitude}, lng:${e.target.getLocation().longitude} \n
      deprature: ${flight.dep_iata}, arrival: ${flight.arr_iata} \n
      departure time UTC: ${flight.dep_time_utc} \n            
      arrival time UTC: ${flight.arr_time_utc} \n                
      estimated delay: ${js}`,
      visible: true,
    });
  }
}

function find_flight(hex){
  for (let i = 0; i < flights.length; i++) {
    if(flights[i].hex == hex){
      return flights[i];
    }
  }
}

// UI
const takeTestData = () => {
  console.log("take test data");
  socket.emit("get_test_data", {});
};

window.addEventListener("load", function (e) {
  takeTestData();
});

// Socket
socket.on("get_test_data", function (data) {
  console.log("get_test_data");

  flights = data.flights;

  refresh();
});

socket.on("refrsh_data", function (data) {
  console.log("refrsh_data");

  flights = data.flights;

  refresh();
});
