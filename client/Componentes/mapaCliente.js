Template.mapaCliente.onCreated(() => {
    let template = Template.instance();

    template.query = new ReactiveVar(false);
    template.schematic = new ReactiveVar(false);
    template.ruta = new ReactiveVar(false);
    template.vehiculo = new ReactiveVar(false);
    template.listadevehiculos = new ReactiveVar(false);

    template.verparaderos = new ReactiveVar(false);
    template.verpuntosdecontrol = new ReactiveVar(false);
    template.modotrafico = new ReactiveVar(false);
    template.vergeocerca = new ReactiveVar(false);

    template.autorun(() => {
        let empresaId = Meteor.user().profile.empresaId;

        template.subscribe('DetalleDeEmpresa', empresaId);
        template.subscribe('VehiculosEmpresaId', empresaId);
        template.subscribe('rutasPorEmpresa', empresaId);


    });
});

Template.mapaCliente.helpers({
    empresa() {
        return Empresas.findOne({ _id: Meteor.user().profile.empresaId });
    },
    vehiculos() {
        let query = {};
        let rutaId = Template.instance().ruta.get();
        let vehiculoId = Template.instance().vehiculo.get();

        if (rutaId) {
            query["rutaId"] = rutaId;
        }

        if (vehiculoId) {
            query["_id"] = vehiculoId;
        }

        return Vehiculos.find(query);
    },
    ruta(id) {
        let ruta = Rutas.findOne({_id: id}) || {nombre: ""};
        return ruta.nombre;
    }
});

