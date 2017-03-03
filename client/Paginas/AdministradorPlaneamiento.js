import { Random } from 'meteor/random';

Template.AdministradorRutas.onCreated( () => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching   = new ReactiveVar( false );

    template.autorun( () => {

        template.subscribe( 'BuscaadorDeEmpresas', template.searchQuery.get(), () => {
            setTimeout( () => {
                template.searching.set( false );
            }, 300 );
        });
    });
});

Template.AdministradorRutas.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },

    empresas() {
        let query      = {},
        projection = { limit: 40, sort: { nombre: 1 } };

        let search = Template.instance().searchQuery.get();
        if ( search ) {
            let regex = new RegExp( search, 'i' );
            console.log(regex);
            query = {
              $or: [
                { nombre: regex },
                { ruc: regex }
              ]
            };

            projection.limit = 200;
        }

        return Empresas.find(query, projection );
        //return Empresas.find();
    }
});

Template.AdministradorRutas.events({
    'keyup [name="search"]' ( event, template ) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
            template.searchQuery.set( value );
            template.searching.set( true );
        //}

        if ( value === '' ) {
          template.searchQuery.set( value );
        }
    }
});


Template.AdministradorRutas.onCreated(function() {
    var self = this;


    GoogleMaps.ready('map', function(map) {

        self.autorun(function() {


            /*var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [
                    google.maps.drawing.OverlayType.MARKER,
                    google.maps.drawing.OverlayType.CIRCLE,
                    google.maps.drawing.OverlayType.POLYGON,
                    google.maps.drawing.OverlayType.POLYLINE,
                    google.maps.drawing.OverlayType.RECTANGLE
                  ]
                },
                markerOptions: {icon: 'images/beachflag.png'},
                circleOptions: {
                  fillColor: '#ffff00',
                  fillOpacity: 1,
                  strokeWeight: 5,
                  clickable: false,
                  editable: true,
                  zIndex: 1
                }
            }).setMap(map.instance);

            map.instance.setZoom(15);*/
                // console.log('gola');


            });

    });
});

Template.AdministradorAgregarPlaneamiento.onCreated( () => {
    let self = Template.instance();

    self.planeamiento = new ReactiveVar([
      { _id: Random.id(), dia: "", hinicio: "", hfinal: "", frecuencia: 20, horas: [] }
    ]);

    self.empresaId = new ReactiveVar( false );
    self.rutaId = new ReactiveVar( false );

    self.subscribe( 'Empresas' );

    self.autorun( () => {
      self.subscribe( 'RutasPorEmpresa', self.empresaId.get() );
    });

});

Template.AdministradorAgregarPlaneamiento.helpers({
    planeamiento(){
      return Template.instance().planeamiento.get();
    },
	  empresas() {
        return Empresas.find({});
    },
    rutas() {
        let rutaId = Template.instance().rutaId.get();
        if ( rutaId ){
          return Rutas.find( { _id: rutaId });
        }
        return Rutas.find({});
    },
    ruta(id) {
        let ruta = Rutas.findOne({_id: id}) || { nombre: "" };
        return ruta.nombre;
    },
    frecuencias(){
      return Template.instance().frecuencias.get();
    }

});

Template.AdministradorAgregarPlaneamiento.onRendered( () => {


});

Template.AdministradorAgregarPlaneamiento.events({
    'change #planempresa'(e,t){
      let target = e.currentTarget;
      let empresaId = target.options[ target.selectedIndex ].value;

      Template.instance().empresaId.set( empresaId );
    },
    'change #rutasPorEmpresa'(e,t){
      let target = e.currentTarget;
      let rutaId = target.options[ target.selectedIndex ].value;

      Template.instance().rutaId.set( rutaId );
    }
});

function addMinutes(time/*"hh:mm"*/, minsToAdd/*"N"*/) {
  function z(n){
    return (n<10? '0':'') + n;
  }
  let bits = time.split(':');
  let mins = bits[0]*60 + (+bits[1]) + (+minsToAdd);

  return z(mins%(24*60)/60 | 0) + ':' + z(mins%60);
}

function converToMinutes(time/*"hh:mm"*/){
  return  parseInt( time.split(":")[0] ) * 60 + parseInt( time.split(":")[1] );
}

