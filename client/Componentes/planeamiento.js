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
        return Empresas.findOne({_id: Meteor.user().profile.empresaId });
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
    template.frecuencias = new ReactiveVar({
      'lunes': 1,
      'martes': 1,
      'miercoles': 1,
      'jueves': 1,
      'viernes': 1,
      'sabado': 1,
      'domingo': 1
    });

    template.frecuenciaMayor = new ReactiveVar(1);


    template.autorun( () => {
        let empresaId = Meteor.user().profile.empresaId;
        template.subscribe( 'Empresas');
        template.subscribe('Rutas');

        //obtenemos la frecuencia mayor
        template.frecuenciaMayor.set( Math.max.apply( null, _.values( template.frecuencias.get() ) ) );
    });
});

Template.AgregarPlaneamiento.helpers({
	  empresas() {
        return Empresas.findOne({_id: Meteor.user().profile.empresaId });
    },
    rutas() {
        return Rutas.find({});
    },
    ruta(id) {
        return Rutas.findOne({_id: id}).nombre;
    },
    frecuencias(){
      return Template.instance().frecuencias.get();
    },
    numerodefilas(){
      return _.range( Template.instance().frecuenciaMayor.get() );
    }

});

Template.AgregarPlaneamiento.onRendered( () => {

});

Template.AgregarPlaneamiento.events({
    'click .frecuencia input[type=checkbox]'(e,t) {
      let target = $(e.currentTarget);
      let dia = target.closest('.input-group').data('dia');
      let frecuencia = parseInt( target.closest('.input-group').find('input[type=number]')[0].value );

      let frecuencias = Template.instance().frecuencias.get();
      frecuencias[dia] = frecuencia;

      if ( target.is(':checked') && frecuencia >= 0) {
        Template.instance().frecuencias.set( frecuencias );
      }

    },
    'click .plus'(e, t) {
      let newFrecuencias = Template.instance().frecuencias.get();

      Object.keys(newFrecuencias).forEach(function(key) {
          ++newFrecuencias[key];
      });

      Template.instance().frecuencias.set( newFrecuencias );
    },

    'click .delete'(e,t){

      let newFrecuencias = Template.instance().frecuencias.get();
      let frecuenciaMayor = Template.instance().frecuenciaMayor.get();

      Object.keys(newFrecuencias).forEach(function(key) {

        if ( newFrecuencias[key] > 1 && newFrecuencias[key] === frecuenciaMayor ){
          --newFrecuencias[key];
        }

      });

      Template.instance().frecuencias.set( newFrecuencias );
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

            $('td input.l').each( function () {

                datos.horas.lunes.push({
                    lunes : $(this).val()
                });
            });


            $('td input.m').each( function () {
                datos.horas.martes.push({
                    martes : $(this).val()
                });
            });


            $('td input.mi').each( function () {

                datos.horas.miercoles.push({
                    miercoles : $(this).val()
                });
            });


            $('td input.j').each( function () {

                datos.horas.jueves.push({
                    jueves : $(this).val()
                });
            });


            $('td input.v').each( function () {

                datos.horas.viernes.push({
                    viernes : $(this).val()
                });
            });


            $('td input.s').each( function () {

                datos.horas.sabado.push({
                    sabado : $(this).val()
                });
            });


            $('td input.d').each( function () {

                datos.horas.domingo.push({
                    domingo : $(this).val()
                });
            });

        let empresaId = Meteor.user().profile.empresaId;


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