Template.mapaCliente.onRendered(() => {

    $('.content-wrapper').css('height', $(window).height() + 'px');
    $(window).resize(()=> {
        $('.content-wrapper').css('height', $(window).height() + 'px');
    });

    let self = this;

    let ida;
    let vuelta;

    let mapa = Template.instance();

    GoogleMaps.ready('map', function (map) {

        let marker;

        let vehicleMarkers = [];
        let verparaderosMarker = [];
        let puntosdecontrolMaker = [];

        mapa.autorun(() => {

            let empresaId = Meteor.user().profile.empresaId;

            mapa.subscribe('vehiculosGPS', empresaId);
            mapa.subscribe('VehiculosPorEmpresaId', empresaId);

            let vehicle;
            let listadevehiculos;

            var contentString = 'Info';

            var infowindow = new google.maps.InfoWindow({
                //content: contentString,
                maxWidth: 200
            });
            // Limpiando el mapa
            for (let i = 0; i < vehicleMarkers.length; i++) {
                vehicleMarkers[i].setMap(null);
            }
            vehicleMarkers = [];

            // listadevehiculos
            let query = {};
            let rutaId = mapa.ruta.get();
            let vehiculoId = mapa.vehiculo.get();

            if (rutaId) {
                query["rutaId"] = rutaId;
            }

            if (vehiculoId) {
                query["_id"] = vehiculoId;
            }

            listadevehiculos = Vehiculos.find(query);

            listadevehiculos.forEach(function (v) {
                vehicleMarker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(v.posicion.lat, v.posicion.lng),
                    icon: '/bus2.png', //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                    map: map.instance,
                    info: 'Placa ' + v.placa + '<br> Padron ' + v.padron,
                    id: v._id,
                    title: 'Datos'
                });

                vehicleMarkers.push(vehicleMarker);

                google.maps.event.addListener(vehicleMarker, 'click', function () {
                    infowindow.setContent(this.info);
                    infowindow.open(map.instance, this);
                });

            });

            /*vehicle.addListener('click', function() {
             infowindow.open(map.instance, vehicle);
             });*/


            // mapa.subscribe('RutasPorEmpresa', () => {

            let subRutasPorEmp = mapa.subscribe('RutasPorEmpresa');

            let numero = 0;

            if (subRutasPorEmp.ready() && mapa.ruta.get()) {

                mapa.defaultRuta = mapa.ruta.get();

                mapa.idaPath;
                mapa.vueltaPath;

                function centerOnPath(obj1, obj2) {
                    let bounds = new google.maps.LatLngBounds();
                    let points = _.union(obj1.getPath().getArray(), obj2.getPath().getArray());

                    for (let n = 0; n < points.length; n++) {
                        bounds.extend(points[n]);
                    }
                    map.instance.fitBounds(bounds);
                }

                function addLine() {
                    mapa.idaPath.setMap(map.instance);
                    mapa.vueltaPath.setMap(map.instance);
                    centerOnPath(mapa.idaPath, mapa.vueltaPath);
                }

                function removeLine() {
                    mapa.idaPath.setMap(null);
                    mapa.vueltaPath.setMap(null);
                }


                function setMapOnAll(map, p, feature) {

                    if (mapa.verparaderos.get()) {

                        marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(p.lat, p.lng),
                            icon: '/paradero.png', //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                            map: map,
                            id: ruta._id
                        });
                        verparaderosMarker.push(marker);

                    } //verparaderos


                    if (mapa.verpuntosdecontrol.get()) {

                        marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(p.lat, p.lng),
                            icon: {
                                url: '/check-point.png', // url
                                scaledSize: new google.maps.Size(30, 30), // scaled size
                                origin: new google.maps.Point(0, 0), // origin
                                anchor: new google.maps.Point(15, 15) // anchor
                            },
                            map: map,
                            id: ruta._id
                        });

                        puntosdecontrolMaker.push(marker);

                    } //verpuntosdecontrol

                }

                // Removes the markers from the map, but keeps them in the array.
                function clearMarkers() {
                    verparaderosMarker.forEach((marker) => marker.setMap(null));
                    puntosdecontrolMaker.forEach((marker) => marker.setMap(null));
                }

                // Shows any markers currently in the array.
                function showMarkers() {
                    setMapOnAll(map);
                }

                // Deletes all markers in the array by removing references to them.
                function deleteMarkers() {
                    clearMarkers();
                    verparaderosMarker = [];
                    puntosdecontrolMaker = [];
                }


                // $('select#ruta').on('change', function () {

                // let rutaId = mapa.ruta.get();

                if (rutaId) {
                    deleteMarkers();

                    Rutas.find({_id: rutaId}).forEach(function (ruta) {
                        ida = ruta.ida;
                        vuelta = ruta.vuelta;

                        if (_.has(ruta, "paraderos")) {

                            ruta.paraderos.forEach(function (p) {

                                setMapOnAll(map.instance, p, 'parking')


                            });

                        }

                        if (_.has(ruta, "puntosdecontrol")) {


                            ruta.puntosdecontrol.forEach(function (p) {

                                setMapOnAll(map.instance, p, 'puntodecontrol')


                            });

                        }

                    });

                    if (mapa.idaPath) {
                        removeLine();
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
                }
                // });


                // });

            }

            if ( mapa.vergeocerca.get() ){
              Modules.client.activarGeocerca( mapa, map.instance, ida, vuelta );
            } else {
              if ( typeof mapa.goingPath !== 'undefined' ){
                mapa.goingPath.setMap( null );
              }
              if ( typeof mapa.returnPath !== 'undefined' ){
                mapa.returnPath.setMap( null );
              }
            }


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
    'click #vergeocerca'(e,t){
      let instance = Template.instance();

      instance.vergeocerca.set(
        ! instance.vergeocerca.get()
      );
    },

    'change #ruta'(e, t) {
        let instance = Template.instance();

        let target = e.currentTarget;
        let rutaId = target.options[target.selectedIndex].value;

        instance.ruta.set(rutaId === "0" ? false : rutaId);
        instance.vergeocerca.set( false );
    },

    'change #vehiculo'(e, t) {
        let target = e.currentTarget;
        let vehiculoId = target.options[target.selectedIndex].value;

        Template.instance().vehiculo.set(vehiculoId === "0" ? false : vehiculoId);
    },
    'click #verparaderos'(e, t){
        let value = Template.instance().verparaderos.get();
        Template.instance().verparaderos.set(!value);
    },
    'click #verpuntosdecontrol'(e, t){
        let value = Template.instance().verpuntosdecontrol.get();
        Template.instance().verpuntosdecontrol.set(!value);
    },
    'click #modotrafico'(e, t){
        let value = Template.instance().modotrafico.get();
        Template.instance().modotrafico.set(!value);
    },

});