Template.AdministradorAgregarPlaneamiento.events({
    'keyup input.frecuencia'(e,t) {
      let target = $(e.currentTarget);
      let planId = target.closest(".planeamiento").attr("id");

    },
    'click button.update'(e,t){
      let target = $(e.currentTarget);
      let planeamiento = Template.instance().planeamiento.get();

      let updatedPlaneamiento = {
        _id: target.closest(".planeamiento").attr("id"),
        dia: target.closest(".planeamiento").find(".dia").val(),
        hinicio: target.closest(".planeamiento").find(".hinicio").val(),
        hfinal: target.closest(".planeamiento").find(".hfinal").val(),
        frecuencia: parseInt( target.closest(".planeamiento").find(".frecuencia").val() ),
      };

      //Generar Horas
      let horas = [];
      let minutosAlInicio = converToMinutes( updatedPlaneamiento.hinicio );
      let minutosAlFinal = converToMinutes( updatedPlaneamiento.hfinal );
      let minutos = minutosAlInicio;

      // exceptions
      if ( !updatedPlaneamiento.hinicio ){
        Bert.alert( 'Debe ingresar la hora inicial', 'danger', 'growl-top-right' );
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if ( !updatedPlaneamiento.hfinal ){
        Bert.alert( 'Debe ingresar la hora final', 'danger', 'growl-top-right' );
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if ( minutosAlInicio > minutosAlFinal ){
        Bert.alert( 'La hora inicial debe ser mayor a la hora final', 'danger', 'growl-top-right' );
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if ( !updatedPlaneamiento.frecuencia ){
        Bert.alert( 'La frecuencia debe ser mayor a cero', 'danger', 'growl-top-right' );
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      let hora = updatedPlaneamiento.hinicio;
      horas.push(updatedPlaneamiento.hinicio);

      //Generar Horas
      while ( minutos + updatedPlaneamiento.frecuencia < minutosAlFinal ) {
        hora = addMinutes( hora, updatedPlaneamiento.frecuencia );
        horas.push( hora );
        minutos += updatedPlaneamiento.frecuencia;
      }

      updatedPlaneamiento["horas"] = horas;

      //Actualizar Planeamiento
      for ( let i=0; i<planeamiento.length; i++){
        if ( planeamiento[i]._id === updatedPlaneamiento._id){
          planeamiento[i] = updatedPlaneamiento;
          break;
        }
      };

      Template.instance().planeamiento.set( planeamiento );

    },

    'click button.agregar'(e, t){
      let planeamiento = Template.instance().planeamiento.get();
      planeamiento.push({
        _id: Random.id(),
        dia: "",
        hinicio: "",
        hfinal: "",
        frecuencia: 20,
        horas: []
      });
      Template.instance().planeamiento.set( planeamiento );
    },

    'click .guardar'(e, t) {

            let datos = {
                rutaId: Template.instance().rutaId.get()
            }

            datos.horas = {
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
            };

            // transformando datos a estructura actual de planeamiento

            let planeamiento = Template.instance().planeamiento.get();

            planeamiento.forEach( (plan) => {
              datos.horas[ plan.dia ] = _.union( datos.horas[ plan.dia ],  plan["horas"] );
            });


        let empresaId = Template.instance().empresaId.get();
        let rutaId = Template.instance().rutaId.get();

        if ( !empresaId ){
          Bert.alert( 'Seleccione una empresa', 'warning', 'growl-top-right' );
          return ;
        }

        if ( !rutaId ){
          Bert.alert( 'Seleccione una ruta', 'warning', 'growl-top-right' );
          return ;
        }


        if (datos.rutaId !== '1') {

            let archivo = document.getElementById('excelplan');

            if ('files' in archivo) {

                if (archivo.files.length === 0) {
                    Meteor.call('agregarPlaneamientoEmpresa', datos, empresaId, (err) => {
                        if (err) {
                            Bert.alert( 'Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right' );
                        } else {
                            FlowRouter.go('/admin/planeamiento');
                            Bert.alert( 'Planeamiento agregado.', 'success', 'growl-top-right' );
                        }
                    });
                } else {

                    let files = archivo.files;

                    let i,f;

                    for (i = 0, f = files[i]; i != files.length; ++i) {

                        let reader = new FileReader();
                        let name = f.name;

                        reader.onload = (e) => {

                            let data = e.target.result;

                            Modal.show('CargandoExcel');
                            Meteor.call('leerPlaneamientoExcel', empresaId, datos.rutaId, data, (err, result) => {
                                if (err) {
                                    Modal.hide('CargandoExcel');
                                    Bert.alert( 'Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right' );
                                } else {
                                    Modal.hide('CargandoExcel');
                                    if (result) {
                                        Bert.alert(result, 'success');
                                    } else {
                                    	FlowRouter.go('/admin/planeamiento');
                                        Bert.alert('Planeamiento agregado', 'success');
                                    }

                                }
                            });
                        };

                        reader.readAsBinaryString(f);

                    }
                }

            } else {
                Bert.alert( 'Complete los datos.', 'warning', 'growl-top-right' );
            }
        } else {
        	 Bert.alert( 'Seleccione una ruta', 'warning', 'growl-top-right' );
        }
    }
});

Template.selectEmpresas.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        template.subscribe( 'Empresas');
    });
});

