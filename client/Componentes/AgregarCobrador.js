Template.AgregarCobrador.events({
	'click .guardar'(e, t) {

		let datos = {
			
			datos: {
				nombre: t.find("[name='nombre']").value,
				apellido: t.find("[name='apellidos']").value,
				dni: t.find("[name='dni']").value,
				domicilio: t.find("[name='domicilio']").value,
				distrito: t.find("[name='distrito']").value
			},
			CEV: {
				codigo: t.find("[name='codigocev']").value,
				emision: t.find("[name='emisioncev']").value,
				caducidad: t.find("[name='caducidadcev']").value
			},
			credencial: {
				numero: t.find("[name='numerocredencial']").value,
				emision: t.find("[name='emisioncredencial']").value,
				caducidad: t.find("[name='caducidadcredencial']").value,
			},
			createdAt: new Date(),
			empresaId: FlowRouter.getParam('empresaId')

		}

		if (datos) {
			Meteor.call('agregarCobrador', datos, function (err) {
				if (err) {
					alert(err);
				} else {
					Modal.hide('AgregarCobrador');
					swal("¡Listo!", "El cobrador ha sido agregado.", "success");
				}
			});
		}
	
	}
});

Template.AgregarCobrador1.events({
	'click .guardar'(e, t) {

		let datos = {
			
			datos: {
				nombre: t.find("[name='nombre']").value,
				apellido: t.find("[name='apellidos']").value,
				dni: t.find("[name='dni']").value,
				domicilio: t.find("[name='domicilio']").value,
				distrito: t.find("[name='distrito']").value
			},
			CEV: {
				codigo: t.find("[name='codigocev']").value,
				emision: t.find("[name='emisioncev']").value,
				caducidad: t.find("[name='caducidadcev']").value
			},
			credencial: {
				numero: t.find("[name='numerocredencial']").value,
				emision: t.find("[name='emisioncredencial']").value,
				caducidad: t.find("[name='caducidadcredencial']").value,
			},
			createdAt: new Date(),
			empresaId: Meteor.user().profile.empresaId

		}

		if (datos) {
			Meteor.call('agregarCobrador', datos, function (err) {
				if (err) {
					alert(err);
				} else {
					Modal.hide('AgregarCobrador1');
					swal("¡Listo!", "El cobrador ha sido agregado.", "success");
				}
			});
		}
	
	}
});