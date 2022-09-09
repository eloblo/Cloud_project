// init socket
const socket = io();
// globals
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
  const title = flight.hex;
  const location = new Microsoft.Maps.Location(flight.lat, flight.lng);
  const description = `Discription of ${title}`; // 
  const pin = new Microsoft.Maps.Pushpin(location,  { icon: createRedArrow(flight.dir)});
  pin.metadata = {
    title: `Title of ${title}`,
    description: description,
  };

  // event handlers
  Microsoft.Maps.Events.addHandler(pin, "click", pushpinClicked);

  // add the pin to the map.
  map.entities.push(pin);
}

function pushpinClicked(e) {
  if (e.target.metadata) {
    infobox.setOptions({
      location: e.target.getLocation(),
      title: e.target.metadata.title,
      description: e.target.metadata.description,
      visible: true,
    });
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