Template.selectEmpresas.helpers({
    empresas() {
        return Empresas.find();
    }
});


Template.AdministradorPlaneamiento.onCreated( () => {
    let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching   = new ReactiveVar( false );

    template.autorun( () => {

        template.subscribe( 'BuscaadorDeEmpresas', template.searchQuery.get(), () => {
            setTimeout( () => {
                template.searching.set( false );
            }, 300 );
        });
    });
});

Template.AdministradorPlaneamiento.helpers({
    searching() {
        return Template.instance().searching.get();
    },
    query() {
        return Template.instance().searchQuery.get();
    },
    empresas() {
        //return Empresas.find();

        let query      = {},
        projection = { limit: 40, sort: { nombre: 1 } };

        let search = Template.instance().searchQuery.get();
        if ( search ) {
            let regex = new RegExp( search, 'i' );
            console.log(regex);
            query = {
              $or: [
                { nombre: regex },
                { ruc: regex }
              ]
            };

            projection.limit = 200;
        }

        return Empresas.find(query, projection );
    }
});

Template.AdministradorPlaneamiento.events({
    'keyup [name="search"]' ( event, template ) {

        let value = event.target.value.trim();

        //if ( value !== '' && event.keyCode === 13 ) {
            template.searchQuery.set( value );
            template.searching.set( true );
       // }

        if ( value === '' ) {
          template.searchQuery.set( value );
        }
    }
});

Template.AdministradorPlaneamientoPorEmpresa.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = FlowRouter.getParam('empresaId');

        template.subscribe( 'DetalleDeEmpresaPlaneamiento', empresaId);
        template.subscribe( 'DetalleDeEmpresa', empresaId);
        template.subscribe( 'Rutas');
    });
});

Template.AdministradorPlaneamientoPorEmpresa.onRendered( () => {
    $('select#ruta').on('change', function () {

        Session.set('r1', this.value);
    });
});


Template.AdministradorPlaneamientoPorEmpresa.helpers({
    planeamiento() {
        let rutaId = FlowRouter.getParam('rutaId');
        let empresaId = FlowRouter.getParam('empresaId');

        let planeamiento = Planeamiento.findOne({ rutaId: rutaId});

        console.log( rutaId, planeamiento );
        return planeamiento;

    },
    ruta() {
        return Rutas.findOne({_id: FlowRouter.getParam('rutaId')});
    },
    empresa() {
        return Empresas.findOne();
    },
    empresas() {
        return Empresas.find({_id: FlowRouter.getParam('empresaId') });
    }
});

function hasEmptyArrays(obj) {
  var emptyArrayMembers = _.filter(obj, function(member) {
    return _.isArray(member) && _.isEmpty(member)
  });

  return emptyArrayMembers.length > 0;
}

function getPathVariableCode(line) {

    var codeStr = '  var linePath = [\n';

    var pathArr = line.getPath();

    for (var i = 0; i < pathArr.length; i++) {
        codeStr += '    {lat: ' + pathArr.getAt(i).lat() + ', lng: ' + pathArr.getAt(i).lng() + '}' ;
        if (i !== pathArr.length-1) {
            codeStr += ',\n';
        };

    };

    codeStr += '\n  ];';

    //the coordinates path it´s print on the console of the browser

    console.log (codeStr);
    console.log(pathArr.length);

}