Template.mapaCliente.helpers({
    mapOptions: function () {
        var latLng = {lat: -12.0917633, lng: -77.0279025}


        var styles = [
            {
                stylers: [
                    {hue: "#1784C7"},
                    {saturation: -20}
                ]
            }, {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    {lightness: 100},
                    {visibility: "simplified"}
                ]
            }, {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    {visibility: "off"}
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
    }
});


Template.adminMapaCliente.onCreated(() => {
    let template = Template.instance();

    template.query = new ReactiveVar(false);
    template.schematic = new ReactiveVar(false);
    template.ruta = new ReactiveVar(false);
    template.vehiculo = new ReactiveVar(false);
    template.listadevehiculos = new ReactiveVar(false);

    template.verparaderos = new ReactiveVar(false);
    template.verpuntosdecontrol = new ReactiveVar(false);
    template.modotrafico = new ReactiveVar(false);
    template.vergeocerca = new ReactiveVar(false);

    template.empresaId = new ReactiveVar(false);

    template.autorun(() => {

        let empresaId = template.empresaId.get();

        if (empresaId) {

            template.subscribe('DetalleDeEmpresa', empresaId);
            template.subscribe('VehiculosEmpresaId', empresaId);


        }

    });
});

Template.adminMapaCliente.helpers({
    empresas(){
        return Empresas.find({}).fetch();
    },
    vehiculos() {
        let query = {};
        let rutaId = Template.instance().ruta.get();
        let vehiculoId = Template.instance().vehiculo.get();

        if (rutaId) {
            query["rutaId"] = rutaId;
        }

        if (vehiculoId) {
            query["_id"] = vehiculoId;
        }

        return Vehiculos.find(query);
    }
});

Template.adminMapaCliente.onRendered(() => {

    $('.content-wrapper').css('height', $(window).height() + 'px');
    $(window).resize(()=> {
        $('.content-wrapper').css('height', $(window).height() + 'px');
    });

    let self = this;

    let ida;
    let vuelta;

    let mapa = Template.instance();

    GoogleMaps.ready('map', function (map) {

        let marker;

        let vehicleMarkers = [];
        let verparaderosMarker = [];
        let puntosdecontrolMaker = [];

        mapa.autorun(() => {

            let empresaId = mapa.empresaId.get();

            mapa.subscribe('Empresas');
            mapa.subscribe('vehiculosGPS', empresaId);
            mapa.subscribe('VehiculosPorEmpresaId', empresaId);

            let vehicle;
            let listadevehiculos;


            var contentString = 'Info';

            var infowindow = new google.maps.InfoWindow({
                //content: contentString,
                maxWidth: 200
            });
            // Limpiando el mapa
            for (let i = 0; i < vehicleMarkers.length; i++) {
                vehicleMarkers[i].setMap(null);
            }
            vehicleMarkers = [];

            // listadevehiculos
            let query = {};
            let rutaId = mapa.ruta.get();
            let vehiculoId = mapa.vehiculo.get();

            if (rutaId) {
                query["rutaId"] = rutaId;
            }

            if (vehiculoId) {
                query["_id"] = vehiculoId;
            }

            listadevehiculos = Vehiculos.find(query);

            listadevehiculos.forEach(function (v) {
                vehicleMarker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(v.posicion.lat, v.posicion.lng),
                    icon: '/bus2.png', //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                    map: map.instance,
                    info: 'Placa ' + v.placa + '<br> Padron ' + v.padron,
                    id: v._id,
                    title: 'Datos'
                });

                vehicleMarkers.push(vehicleMarker);

                google.maps.event.addListener(vehicleMarker, 'click', function () {
                    infowindow.setContent(this.info);
                    infowindow.open(map.instance, this);
                });

            });

            /*vehicle.addListener('click', function() {
             infowindow.open(map.instance, vehicle);
             });*/


            // mapa.subscribe('RutasPorEmpresa', () => {

            let subRutasPorEmp = mapa.subscribe('RutasPorEmpresa', empresaId);

            let numero = 0;

            if (subRutasPorEmp.ready() && mapa.ruta.get()) {

                mapa.defaultRuta = mapa.ruta.get();

                mapa.idaPath;
                mapa.vueltaPath;

                function centerOnPath(obj1, obj2) {
                    let bounds = new google.maps.LatLngBounds();
                    let points = _.union(obj1.getPath().getArray(), obj2.getPath().getArray());

                    for (let n = 0; n < points.length; n++) {
                        bounds.extend(points[n]);
                    }
                    map.instance.fitBounds(bounds);
                }

                function addLine() {
                    mapa.idaPath.setMap(map.instance);
                    mapa.vueltaPath.setMap(map.instance);
                    centerOnPath(mapa.idaPath, mapa.vueltaPath);
                }

                function removeLine() {
                    mapa.idaPath.setMap(null);
                    mapa.vueltaPath.setMap(null);
                }


                function setMapOnAll(map, p, feature) {

                    if (mapa.verparaderos.get()) {

                        marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(p.lat, p.lng),
                            icon: '/paradero.png', //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                            map: map,
                            id: ruta._id
                        });
                        verparaderosMarker.push(marker);

                    } //verparaderos


                    if (mapa.verpuntosdecontrol.get()) {

                        marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(p.lat, p.lng),
                            icon: {
                                url: '/check-point.png', // url
                                scaledSize: new google.maps.Size(30, 30), // scaled size
                                origin: new google.maps.Point(0, 0), // origin
                                anchor: new google.maps.Point(15, 15) // anchor
                            },
                            map: map,
                            id: ruta._id
                        });

                        puntosdecontrolMaker.push(marker);

                    } //verpuntosdecontrol

                }

                // Removes the markers from the map, but keeps them in the array.
                function clearMarkers() {
                    verparaderosMarker.forEach((marker) => marker.setMap(null));
                    puntosdecontrolMaker.forEach((marker) => marker.setMap(null));
                }

                // Shows any markers currently in the array.
                function showMarkers() {
                    setMapOnAll(map);
                }

                // Deletes all markers in the array by removing references to them.
                function deleteMarkers() {
                    clearMarkers();
                    verparaderosMarker = [];
                    puntosdecontrolMaker = [];
                }


                // $('select#ruta').on('change', function () {

                // let rutaId = mapa.ruta.get();

                if (rutaId) {
                    deleteMarkers();

                    Rutas.find({_id: rutaId}).forEach(function (ruta) {
                        ida = ruta.ida;
                        vuelta = ruta.vuelta;

                        if (_.has(ruta, "paraderos")) {

                            ruta.paraderos.forEach(function (p) {

                                setMapOnAll(map.instance, p, 'parking')


                            });
                        }

                        if (_.has(ruta, "puntosdecontrol")) {

                            ruta.puntosdecontrol.forEach(function (p) {

                                setMapOnAll(map.instance, p, 'puntodecontrol')


                            });
                        }
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
                }
                // });


                // });

            }

            if ( mapa.vergeocerca.get() ){
              Modules.client.activarGeocerca( mapa, map.instance, ida, vuelta );
            } else {
              if ( typeof mapa.goingPath !== 'undefined' ){
                mapa.goingPath.setMap( null );
              }
              if ( typeof mapa.returnPath !== 'undefined' ){
                mapa.returnPath.setMap( null );
              }
            }

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
        });


        map.instance.setZoom(13);


    });


});

