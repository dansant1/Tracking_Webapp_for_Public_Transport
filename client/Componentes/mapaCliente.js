
Template.mapaCliente.onCreated(function() {
    var self = this;


    GoogleMaps.ready('map', function(map) {
        var marker;

        console.log(map);

        // Create and move the marker when latLng changes.
        self.autorun(function() {
            var latLng = {lat: -12.0196011 , lng: -77.0968634}
            if (! latLng)
              return;
            console.log('yes');
            // If the marker doesn't yet exist, create it.
            if (! marker) {
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(latLng.lat, latLng.lng),
                map: map.instance
              });
            }
            // The marker already exists, so we'll just change its position.
            else {
              marker.setPosition(latLng);
            }
            
            // Center and zoom the map view onto the current position.
            map.instance.setCenter(marker.getPosition());
            map.instance.setZoom(15);
        });
    });
});

Template.mapaCliente.helpers({
    mapOptions: function() {
        var latLng = {lat: -12.0196011 , lng: -77.0968634}

        console.log(latLng);
        var styles = [
            {
                stylers: [
                    { hue: "#1784C7" },
                    { saturation: -20 }
                ]
            },{
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  { lightness: 100 },
                  { visibility: "simplified" }
                ]
            },{
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];

        // Initialize the map once we have the latLng.
        if (GoogleMaps.loaded() && latLng) {
            console.log('funco');
            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: 15,
                styles: styles
            };
        }
    },
    carga: function () {
        if (GoogleMaps.loaded()) {
            console.log('Cargo');
            return true
        } else {
            return false
        }
    }
  });