Template.AdministradorAgregarRuta.onCreated( function () {
    Session.setDefault('ruta', 'ida');

    var self = this;

    self.autorun( function () {
        self.subscribe('Empresas', function () {
            if (Empresas.find().fetch().length > 0) {
                $(".js-example-basic-multiple").select2({
                    placeholder: "Asigna a una o más empresas a esta ruta",
                });

            }
        });
    });
});

Template.AdministradorAgregarRuta.helpers({
    empresas() {
        return Empresas.find();
    }
});

Template.AdministradorAgregarRuta.onRendered( function () {



    var self = this;

    let template = Template.instance();

    template.ruta = {
        empresaId: '',
        nombre: '',
        ida: [],
        vuelta: [],
        paraderos: [],
        puntosdecontrol: [],
    };



    GoogleMaps.ready('map', function(map) {

        let drawingManager;

        self.autorun(function() {

                drawingManager = new google.maps.drawing.DrawingManager({
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [

                        google.maps.drawing.OverlayType.MARKER,
                        // google.maps.drawing.OverlayType.POLYLINE,
                       ]
                    },
                    markerOptions: {icon: '/paradero.png'}
                });

                let idaPath;
                let vueltaPath;

                function updatePath(){

                  if (typeof idaPath !== 'undefined'){
                    idaPath.setMap( null );
                  }

                  if (typeof vueltaPath !== 'undefined'){
                    vueltaPath.setMap( null );
                  }

                  idaPath = new google.maps.Polyline({
                    path: template.ruta.ida,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 3
                  });

                  idaPath.setMap( map.instance );
                  puntodecontrolListener( idaPath );

                  vueltaPath = new google.maps.Polyline({
                    path: template.ruta.vuelta,
                    geodesic: true,
                    strokeColor: '#000CFF',
                    strokeOpacity: 1.0,
                    strokeWeight: 3
                  });

                  vueltaPath.setMap( map.instance );
                  puntodecontrolListener( vueltaPath );

                }

                function puntodecontrolListener( path ){
                  //create punto de control
                  path.addListener( 'click', function(e){

                    let icon = {
                        url: '/check-point.png', // url
                        scaledSize: new google.maps.Size(30, 30), // scaled size
                        origin: new google.maps.Point(0,0), // origin
                        anchor: new google.maps.Point(15, 15) // anchor
                    };

                    let latLng = {
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng()
                    };

                    let marker = new google.maps.Marker({
                        position: latLng,
                        map: map.instance,
                        icon: icon,
                    });
                    template.ruta.puntosdecontrol.push( latLng );

                    google.maps.event.addListener( marker, 'dblclick', function (e) {
                        let latLng = {
                          lat: marker.position.lat(),
                          lng: marker.position.lng()
                        };
                        for( let i=0; i<template.ruta.puntosdecontrol.length; i++){

                          if ( _.isEqual( template.ruta.puntosdecontrol[i], latLng
                            ) ){
                              template.ruta.puntosdecontrol.splice( i, 1 );
                              break;
                          }

                        }
                        // map.instance.removeOverlay( marker );
                        marker.setMap( null );
                    });

                  });

                }

                function updateRuta(location, type ){

                  if ( type === 'add' ){

                    let latLng = {
                        lat: location.lat(),
                        lng: location.lng()
                    };

                    if ( Session.get('ruta') === "ida" || Session.get('ruta') === 'misma' ){
                      template.ruta.ida.push( latLng );
                    }

                    if ( Session.get('ruta') === "vuelta" || Session.get('ruta') === 'misma' ){
                      template.ruta.vuelta.push( latLng );
                    }

                  }


                  if ( type === 'remove'){

                    let latLng = {
                        lat: location.lat,
                        lng: location.lng
                    };

                    for ( let i=0; i<template.ruta.ida.length; i++){
                      if ( _.isEqual( template.ruta.ida[i], latLng ) ){
                        let removed = template.ruta.ida.splice( i, 1 );
                        break;
                      }
                    }
                    for ( let j=0; j<template.ruta.vuelta.length; j++){
                      if ( _.isEqual( template.ruta.vuelta[j], latLng ) ){
                        let removed = template.ruta.vuelta.splice( j, 1 );
                        break;
                      }
                    }

                  }

                  updatePath();
                }


                function removeMarker( marker, location ){
                  marker.setMap(null);
                  updateRuta( location, 'remove' );
                }

                let icon = {
                    url: '/pin.png', // url
                    scaledSize: new google.maps.Size(40, 40), // scaled size
                };

                function placeMarker(location) {
                    let marker = new google.maps.Marker({
                        position: location,
                        map: map.instance,
                        icon: icon,
                    });

                    updateRuta( location, 'add' );

                    marker.addListener("dblclick", function( event ) {

                      let location = {
                          lat: event.latLng.lat(),
                          lng: event.latLng.lng()
                      };

                      removeMarker( marker, location );

                    });
                }


                map.instance.addListener( 'click', function(event) {
                   placeMarker(event.latLng);
                });

                google.maps.event.addListener(drawingManager, 'markercomplete', function (marker) {
                    var positionLat = marker.getPosition().lat();
                    var positionLng = marker.getPosition().lng();
                    template.ruta.paraderos.push({
                        lat: positionLat,
                        lng: positionLng
                    });
                    deleteMakerOnDobleClick( marker );
                });

                //delete paradero marker on double click
                function deleteMakerOnDobleClick( marker ){

                  google.maps.event.addListener( marker, 'dblclick', function () {
                      let latLng = {
                        lat: marker.position.lat(),
                        lng: marker.position.lng()
                      };
                      for( let i=0; i<template.ruta.paraderos.length; i++){

                        if ( _.isEqual( template.ruta.paraderos[i], latLng
                          ) ){
                            template.ruta.paraderos.splice( i, 1);
                            break;
                        }

                      }
                      // map.instance.removeOverlay( marker );
                      marker.setMap( null );
                  });

                }


                drawingManager.setMap(map.instance);

        });




    });


    $('.btn-group').on('input', 'change', function(){
        var checkbox = $(this);
        var label = checkbox.parent('label');
        var labelActive = checkbox.parent('label.active');
        if (checkbox.is(':checked'))  {
            labelActive.removeClass('active');
            label.addClass('active');
        }
        else {
          labelActive.removeClass('active');
        }
    });

});

