
    function GetMap() {
        // var d = new MapLocation(30.723985,34.818144)
        cord = [];
        cord1 = [];
        // cord[0] = 30.723985,34.818144
        cord1[0] = 30.723985;
        cord1[1] = 34.818144;
        cord[0] = cord1;
        cord2 =[]
        cord2[0] = 31.999246;
        cord2[1] = 34.244618;
        cord[1] = cord2
        var map = new Microsoft.Maps.Map('#myMap', {});
        // let tuple:  [30.723985,34.818144]
        //Create an infobox at the center of the map but don't show it.
        var infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });

        //Assign the infobox to a map instance.
        infobox.setMap(map);

        //Create random locations in the map bounds.
        var randomLocations = Microsoft.Maps.TestDataGenerator.getLocations(5, map.getBounds());
        
        for (var i = 0; i < cord.length; i++) {
            // var cord4 = Microsoft.Maps.getLocation(cord[0]) 

            // var pin = new Microsoft.Maps.Pushpin(cord[i][0],cord[i][1]);
            var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(cord[i][0],cord[i][1]),{
                icon: 'https://icons.iconarchive.com/icons/google/noto-emoji-travel-places/24/42586-airplane-icon.png' 
            });
            //Store some metadata with the pushpin.
            pin.metadata = {
                title: 'Pin ' + i,
                description: 'Discription for pin ' + i + ' location ' +  cord[0] + ' location ' + randomLocations[i] + '  ' + randomLocations[i][0]
            };

            //Add a click event handler to the pushpin.
            Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);

            //Add pushpin to the map.
            map.entities.push(pin);
        }
    }

    function pushpinClicked(e) {
        //Make sure the infobox has metadata to display.
        if (e.target.metadata) {
            //Set the infobox options with the metadata of the pushpin.
            infobox.setOptions({
                location: e.target.getLocation(),
                title: e.target.metadata.title,
                description: e.target.metadata.description,
                visible: true
            });
        }
    }
