import { handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador } from '../Utilities/archivos'

Template.ListaDeVehiculosInterno.onCreated( () => {
	let template = Template.instance();

  	template.searchQuery = new ReactiveVar();
  	template.searching   = new ReactiveVar( false );

  	Session.set('editarVehiculo', null);

  	template.autorun( () => {
    	let empresaId = Meteor.user().profile.empresaId;
      console.log(empresaId);
      template.subscribe('DetalleDeEmpresa', empresaId);
      template.subscribe('Rutas');
    	template.subscribe( 'VehiculosPorEmpresa', empresaId, template.searchQuery.get(), () => {
      		setTimeout( () => {
        		template.searching.set( false );
      		}, 300 );
    	});
  	});
});

Template.ListaDeVehiculosInterno.helpers({
  	searching() {
    	return Template.instance().searching.get();
  	},
  	query() {
    	return Template.instance().searchQuery.get();
  	},
  	vehiculo: function () {
  		let vehiculos = Vehiculos.find();

  		if (vehiculos) {
  			let empresaId = Meteor.user().profile.empresaId;
  			return Vehiculos.find({empresaId: empresaId});
  		}
	},
	fotos() {
		return FotosDeVehiculos.find();
	},
	checked() {
		if (this.activo === false) {
			return 'checked'
		} else {
			return ''
		}
	},
  empresas() {
        console.log(Empresas.find({_id: Meteor.user().profile.empresaId }).fetch()[0].rutas);
        console.log('si funciona :/');
        return Empresas.find({_id: Meteor.user().profile.empresaId }).fetch()[0].rutas;
  },
  ruta(id) {
        console.log(Rutas.findOne({_id: id}).nombre)

        return Rutas.findOne({_id: id}).nombre;
  }
});

Template.ListaDeVehiculosInterno.events({
  	'keyup [name="search"]' ( event, template ) {

    	let value = event.target.value.trim();

	    //if ( value !== '' && event.keyCode === 13 ) {
	    	template.searchQuery.set( value );
	    	template.searching.set( true );
	    //}

	    if ( value === '' ) {
	      template.searchQuery.set( value );
	    }
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
  		if ($("#sw" + this._id).is(':checked')) {
  			console.log($("#sw" + this._id).is(':checked'));
  			Meteor.call('estadoVehiculo', this._id, false, (err) => {
  				if (err) {
  					Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
  				} else {
  					Bert.alert('El vehículo está inactivo', 'success');
  				}
  			});
  		} else {
  			Meteor.call('estadoVehiculo', this._id, true, (err) => {
  				if (err) {
  					Bert.alert('Hubo un error, vuelva a intentarlo', 'danger');
  				} else {
  					Bert.alert('El vehículo está activo', 'success');
  				}
  			});
  		}
  	},
  'change #subirFlota'(e, t) {
    let id = Meteor.user().profile.empresaId;
    let rutaId = $("#listarutas").val();

    handleFile(e, id, rutaId);
  }
});

Template.AgregarVehiculoInterno.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe('rutas');
  });
});

Template.AgregarVehiculoInterno.helpers({
  rutas() {
    return Rutas.find();
  }
});

Template.AgregarVehiculoInterno.events({
  'click .guardar'(e, t) {

    let datos = {
      placa: t.find("[name='placa']").value,
      propietario: {
        nombre: t.find("[name='propietario']").value,
        dni: t.find("[name='dni']").value,
        domicilio: t.find("[name='domicilio']").value,
        distrito: t.find("[name='distrito']").value,
        telefono: t.find("[name='telefono']").value
      },
      tecnico: {
        marca: t.find("[name='marca']").value,
        modelo: t.find("[name='modelo']").value,
        serie: t.find("[name='serie']").value,
        combustible: t.find("[name='combustible']").value,
        anioDeFabricacion: t.find("[name='anioDeFabricacion']").value,
        longitud: t.find("[name='longitud']").value,
        asientos: t.find("[name='asientos']").value
      },
      compania: t.find("[name='compania']").value,
      rutaId: $('#listaruta').val(),
      codigoDeRuta: Rutas.find({_id: $('#listaruta').val()}).nombre,
      fechaDePermanenciaEnLaEmpresa: t.find("[name='fechaDePermanenciaEnLaEmpresa']").value,
      TC: {
        numero: t.find("[name='tc']").value,
        emision: t.find("[name='emisiontc']").value,
        caducidad: t.find("[name='caducidadtc']").value
      },
      SOAT: {
        numero: t.find("[name='soat']").value,
        inicio: t.find("[name='emisionsoat']").value,
        fin: t.find("[name='caducidadsoat']").value
      },
      CITV: {
        numero: t.find("[name='rt']").value,
        inicio: t.find("[name='emisionrt']").value,
        fin: t.find("[name='caducidadrt']").value
      },
      aseguradora: t.find("[name='aseguradora']").value,
      RC: {
        numero: t.find("[name='rc']").value,
        inicio: t.find("[name='emisionrc']").value,
        fin: t.find("[name='caducidadrc']").value
      },
      TCH: {
        numero: t.find("[name='tch']").value,
        emision: t.find("[name='emisiontch']").value,
        caducidad: t.find("[name='caducidadtch']").value
      },
      padron: t.find("[name='padron']").value,
      createdAt: new Date(),

      empresaId: Meteor.user().profile.empresaId
    }

    if (datos.placa !== "") {
      Meteor.call('agregarVehiculo', datos, function (err) {
        if (err) {
          alert(err);
        } else {
          Modal.hide('AgregarVehiculoInterno');
          swal("¡Listo!", "El vehículo ha sido agregado.", "success");
        }
      });
    }

  }
});