Template.AdministradorAgregarRuta.events({
    'click .save'(e, t) {

        t.ruta.empresasId = $(".js-example-basic-multiple2").val();;
        t.ruta.nombre =  t.find("[name='nombre']").value;


        if (t.ruta.nombre !== "") {
          if (typeof t.ruta.ida !== 'undefined' && t.ruta.ida.length > 0) {
            if (typeof t.ruta.vuelta !== 'undefined' && t.ruta.vuelta.length > 0) {
              Meteor.call('AgregarRuta', t.ruta, (err) => {

                  if (err) {
                      Bert.alert( 'Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right' );
                  } else {
                      FlowRouter.go('/admin/rutas');
                      Bert.alert( 'Ruta agregada.', 'success', 'growl-top-right' );
                  }
              });
            } else {
              Bert.alert('Agrega la ruta de vuelta correctamente', 'warning')
            }
          } else {
            Bert.alert('Agrega la ruta de ida correctamente', 'warning')
          }



        } else {
            Bert.alert( 'Complete los datos, vuelva a intentarlo.', 'warning', 'growl-top-right' );
        }

    },
    'change .r'(e, t) {

        let id = $('input[name="optradio"]:checked').attr('id');
        console.log(id);

        if (id === "ida") {
            Session.set('ruta', 'ida');
        } else if (id === "vuelta") {
            Session.set('ruta', 'vuelta');
        } else if ( id === "misma") {
            Session.set('ruta', 'misma');
        }
    }
});

Template.AdministradorReportes.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        template.subscribe('Vehiculos');
        template.subscribe('Conductores');
        template.subscribe('Cobradores');
    });



});

Template.AdministradorReportes.onRendered( () => {

    Session.setDefault('empresa', null);
});

