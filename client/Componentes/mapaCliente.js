Template.mapaCliente.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = Meteor.user().profile.empresaId;

        template.subscribe( 'DetalleDeEmpresa', empresaId);
        template.subscribe('VehiculosEmpresaId', empresaId)
    });
});

Template.mapaCliente.helpers({
    empresa() {
        return Empresas.find({_id: Meteor.user().profile.empresaId}).fetch()[0].nombre;
    },
    vehiculos() {
      return Vehiculos.find();
    }
});

Template.mapaCliente.onRendered( () => {

       var self = this;

    let mapa = Template.instance();

    mapa.subscribe('Vehiculos');



    GoogleMaps.ready('map', function(map) {

        var marker;

        mapa.autorun( () => {
            let empresaId = Meteor.user().profile.empresaId;
            mapa.subscribe('Empresas');
            mapa.subscribe('vehiculosGPS', empresaId)


            let vehicle;

            var contentString = 'Info';

            var infowindow = new google.maps.InfoWindow({
                                //content: contentString,
                                maxWidth: 200
                              });

            Vehiculos.find(/*{despachado: true}*/).forEach( function (v) {
              vehicle = new google.maps.Marker({
                          animation: google.maps.Animation.DROP,
                          position: new google.maps.LatLng(v.posicion.lat, v.posicion.lng),
                          icon: '/bus2.png', //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                          map: map.instance,
                          info: 'Placa ' + v.placa + '<br> Padron ' + v.padron,
                          id: v._id,
                          title: 'Datos'
              });

              google.maps.event.addListener(vehicle, 'click', function () {
                infowindow.setContent(this.info);
                infowindow.open(map.instance, this);
              });
            });

            /*vehicle.addListener('click', function() {
                  infowindow.open(map.instance, vehicle);
            });*/






            mapa.subscribe('RutasPorEmpresa', () => {
            let numero = 0;

                        mapa.defaultRuta = new ReactiveVar(Rutas.findOne()._id)

                        mapa.idaPath;
                        mapa.vueltaPath;
                        console.log(mapa.defaultRuta.get());

                        let ida;
                        let vuelta;

                        function addLine() {
                            mapa.idaPath.setMap(map.instance);
                            mapa.vueltaPath.setMap(map.instance);
                        }

                        function removeLine () {
                            mapa.idaPath.setMap(null);
                            mapa.vueltaPath.setMap(null);
                        }

                        function setMapOnAll(map, p, feature) {


                            marker = new google.maps.Marker({
                                        animation: google.maps.Animation.DROP,
                                        position: new google.maps.LatLng(p.lat, p.lng),
                                        icon: '/paradero.png', //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                                        map: map,
                                        id: ruta._id
                            });
                        }

                        // Removes the markers from the map, but keeps them in the array.
                        function clearMarkers() {
                            setMapOnAll(null);
                        }

                        // Shows any markers currently in the array.
                        function showMarkers() {
                            setMapOnAll(map);
                        }

                        // Deletes all markers in the array by removing references to them.
                        function deleteMarkers() {
                            clearMarkers();
                            markers = [];
                        }




                        $('select#ruta').on('change', function () {

                            Rutas.find({_id: this.value }).forEach( function (ruta) {
                                ida = ruta.ida;
                                vuelta = ruta.vuelta;



                                /*ruta.paraderos.forEach( function (p) {

                                    setMapOnAll(map.instance, p, 'parking')


                                });*/
                            });

                            if (mapa.idaPath) {

                               removeLine();
                               //deleteMarkers()
                            }
                                mapa.idaPath = new google.maps.Polyline({
                                    path: ida,
                                    geodesic: true,
                                    strokeColor: '#3498db',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 4
                                });

                                mapa.vueltaPath = new google.maps.Polyline({
                                        path: vuelta,
                                        geodesic: true,
                                        strokeColor: '#e67e22',
                                        strokeOpacity: 1.0,
                                        strokeWeight: 4
                                })



                                addLine();
                                //setMapOnAll(map.instance)

                        });


                });






        });

        var trafficLayer = new google.maps.TrafficLayer();
        mapa.modoTrafico = new ReactiveVar(false);
        $('.trafico').on('click', function () {
          if (mapa.modoTrafico.get() !== false) {
            trafficLayer.setMap(null);
            mapa.modoTrafico.set(false)
          } else {
            mapa.modoTrafico.set(true)
            trafficLayer.setMap(map.instance);
          }
        })


        map.instance.setZoom(13);


    });


});


Template.mapaCliente.events({

    'change #ruta'(e,t) {
        let target = e.currentTarget;
        let mapId = target.options[ target.selectedIndex ].value;
        console.log(mapId,'ruta cambiada');
    },

});

Template.mapaCliente.helpers({
    mapOptions: function() {
        var latLng = {lat: -12.0917633 , lng: -77.0279025}


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

            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: 13,
                styles: styles,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            };
        }
    },
    carga: function () {
        if (GoogleMaps.loaded()) {
            return true
        } else {
            return false
        }
    },
    empresa() {
        return Empresas.findOne({_id: Meteor.user().profile.empresaId});
    },
    ruta(id) {
        let ruta = Rutas.findOne({_id: id}) || { nombre: "" };
        console.log( ruta );
        return ruta.nombre;
    }
  });
