

var socket = io();

const testBtn = document.getElementById("testBtn");

const takeTestData = () => {
  console.log("take test data");
  socket.emit("test data", {});
};

window.addEventListener("load", function (e) {
  takeTestData();
});

testBtn.addEventListener("click", function (e) {
  takeTestData();
});
// const
const latData = [];
var flights;
socket.on("test data", function (data) {
  console.log("the test data");
  // flights = data
  data.forEach((item) => {
    flights = item
    // console.log("test item: " + JSON.stringify(item));
    console.log("test item: " + JSON.stringify(item.hex + " "+ item.lat + " " + item.lng + " "));
  });
});
// console.log(flights)

//////

function pushpinClicked(e) {
  //Make sure the infobox has metadata to display.
  if (e.target.metadata) {
    //Set the infobox options with the metadata of the pushpin.
    infobox.setOptions({
      location: e.target.getLocation(),
      title: e.target.metadata.title,
      description: e.target.metadata.description,
      visible: true,
    });
  }
}

var map, infobox;
function getMap() {
  
  // var mapflghts = flights
  // var d = new MapLocation(30.723985,34.818144)
  cord = [];
  cord1 = [];
  // cord[0] = 30.723985,34.818144
  cord1[0] = 30.723985;
  cord1[1] = 34.818144;
  cord[0] = cord1;
  cord2 = [];
  cord2[0] = 31.999246;
  cord2[1] = 34.244618;
  cord[1] = cord2;

  map = new Microsoft.Maps.Map("#map", {});
  // let tuple:  [30.723985,34.818144]
  //Create an infobox at the center of the map but don't show it.
  infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
    visible: false,
  });

  //Assign the infobox to a map instance.
  infobox.setMap(map);

  //Create random locations in the map bounds.
  var randomLocations = Microsoft.Maps.TestDataGenerator.getLocations(
    5,
    map.getBounds()
  );

  for (var i = 0; i < randomLocations.length; i++) {
    // var cord4 = Microsoft.Maps.getLocation(cord[0])

    // var pin = new Microsoft.Maps.Pushpin(cord[i][0],cord[i][1]);
    // var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(flights.lat,flights.lng),{
    var pin = new Microsoft.Maps.Pushpin(randomLocations[i], {
      icon: "https://icons.iconarchive.com/icons/google/noto-emoji-travel-places/32/42586-airplane-icon.png",
    });
    //Store some metadata with the pushpin.
    pin.metadata = {
      title: "Pin " + i,
      description:
        "Discription for pin " +
        i +
        " location " +
        cord[0] +
        " location " +
        randomLocations[i] +
        "  " +
        randomLocations[i][0],
    };

    //Add a click event handler to the pushpin.
    Microsoft.Maps.Events.addHandler(pin, "click", pushpinClicked);
    //Add pushpin to the map.
    map.entities.push(pin);
  }
}

//41,925