Template.AdministradorReportes.helpers({
    conductores() {
        if (Session.get('empresa') === null) {
            return Conductores.find();
        } else {
            return Conductores.find({empresaId: Session.get('empresa')});
        }

    },
    placa() {
        return Vehiculos.findOne({_id: this.vehiculoId}).placa;
    },
    cobradores() {

        if (Session.get('empresa') === null) {
            return Cobradores.find();
        } else {
            return Cobradores.find({empresaId: Session.get('empresa')});
        }
    },
    ruta() {
        return Vehiculos.findOne({_id: this.vehiculoId}).codigoDeRuta;
    },
    vehiculos() {

        if (Session.get('empresa') === null) {
            return Vehiculos.find();
        } else {
            return Vehiculos.find({empresaId: Session.get('empresa')});
        }

    }
});


Template.AdministradorReportes.events({
    'change #planempresa'(e, t) {

        console.log($(e.target).val());

        if (e.target.val === 1) {
            Session.set('empresa', null);
        } else {
            Session.set('empresa', $(e.target).val());
        }
    },
    'click #test'() {

            var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";

            tab_text = tab_text + $('#reporte01').html();

            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, 'Reporte.xls');
                }
            } else {

                $('#test').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
                $('#test').attr('download', 'Reporte.xls');
            }
    },
    'click #reporte1PDF'() {


            $("td:hidden,th:hidden","#reporte01").show();
            var pdf = new jsPDF('l', 'pt', 'a4');
            pdf.cellInitialize();
            pdf.setFontSize(8);
            $.each( $('#reporte01 tr'), function (i, row){
                $.each( $(row).find("td, th"), function(j, cell){
                     var txt = $(cell).text().trim().split(" ").join("\n") || " ";
                     var width = (j==0) ? 70 : 75; //make with column smaller
                     //var height = (i==0) ? 40 : 30;
                     pdf.cell(10, 50, width, 100, txt, i);
                });
            });

            pdf.save('Reporte.pdf');

    },
    'click #test2'() {
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";

            tab_text = tab_text + $('#reporte02').html();

            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, 'Reporte.xls');
                }
            } else {

                $('#test2').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
                $('#test2').attr('download', 'Reporte.xls');
            }
    },
    'click #reporte2PDF'() {
        $("td:hidden,th:hidden","#reporte02").show();
            var pdf = new jsPDF('l', 'pt', 'a4');
            pdf.cellInitialize();
            pdf.setFontSize(8);
            $.each( $('#reporte02 tr'), function (i, row){
                $.each( $(row).find("td, th"), function(j, cell){
                     var txt = $(cell).text().trim().split(" ").join("\n") || " ";
                     var width = (j==0) ? 70 : 150; //make with column smaller
                     //var height = (i==0) ? 40 : 30;
                     pdf.cell(10, 50, width, 50, txt, i);
                });
            });

            pdf.save('Reporte.pdf');
    },
    'click #test3'() {
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";

            tab_text = tab_text + $('#reporte03').html();

            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, 'Reporte.xls');
                }
            } else {

                $('#test3').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
                $('#test3').attr('download', 'Reporte.xls');
            }
    },
    'click #reporte3PDF'() {
        $("td:hidden,th:hidden","#reporte03").show();
            var pdf = new jsPDF('l', 'pt', 'a4');
            pdf.cellInitialize();
            pdf.setFontSize(8);
            $.each( $('#reporte03 tr'), function (i, row){
                $.each( $(row).find("td, th"), function(j, cell){
                     var txt = $(cell).text().trim().split(" ").join("\n") || " ";
                     var width = (j==0) ? 70 : 140; //make with column smaller
                     //var height = (i==0) ? 40 : 30;
                     pdf.cell(10, 50, width, 100, txt, i);
                });
            });

            pdf.save('Reporte.pdf');
    },
    'click #test4'() {
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";

            tab_text = tab_text + $('#reporte04').html();

            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, 'Reporte.xls');
                }
            } else {

                $('#test4').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
                $('#test4').attr('download', 'Reporte.xls');
            }
    },
    'click #reporte4PDF'() {
        $("td:hidden,th:hidden","#reporte04").show();
            var pdf = new jsPDF('l', 'pt', 'a4');
            pdf.cellInitialize();
            pdf.setFontSize(8);
            $.each( $('#reporte04 tr'), function (i, row){
                $.each( $(row).find("td, th"), function(j, cell){
                     var txt = $(cell).text().trim().split(" ").join("\n") || " ";
                     var width = (j==0) ? 70 : 175; //make with column smaller
                     //var height = (i==0) ? 40 : 30;
                     pdf.cell(10, 50, width, 27, txt, i);
                });
            });

            pdf.save('Reporte.pdf');
    },
    'click #test5'() {
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";

            tab_text = tab_text + $('#reporte05').html();

            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, 'Reporte.xls');
                }
            } else {

                $('#test5').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
                $('#test5').attr('download', 'Reporte.xls');
            }
    },
    'click #reporte5PDF'() {
        $("td:hidden,th:hidden","#reporte05").show();
            var pdf = new jsPDF('l', 'pt', 'a4');
            pdf.cellInitialize();
            pdf.setFontSize(8);
            $.each( $('#reporte05 tr'), function (i, row){
                $.each( $(row).find("td, th"), function(j, cell){
                     var txt = $(cell).text().trim().split(" ").join("\n") || " ";
                     var width = (j==0) ? 70 : 75; //make with column smaller
                     //var height = (i==0) ? 40 : 30;
                     pdf.cell(10, 50, width, 45, txt, i);
                });
            });

            pdf.save('Reporte.pdf');
    },
    'click #test6'() {
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta charset="UTF-8"><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";

            tab_text = tab_text + $('#reporte06').html();

            tab_text = tab_text + '</table></body></html>';

            var data_type = 'data:application/vnd.ms-excel';

            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, 'Reporte.xls');
                }
            } else {

                $('#test6').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
                $('#test6').attr('download', 'Reporte.xls');
            }

    },
    'click #reporte6PDF'() {
        $("td:hidden,th:hidden","#reporte06").show();
            var pdf = new jsPDF('l', 'pt', 'a4');
            pdf.cellInitialize();
            pdf.setFontSize(8);
            $.each( $('#reporte06 tr'), function (i, row){
                $.each( $(row).find("td, th"), function(j, cell){
                     var txt = $(cell).text().trim().split(" ").join("\n") || " ";
                     var width = (j==0) ? 70 : 75; //make with column smaller
                     //var height = (i==0) ? 40 : 30;
                     pdf.cell(10, 50, width, 100, txt, i);
                });
            });

            pdf.save('Reporte.pdf');
    }
});

