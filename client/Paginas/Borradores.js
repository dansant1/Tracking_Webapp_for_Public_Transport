import { handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador } from '../Utilities/archivos'

Template.Borradores.onCreated( () => {
	let template = Template.instance();


  	Session.set('editarVehiculo', null);

  	template.autorun( () => {
    	let empresaId = Meteor.user().profile.empresaId;

      template.subscribe( 'VehiculosLista', empresaId, true);
      template.subscribe( 'ConductoresLista', empresaId, true);
      template.subscribe( 'CobradoresLista', empresaId, true);
  	});
});

Template.Borradores.helpers({

  vehiculos: function () {
  		let vehiculos = Vehiculos.find();

  		if (vehiculos) {
  			let empresaId = Meteor.user().profile.empresaId;
  			return Vehiculos.find({empresaId: empresaId});
  		}
	},
	fotos() {
		return FotosDeVehiculos.find();
	},
  conductores() {
    let vehiculos = Conductores.find();

    if (vehiculos) {
      let empresaId = Meteor.user().profile.empresaId;
      return Conductores.find({empresaId: empresaId});
    }
  },
  cobradores() {
    let vehiculos = Cobradores.find();

    if (vehiculos) {

      let empresaId = Meteor.user().profile.empresaId;
      console.log(empresaId)
      return Cobradores.find({empresaId: empresaId});
    }
  },
	checked() {

	}
});

Template.Borradores.events({
  'click .remove3' () {
    swal({
      title: "¿Estas seguro de eliminar este cobrador?",
        text: "El cobrador no estará disponible una vez eliminado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, Eliminar",
        closeOnConfirm: false
    }, () => {

      Meteor.call('EliminarCobrador', this._id, (err) => {
        if (err) {
          alert(err);
        } else {
          swal("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
        }
      });

    });
  },
  'click .edit3': function () {
    Session.set('editarCobrador', this._id);
    Modal.show('EditarCobrador');
    console.log(Session.get('editarCobrador'));
  },
  'change #fotocobrador1'(e, t) {
    console.log('holaaadsdr443');
    SubirFotoCobrador(e, t, this._id, 'fotocobrador1', 1);
  },
  'change #fotocobrador2'(e, t) {
    SubirFotoCobrador(e, t, this._id, 'fotocobrador2', 2);
  },
  'change #fotocobrador3'(e, t) {
    SubirFotoCobrador(e, t, this._id, 'fotocobrador3', 3);
  },
  'change #fotocobrador4'(e, t) {
    SubirFotoCobrador(e, t, this._id, 'fotocobrador4', 4);
  },
  'click .remove2' () {
    swal({
      title: "¿Estas seguro de eliminar este conductor?",
        text: "El conductor no estará disponible una vez eliminado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si, Eliminar",
        closeOnConfirm: false
    }, () => {

      Meteor.call('EliminarConductor', this._id, (err) => {
        if (err) {
          alert(err);
        } else {
          swal("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
        }
      });

    });
  },
  'click .edit2': function () {
    Session.set('editarConductor', this._id);
    Modal.show('EditarConductor');

  },
  'change #fotoconductor1'(e, t) {

    SubirFotoConductor(e, t, this._id, 'fotoconductor1', 1);
  },
  'change #fotoconductor2'(e, t) {
    SubirFotoConductor(e, t, this._id, 'fotoconductor2', 2);
  },
  'change #fotoconductor3'(e, t) {
    SubirFotoConductor(e, t, this._id, 'fotoconductor3', 3);
  },
  'change #fotoconductor4'(e, t) {
    SubirFotoConductor(e, t, this._id, 'fotoconductor4', 4);
  },
  	'click .remove' () {
  		swal({
				title: "¿Estas seguro de eliminar este vehículo?",
	  			text: "El vehículo no estará disponible una vez eliminado",
	  			type: "warning",
	  			showCancelButton: true,
	  			confirmButtonColor: "#DD6B55",
	  			confirmButtonText: "Si, Eliminar",
	  			closeOnConfirm: false
			}, () => {

				Meteor.call('EliminarVehiculo', this._id, (err) => {
					if (err) {
						alert(err);
					} else {
						swal("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
					}
				});

			});
  	},
  	'click .edit': function () {
  		Session.set('editarVehiculo', this._id);
  		Modal.show('EditarVehiculo');
  		console.log(Session.get('editarVehiculo'));
  	},
  	'change #fotovehiculo'(e, t) {

  		SubirFotoVehiculo(e, t, this._id, 'foto', 'fotovehiculo');
  	},
  	'change #fotovehiculo2'(e, t) {
  		SubirFotoVehiculo(e, t, this._id, 'foto2', 'fotovehiculo2');
  	},
  	'change #fotovehiculo3'(e, t) {
  		SubirFotoVehiculo(e, t, this._id, 'foto3', 'fotovehiculo3');
  	},
  	'change #fotovehiculo4'(e, t) {
  		SubirFotoVehiculo(e, t, this._id, 'foto4', 'fotovehiculo4');
  	},
  	'change #fotovehiculo5'(e, t) {
  		SubirFotoVehiculo(e, t, this._id, 'foto5', 'fotovehiculo5');
  	},
  	'change #fotovehiculo6'(e, t) {
  		SubirFotoVehiculo(e, t, this._id, 'foto6', 'fotovehiculo6');
  	},
  	'change .vehiculo-activo'(e, t) {
      Meteor.call('aprobarVehiculo', this._id, (err) => {
        if (err) {
          Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
        } else {
          Bert.alert('El vehículo fue aprobado', 'success');
        }
      });
  	},
    'change .conductor-activo'(e, t) {
      Meteor.call('aprobarConductor', this._id, (err) => {
        if (err) {
          Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
        } else {
          Bert.alert('El conductor fue aprobado', 'success');
        }
      });
  	},
    'change .cobrador-activo'(e, t) {
      Meteor.call('aprobarCobrador', this._id, (err) => {
        if (err) {
          Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
        } else {
          Bert.alert('El cobrador fue aprobado', 'success');
        }
      });
  	}
});