Template.Despacho.events({
	'click .despachar'(event, template) {
		let $li = $(event.target).parent().parent();
		let hora = $li.find(".time").html();
		let vehiculoId = $li.find(".vehicle").val();
		let $btn = $li.find(".despachar");
		Meteor.call('despachar',{vehiculoId, hora},function (err) {
			if (err) {
				alert(err);
			} else {
				swal("¡Listo!", "Vehíulo despachado!", "success");
				$btn.attr("disabled", "disabled");
				$btn.addClass("btn-disabled");
			}
		});
	},
    'change .vehicle'(event, template){
        let vehiculo = Vehiculos.findOne({_id:event.target.value});
        let totalRequisitosVehiculo = Requisitos.find({_id: {$in: vehiculo.idRequisitos || []}}).count();
        let totalRequisitos = Requisitos.find().count();
        let $btn = $(event.target).parent().parent().parent().find(".despachar");
        if(!vehiculo.despachado && totalRequisitosVehiculo === totalRequisitos){
            $btn.removeAttr("disabled");
            $btn.removeClass("btn-disabled");
        } else {
            $btn.attr("disabled", "disabled");
            $btn.addClass("btn-disabled");
        }
    }
});

Template.Despacho.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {
		let empresaId = Meteor.user().profile.empresaId;
		//let rutaId = Session.get('r')
		template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
		template.subscribe('Requisitos');
	})
});

Template.Despacho.onRendered(() => {
	let template = Template.instance();

	template.autorun( () => {
		let empresaId = Meteor.user().profile.empresaId;
		template.subscribe('VehiculosEmpresa', empresaId, () => {

			if (Vehiculos.find().fetch().length > 0) {
				console.log('ff');
				$(".js-example-basic").select2({
						placeholder: "Asigna a una o más empresas a esta ruta",
				});
				console.log('fffgf');
			}

		})
	})

})

Template.Despacho.onRendered( function () {

})

Template.Despacho.helpers({
	vehiculos() {
		return Vehiculos.find();
	},
    habilitadoDespacho(vehiculoId){
        let vechiulo = Vehiculos.findOne({_id:vehiculoId});
    },
	horario() {

		let fecha = new Date();
		let hoyEs = fecha.getDay();

        let planeamientos = Planeamiento.find().fetch();


		if (hoyEs === 1) {
			return Planeamiento.find().fetch()[0].plan.horas.lunes;
		} else if (hoyEs === 2) {
			return Planeamiento.find().fetch()[0].plan.horas.martes;
		} else if (hoyEs === 3) {
			return Planeamiento.find().fetch()[0].plan.horas.miercoles;
		} else if (hoyEs === 4) {
			return Planeamiento.find().fetch()[0].plan.horas.jueves;
		} else if (hoyEs === 5) {
			return Planeamiento.find().fetch()[0].plan.horas.viernes;
		} else if (hoyEs === 6) {
			return Planeamiento.find().fetch()[0].plan.horas.sabado;
		} else if (hoyEs === 7) {
			return Planeamiento.find().fetch()[0].plan.horas.domingo;
		} else {
			return [];
		}

	},
	hora() {
		let fecha = new Date();
		let hoyEs = fecha.getDay();

		if (hoyEs === 1) {
			return this.lunes;
		} else if (hoyEs === 2) {
			return this.martes;
		} else if (hoyEs === 3) {
			return this.miercoles;
		} else if (hoyEs === 4) {
			return this.jueves;
		} else if (hoyEs === 5) {
			return this.viernes;
		} else if (hoyEs === 6) {
			return this.sabado;
		} else if (hoyEs === 7) {
			return this.domingo;
		} else {
			return;
		}
	}
})
