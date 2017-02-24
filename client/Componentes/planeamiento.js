Template.PlaneamientoInterno.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe( 'Empresas');
        template.subscribe( 'Rutas');
        template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
    });
});

Template.PlaneamientoInterno.onRendered( () => {
	$('select#ruta').on('change', function () {

		Session.set('r', this.value);
	});
});

Template.PlaneamientoInterno.helpers({
    empresas() {


        return Empresas.find({_id: Meteor.user().profile.empresaId }).fetch()[0].rutas;
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    },
    planeamiento() {
    	return Planeamiento.findOne({rutaId: Session.get('r')});
    }
});


Template.AgregarPlaneamiento.onCreated( () => {
    let template = Template.instance();

    template.autorun( () => {
        console.log('holaaaas');
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe( 'Empresas');
        template.subscribe('Rutas');
    });
});

Template.AgregarPlaneamiento.helpers({
	empresas() {
        console.log(Empresas.find({_id: Meteor.user().profile.empresaId }).fetch()[0].rutas);

        return Empresas.find({_id: Meteor.user().profile.empresaId }).fetch()[0].rutas;
    },
    rutas() {
        return Rutas.find({});
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    }
});

Template.AgregarPlaneamiento.onRendered( () => {

    $("#horarios tr td").find("#hora").each( function () {

        $(this).datetimepicker({
            format: 'LT'
        });
    });

});

Template.AgregarPlaneamiento.events({
  'keydown .input-group.date .form-control'(e,t){
    // if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
    //   return true;
    // } else {
      e.preventDefault;
      return false;
    // }
  },
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
                rutaId: $('#ruta').val()
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

        let empresaId = Meteor.user().profile.empresaId;


        console.log( datos );
        if (datos.rutaId !== '1') {

            let archivo = document.getElementById('excelplan');

            if ('files' in archivo) {

                if (archivo.files.length === 0) {
                    Meteor.call('agregarPlaneamientoEmpresa', datos, empresaId, (err) => {
                        if (err) {
                            Bert.alert( 'Hubo un error, vuelva a intentarlo.', 'danger', 'growl-top-right' );
                        } else {
                            FlowRouter.go('/planeamiento');
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
                                    	FlowRouter.go('/planeamiento');
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
        	 Bert.alert( 'Complete los datos.', 'warning', 'growl-top-right' );
        }
    }
});