Template.AdministradorAgregarRuta.helpers({
    mapOptions: function() {

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
        if (GoogleMaps.loaded()) {

            return {

                center: new google.maps.LatLng(-12.0917633, -77.0279025),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: styles,
                clickableIcons: false
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

Template.AdministradorAgregarRuta.events({
    'click .plus'(e, t) {
        $('#horarios').append("<tr id='h1'><td><div class='input-group date' id='la'><input type='number' class='form-control la' /></div></td><td><div class='input-group date' id='lo'><input type='number' class='form-control lo' /></div></td></tr>");

    },
    'click .plus2'(e, t) {
        $('#horarios2').append("<tr id='h2'><td><div class='input-group date' id='la'><input type='number' class='form-control la' /></div></td><td><div class='input-group date' id='lo'><input type='number' class='form-control lo' /></div></td></tr>");

    },
    'click .guardar'(e, t) {
        let data = {
            empresaId: $('#planempresa').val(),
            nombre: t.find("[name='nombre']").value,
            ida: [],
            vuelta: []
        }

        $('tr#h1').each( function () {

                data.ida.push({
                    lat: parseFloat($(this).find('td #la input.la').val()),
                    lng: parseFloat($(this).find('td #lo input.lo').val())
                });
        });

        $('tr#h2').each( function () {
                console.log('hola')
                data.vuelta.push({
                    lat: parseFloat($(this).find('td #la input.la').val()),
                    lng: parseFloat($(this).find('td #lo input.lo').val())
                });
        });

        if (data.nombre !== "") {

            console.log(data.ida);
            console.log(data.vuelta);
            Meteor.call('AgregarRuta', data, (err) => {

                if (err) {
                    Bert.alert( 'Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right' );
                } else {
                    FlowRouter.go('/admin/rutas');
                    Bert.alert( 'Ruta agregada.', 'success', 'growl-top-right' );
                }

            });

        } else {
            Bert.alert( 'Complete los datos, vuelva a intentarlo.', 'warning', 'growl-top-right' );
        }
    }
});

Template.AdministradorRutasPorEmpresa.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = FlowRouter.getParam('empresaId');

        template.subscribe( 'DetalleDeEmpresa', empresaId);
    });
});

Template.AdministradorRutasPorEmpresa.helpers({
    empresa() {
        return Empresas.find({_id: FlowRouter.getParam('empresaId')}).fetch()[0].nombre;
    }
});

Template.RutaPorEmpresa.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = FlowRouter.getParam('empresaId');

        template.subscribe( 'RutasPorEmpresa', empresaId);
    });
});

