Template.Rutas.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = Meteor.user().profile.empresaId;

        template.subscribe( 'DetalleDeEmpresa', empresaId);
    });
});

Template.Rutas.helpers({
    empresa() {
        return Empresas.find({_id: Meteor.user().profile.empresaId}).fetch()[0].nombre;
    }
});

Template.Rutas.onRendered( () => {

       var self = this;

    let mapa = Template.instance();

    

    GoogleMaps.ready('map', function(map) {

        var marker;

        mapa.autorun( () => {

            mapa.subscribe('Empresas');

            let empresaId = Meteor.user().profile.empresaId;


               
                   
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

                                

                                ruta.paraderos.forEach( function (p) {
                                    
                                    setMapOnAll(map.instance, p, 'parking')
                                       
                                }); 
                            });

                            if (mapa.idaPath) {
                                
                               removeLine();
                               //clearMarkers()
                            } 
                                mapa.idaPath = new google.maps.Polyline({
                                    path: ida,
                                    geodesic: true,
                                    strokeColor: '#3498db',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2
                                });    

                                mapa.vueltaPath = new google.maps.Polyline({
                                        path: vuelta,
                                        geodesic: true,
                                        strokeColor: '#2ecc71',
                                        strokeOpacity: 1.0,
                                        strokeWeight: 2
                                })


                                    
                                addLine();
                             
                        });
       
                
                });
               
                
                  
                    
           
             
        });

        //

        map.instance.setZoom(14);    


    });


});


Template.Rutas.helpers({
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
                zoom: 14,
                styles: styles
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
    empresas() {
        console.log(Empresas.find({_id: Meteor.user().profile.empresaId}).fetch()[0].rutas);
        return Empresas.find({_id: Meteor.user().profile.empresaId}).fetch()[0].rutas;
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    }
  });

Template.RutaManual.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = Meteor.user().profile.empresaId;
        console.log(empresaId);
        template.subscribe( 'RutasPorEmpresa', empresaId);
    });
});

Template.RutaManual.helpers({
    rutas() {
        return Rutas.find();
    }
});

Template.RutaManual.events({
    'click .remove'() {
        Meteor.call('eliminarRuta', this._id, (err) => {
            if (err) {
                Bert.alert('Hubo un error, vuelva a intentarlo', 'danger', 'growl-top-right');
            } else {
                Bert.alert('Ruta Eliminada', 'success', 'growl-top-right');
            }
        });
    }
});