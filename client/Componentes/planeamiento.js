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

    //arreglo dinamico para guardar las horas
    template.horas = new ReactiveVar([{
      'lunes': true,
      'martes': true,
      'miercoles': true,
      'jueves': true,
      'viernes': true,
      'sabado': true,
      'domingo': true
    }]);
    template.frecuenciaMayor = new ReactiveVar(1);

    template.autorun( () => {
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
    },
    horas(){
      return Template.instance().horas.get();
    },

});

Template.AgregarPlaneamiento.onRendered( () => {

});

Template.AgregarPlaneamiento.events({
    'click .frecuencia input[type=checkbox]'(e,t){
      let target = $(e.currentTarget);
      let dia = target.closest('.input-group').data('dia');
      let frecuencia = parseInt( target.closest('.input-group').find('input[type=number]')[0].value );
      let frecuenciaMayor = Template.instance().frecuenciaMayor.get();

      let horas = Template.instance().horas.get();
      let horasNuevaFila = {'lunes': false,'martes': false,'miercoles': false,'jueves': false,'viernes': false,'sabado': false,'domingo': false };

      if ( frecuencia > frecuenciaMayor ){
        Template.instance().frecuenciaMayor.set( frecuencia );
        frecuenciaMayor = frecuencia;
      }

      if ( target.is(':checked') && frecuencia >= 0) {

        for ( let i=0; i<frecuenciaMayor; i++ ){
          if (i < frecuencia ){
            if ( typeof horas[i] === 'undefined' ){
              horas.push( horasNuevaFila );
            }

            if ( ! horas[i][dia] ){
              horas[i][dia] = true;
            }
          } else {
            horas[i][dia] = false;
          }

        }
        Template.instance().horas.set( horas );
      }
    },
    'click .plus'(e, t) {
      let horas = Template.instance().horas.get();
      let horasNuevaFila = {'lunes': true,'martes': true,'miercoles': true,'jueves': true,'viernes': true,'sabado': true,'domingo': true };

      horas.push( horasNuevaFila );
      Template.instance().horas.set( horas );
    },
    'click .delete'(e,t){
      let target = $(e.currentTarget);
      target.closest("tr").remove();
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


        // console.log( datos );
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
