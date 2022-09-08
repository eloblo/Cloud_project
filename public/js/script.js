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

function createFlight(flight) {
  console.log(flight);

  const title = flight.hex;
  const location = new Microsoft.Maps.Location(flight.lat, flight.lng);
  const description = `Discription of ${title}`;

  const pin = new Microsoft.Maps.Pushpin(location, {
    icon: icons.airplane,
  });

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
const testBtn = document.getElementById("testBtn");

const takeTestData = () => {
  console.log("take test data");
  socket.emit("get_test_data", {});
};

window.addEventListener("load", function (e) {
  takeTestData();
});

testBtn.addEventListener("click", function (e) {
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
