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
    let template = Template.instance();

    template.autorun( () => {
        template.subscribe('Rutas');
    });
});

Template.AdministradorAgregarPlaneamiento.helpers({
    rutas() {

        return Rutas.find({});
    }
});

Template.AdministradorAgregarPlaneamiento.onRendered( () => {

    $("#horarios tr td").find("#hora").each( function () {

        $(this).datetimepicker({
            format: 'LT'
        });
    });

});

Template.AdministradorAgregarPlaneamiento.events({
    'click .plus'(e, t) {
        $('#horarios').append("<tr id='h'><td><div class='input-group date' id='hora'><input type='text' class='form-control l' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td><div class='input-group date' id='hora'><input type='text' class='form-control m' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td><div class='input-group date' id='hora'><input type='text' class='form-control mi' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td><div class='input-group date' id='hora'><input type='text' class='form-control j' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td><div class='input-group date' id='hora'><input type='text' class='form-control v' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td><div class='input-group date' id='hora'><input type='text' class='form-control s' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td><div class='input-group date' id='hora'><input type='text' class='form-control d' /><span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span></div></td><td style='text-align: center;''></td></tr>");

        $("#horarios tr td").find("#hora").each( function () {

            $(this).datetimepicker({
                format: 'LT'
            });
        });
    },
    'click .guardar'(e, t) {

            let datos = {
                rutaId: $('#rutasPorEmpresa').val()
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

            $('td #hora input.l').each( function () {

                datos.horas.lunes.push({
                    lunes: $(this).val()
                });
            });


            $('td #hora input.m').each( function () {
                datos.horas.martes.push({
                    martes: $(this).val()
                });
            });


            $('td #hora input.mi').each( function () {

                datos.horas.miercoles.push({
                    miercoles: $(this).val()
                });
            });

            $('td #hora input.j').each( function () {

                datos.horas.jueves.push({
                    jueves: $(this).val()
                });
            });


            $('td #hora input.v').each( function () {

                datos.horas.viernes.push({
                    viernes: $(this).val()
                });
            });



            $('td #hora input.s').each( function () {

                datos.horas.sabado.push({
                    sabado: $(this).val()
                });
            });


            $('td #hora input.d').each( function () {

                datos.horas.domingo.push({
                    domingo: $(this).val()
                });
            });

        let empresaId = $('#planempresa').val();


        if (empresaId) {

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

                    console.log(files);

                    let i,f;

                    for (i = 0, f = files[i]; i != files.length; ++i) {

                        let reader = new FileReader();
                        let name = f.name;

                        reader.onload = (e) => {

                            let data = e.target.result;

                            Modal.show('CargandoExcel');
                            console.log('funca!!');
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
                Bert.alert( 'Complete los datos.', 'danger', 'growl-top-right' );
            }
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
        return Planeamiento.findOne({rutaId: Session.get('r1')});
        //return Planeamiento.findOne();
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    },
    empresa() {
        return Empresas.findOne().nombre;
    },
    empresas() {
        return Empresas.find({_id: FlowRouter.getParam('empresaId') }).fetch()[0].rutas;
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
    console.log(Session.get('ruta'));

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
        paraderos: []
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
                    strokeWeight: 2
                  });

                  idaPath.setMap( map.instance );

                  vueltaPath = new google.maps.Polyline({
                    path: template.ruta.vuelta,
                    geodesic: true,
                    strokeColor: '#000CFF',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                  });

                  vueltaPath.setMap( map.instance );
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
                        console.log("ida-removed", i , removed );
                        break;
                      }
                    }
                    for ( let j=0; j<template.ruta.vuelta.length; j++){
                      if ( _.isEqual( template.ruta.vuelta[j], latLng ) ){
                        let removed = template.ruta.vuelta.splice( j, 1 );
                        console.log("vuelta-removed", j , removed );
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


                function placeMarker(location) {
                    let marker = new google.maps.Marker({
                        position: location,
                        map: map.instance
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

                // google.maps.event.addListener(drawingManager, 'polylinecomplete', function (polyline) {
                //     var position = polyline.getPath();
                //     position.getArray().forEach( (p) => {
                //
                //         if (Session.get('ruta') === 'ida') {
                //             template.ruta.ida.push({
                //                 lat: p.lat(),
                //                 lng: p.lng()
                //             });
                //         } else if (Session.get('ruta') === 'vuelta') {
                //             template.ruta.vuelta.push({
                //                 lat: p.lat(),
                //                 lng: p.lng()
                //             });
                //         } else if (Session.get('ruta') === 'misma') {
                //
                //             template.ruta.ida.push({
                //                 lat: p.lat(),
                //                 lng: p.lng()
                //             });
                //
                //             template.ruta.vuelta.push({
                //                 lat: p.lat(),
                //                 lng: p.lng()
                //             });
                //         }
                //     });
                //
                // });

                google.maps.event.addListener(drawingManager, 'markercomplete', function (marker) {
                    var positionLat = marker.getPosition().lat();
                    var positionLng = marker.getPosition().lng();
                    template.ruta.paraderos.push({
                        lat: positionLat,
                        lng: positionLng
                    });
                });



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

        t.ruta.empresasId = $(".js-example-basic-multiple").val();;
        t.ruta.nombre =  t.find("[name='nombre']").value;

        //console.log(t.ruta);


        if (t.ruta.nombre !== "") {

            Meteor.call('AgregarRuta', t.ruta, (err) => {

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
        console.log(Empresas.find({_id: FlowRouter.getParam('empresaId')}).fetch()[0].rutas);
        return Empresas.find({_id: FlowRouter.getParam('empresaId')}).fetch()[0].rutas;
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    }
  });
