function GetMap()
    {
        var map = new Microsoft.Maps.Map('#myMap');
        map.setView({
            center: new Microsoft.Maps.Location(32.007224, 34.883394),
            zoom:8
        });
        cord = []
        // cord[0] = (30.723985, )
        //  31.999246, 34.244618
        cord1 = [];
        cord1[0] = 30.723985;
        cord1[1] = 34.818144;
        cord[0] = cord1;
        cord1 =[]
        cord1[0] = 31.999246;
        cord1[1] = 34.244618;
        cord[1] = cord1
        setPushpin(cord);
        function setPushpin(cord){

            for (var i = 0; i < cord.length; i++)
            {
                var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(cord[i][0], cord[i][1]),{
                    map:map,
                    icon: 'https://icons.iconarchive.com/icons/google/noto-emoji-travel-places/24/42586-airplane-icon.png'
                })
                // var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(cord[i][0], cord[i][1]),null);
                // Microsoft.Maps.Events.addHandler(pushpin, 'mouseup', ZoomIn);

                var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(cord[i][0], cord[i][1]), { title: 'Map Center', description: 'Seattle', visible: false });
                infobox.setMap(map);
                Microsoft.Maps.Events.addHandler(pushpin, 'click', function () {
                    infobox.setOptions({ visible: true });
                })
                map.entities.push(pushpin);
        }
        // function ZoomIn(e) {
        //     if (e.targetType == 'pushpin') {
        //         var location = e.target.getLocation();
        //         map.setView({
        //             zoom: 5,
        //             center: location
        //         });
        //     }
        // }
    }

    }
