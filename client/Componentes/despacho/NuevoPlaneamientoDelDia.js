Template.NuevoPlaneamientoDelDia.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {
		let empresaId = Meteor.user().profile.empresaId;
		template.subscribe('DetalleDeEmpresaPlaneamiento', empresaId);
	})
});

Template.NuevoPlaneamientoDelDia.onRendered(() => {
	let template = Template.instance();

	template.autorun( () => {
		let empresaId = Meteor.user().profile.empresaId;
		template.subscribe('VehiculosEmpresa', empresaId, () => {

			if (Vehiculos.find().fetch().length > 0) {

				$(".js-example-basic").select2({
						placeholder: "Asigna a una o más empresas a esta ruta",
				})

			}

		})
	})
})


Template.NuevoPlaneamientoDelDia.helpers({
	vehiculos() {
		return Vehiculos.find();
	},
	horario() {

		let fecha = new Date();
		let hoyEs = fecha.getDay();


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
		} else if (hoyEs === 0) {
			return Planeamiento.find().fetch()[0].plan.horas.domingo;
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
		} else if (hoyEs === 0) {
			return this.domingo;
		} else {
			return;
		}
	}
})

Template.NuevoPlaneamientoDelDia.events({
  'click .guardar'(e, t) {
    let datos = [];

    $('li.planeamiento').each(function(index, obj) {

      if ($(obj).find('.vehicle').val() !== '0') {
        let vehiculo = $(obj).find('.vehicle').val()
        let ida = $(obj).find('#ida').is(':checked');
        let hoy = new Date();
        let dd = hoy.getDate();
        var mm = hoy.getMonth() + 1;

        let yyyy = hoy.getFullYear();

        if ( dd < 10 ) {
            dd='0'+dd;
        }

        if ( mm < 10 ) {
            mm='0'+mm;
        }
          var today = dd+'/'+mm+'/'+yyyy;
          let hora = $(obj).find('span.hour').text();

          if (vehiculo !== null) {
            let registro = {
              vehiculoId: vehiculo,
              empresaId: Meteor.user().profile.empresaId,
							rutaId: FlowRouter.getParam('rutaId'),
              despachado: false,
              hora: hora,
              ida: ida,
              dia: today,
              createdAt: new Date()
            }
            datos.push(registro)


          }

      }

    });

    Meteor.call('guardarPlaneamientoDeHoy', datos, (err) => {
      if (err) {
        Bert.alert('Hubo un error, vuelva a intentarlo', 'danger')
      } else {
        FlowRouter.go('/')
        Bert.alert('Planeamiento de hoy agregado', 'success')
      }
    })
  }
})
