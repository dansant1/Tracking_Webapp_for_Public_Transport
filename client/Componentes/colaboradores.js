import { handleFile, SubirFotoVehiculo, SubirFotoConductor, SubirFotoCobrador } from '../Utilities/archivos'

Template.ListaDeConductoresInterno.onCreated( () => {
	let template = Template.instance();

  	template.searchQuery = new ReactiveVar();
  	template.searching   = new ReactiveVar( false );

  	Session.set('editarConductor', null);

  	template.autorun( () => {
    	let empresaId = Meteor.user().profile.empresaId;
      console.log(empresaId);
    	console.log(empresaId);
    	template.subscribe( 'ConductoresPorEmpresa', empresaId, template.searchQuery.get(), () => {
      		setTimeout( () => {
        		template.searching.set( false );
      		}, 300 );
    	});
  	});
});

Template.ListaDeConductoresInterno.helpers({
  	searching() {
    	return Template.instance().searching.get();
  	},
  	query() {
    	return Template.instance().searchQuery.get();
  	},
  	conductores: function () {
  		let vehiculos = Conductores.find();

  		if (vehiculos) {		
  			let empresaId = Meteor.user().profile.empresaId;
  			return Conductores.find({empresaId: empresaId});
  		} 
		
	}
});

Template.ListaDeConductoresInterno.events({
  	'keyup [name="search"]' ( event, template ) {
  	
    	let value = event.target.value.trim();

	    
	    	template.searchQuery.set( value );
	    	template.searching.set( true );
	    

	    if ( value === '' ) {
	      template.searchQuery.set( value );
	    }
  	},
  	'click .remove' () {
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
  	'click .edit': function () {
  		Session.set('editarConductor', this._id);
  		Modal.show('EditarConductor');
  		
  	},
  	'change #fotoconductor1'(e, t) {
  		console.log('hola');
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
  	}
});

Template.ListaDeCobradoresInterno.onCreated( () => {
  let template = Template.instance();

    template.searchQuery = new ReactiveVar();
    template.searching   = new ReactiveVar( false );

    Session.set('editarCobrador', null);

    template.autorun( () => {
      let empresaId = Meteor.user().profile.empresaId;
      template.subscribe( 'CobradoresPorEmpresa', empresaId, template.searchQuery.get(), () => {
          setTimeout( () => {
            template.searching.set( false );
          }, 300 );
      });
    });
});

Template.ListaDeCobradoresInterno.helpers({
    searching() {
      return Template.instance().searching.get();
    },
    query() {
      return Template.instance().searchQuery.get();
    },
    cobradores: function () {
      let vehiculos = Cobradores.find();

      if (vehiculos) {    
        let empresaId = Meteor.user().profile.empresaId;
        return Cobradores.find({empresaId: empresaId});
      } 
    
  }
});

Template.ListaDeCobradoresInterno.events({
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
    'click .edit': function () {

      Session.set('editarCobrador', this._id);
      Modal.show('EditarCobrador');
     
    },
    'change #fotocobrador1'(e, t) {
      
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
    }
});