Template.adminMapaCliente.events({
    'change #empresa'(e, t) {
        let instance = Template.instance();

        let target = e.currentTarget;
        let empresaId = target.options[target.selectedIndex].value;

        instance.empresaId.set(empresaId === "0" ? false : empresaId);
        instance.vergeocerca.set( false );

    },

    'click #vergeocerca'(e,t){
      let instance = Template.instance();

      instance.vergeocerca.set(
        ! instance.vergeocerca.get()
      );
    },

    'change #ruta'(e, t) {
        let instance = Template.instance();

        let target = e.currentTarget;
        let rutaId = target.options[target.selectedIndex].value;

        instance.ruta.set(rutaId === "0" ? false : rutaId);
        instance.vergeocerca.set( false );

    },

    'change #vehiculo'(e, t) {
        let target = e.currentTarget;
        let vehiculoId = target.options[target.selectedIndex].value;

        Template.instance().vehiculo.set(vehiculoId === "0" ? false : vehiculoId);
    },
    'click #verparaderos'(e, t){
        let value = Template.instance().verparaderos.get();
        Template.instance().verparaderos.set(!value);
    },
    'click #verpuntosdecontrol'(e, t){
        let value = Template.instance().verpuntosdecontrol.get();
        Template.instance().verpuntosdecontrol.set(!value);
    },
    'click #modotrafico'(e, t) {
        let value = Template.instance().modotrafico.get();
        Template.instance().modotrafico.set(!value);
    },
    'click #schematicMap' (e, t) {
      /*  let state = Template.instance().schematic.get();

        if(!state) {
            $('#schematic').stop().fadeIn(200);
            var rutaId = Template.instance().ruta.get();
            let radius = function (x) {
                return x * Math.PI / 180;
            };
            let getDistance = function(p1, p2) {
                let R = 6378137; // Earth’s mean radius in meter
                let dLat = radius(p2.lat - p1.lat);
                let dLong = radius(p2.lng - p1.lng);
                let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(radius(p1.lat)) * Math.cos(radius(p2.lat)) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c;
            };

            if (rutaId) {
                let route = Rutas.findOne({_id: rutaId});
                let totalGoing = 0;
                let totalReturn = 0;

                route.ida.forEach((coordinate, iterator, array)=> {
                    if (iterator > 0) {
                        let distance = getDistance(coordinate, route.ida[iterator-1]);
                        totalGoing = totalGoing + distance;
                    }
                });

                route.vuelta.forEach((coordinate, iterator, array)=> {
                    if (iterator > 0) {
                        let distance = getDistance(coordinate, route.ida[iterator-1]);
                        totalReturn = totalReturn + distance;
                    }
                });
            }
        } else {
            $('#schematic').stop().fadeOut(200);
        }
        Template.instance().schematic.set(!state);*/
        
        Modal.show('mapa_esquematico');
    }
});

Template.adminMapaCliente.helpers({
    mapOptions: function () {
        var latLng = {lat: -12.0917633, lng: -77.0279025}


        var styles = [
            {
                stylers: [
                    {hue: "#1784C7"},
                    {saturation: -20}
                ]
            }, {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    {lightness: 100},
                    {visibility: "simplified"}
                ]
            }, {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    {visibility: "off"}
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
        let empresa = Empresas.findOne({_id: Template.instance().empresaId.get()});
        return empresa;
    },
    ruta(id) {
        let ruta = Rutas.findOne({_id: id}) || {nombre: ""};
        return ruta.nombre;
    },
    verParaderos(){
      return Template.instance().verparaderos.get();
    },
    verPuntosDeControl(){
      return Template.instance().verpuntosdecontrol.get();
    },
    modoTrafico(){
      return Template.instance().modotrafico.get();
    }
});