Template.RutaPorEmpresa.helpers({
    rutas() {
        return Rutas.find();
    }
});

Template.RutaPorEmpresa.events({
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


Template.AdministradorRutasPorEmpresa.onCreated(function() {

});

Template.AdministradorRutasPorEmpresa.onRendered( () => {

       var self = this;

    let mapa = Template.instance();



    GoogleMaps.ready('map', function(map) {

        var marker;

        mapa.autorun( () => {

            mapa.subscribe('Empresas');

            let empresaId = FlowRouter.getParam('empresaId');




                        mapa.subscribe('RutasPorEmpresa', () => {



                        let numero = 0;

                        mapa.defaultRuta = new ReactiveVar(Rutas.findOne()._id)

                        mapa.idaPath;
                        mapa.vueltaPath;
                        console.log(mapa.defaultRuta.get());

                        let ida;
                        let vuelta;

                        function centerOnPath(obj1, obj2){
                          let bounds = new google.maps.LatLngBounds();
                          let points = _.union( obj1.getPath().getArray(), obj2.getPath().getArray() );

                          for (let n = 0; n < points.length ; n++){
                              bounds.extend(points[n]);
                          }
                          map.instance.fitBounds(bounds);
                        }

                        function addLine() {
                            mapa.idaPath.setMap(map.instance);
                            mapa.vueltaPath.setMap(map.instance);
                            centerOnPath( mapa.idaPath, mapa.vueltaPath );
                        }

                        function removeLine () {
                            mapa.idaPath.setMap(null);
                            mapa.vueltaPath.setMap(null);
                        }

                        let markers = [];
                        function setMapOnAll(map, p, feature) {

                          let checkPointIcon = {
                            url: '/check-point.png', // url
                            scaledSize: new google.maps.Size(30, 30), // scaled size
                            origin: new google.maps.Point(0,0), // origin
                            anchor: new google.maps.Point(15, 15) // anchor
                          };

                          let paraderoIcon = '/paradero.png';


                            marker = new google.maps.Marker({
                                        animation: google.maps.Animation.DROP,
                                        position: new google.maps.LatLng(p.lat, p.lng),
                                        icon: feature === 'parking' ? paraderoIcon : checkPointIcon, //*'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png',
                                        map: map,
                                        id: ruta._id
                            });

                            markers.push(marker);
                        }

                        // Removes the markers from the map, but keeps them in the array.
                        function clearMarkers() {
                            markers.forEach( (marker) => marker.setMap(null) );
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
                          deleteMarkers();

                            Rutas.find({_id: this.value }).forEach( function (ruta) {
                                ida = ruta.ida;
                                vuelta = ruta.vuelta;



                                ruta.paraderos.forEach( function (p) {

                                    setMapOnAll(map.instance, p, 'parking')

                                });

                                ruta.puntosdecontrol.forEach( function (p) {

                                    setMapOnAll(map.instance, p, 'puntodecontrol')

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

        map.instance.setZoom(12);


    });


});


Template.AdministradorRutasPorEmpresa.helpers({
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
                zoom: 12,
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
        console.log(Empresas.find({_id: FlowRouter.getParam('empresaId')}).fetch()[0].rutas);
        return Empresas.find({_id: FlowRouter.getParam('empresaId')}).fetch()[0].rutas;
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    }
  });
