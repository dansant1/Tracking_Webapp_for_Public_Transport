Template.AgregarConductor.events({
	'click .guardar'(e, t) {

		let datos = {
			datos: {
				nombre: t.find("[name='nombre']").value,
				apellido: t.find("[name='apellido']").value,
				caducidad: t.find("[name='caducidaddni']").value,
				dni: t.find("[name='dni']").value,
				domicilio: t.find("[name='domicilio']").value,
				distrito: t.find("[name='distrito']").value,
				telefono: t.find("[name='telefono']").value
			},
			licencia: {
				codigo: t.find("[name='codigolicencia']").value,
				categoria: t.find("[name='categoria']").value,
				expedicion: t.find("[name='expedicion']").value,
				revalidacion: t.find("[name='revalidacion']").value
			},
			CEV: {
				codigo: t.find("[name='codigocev']").value,
				emision: t.find("[name='emision']").value,
				caducidad: t.find("[name='caducidad']").value 
			},
			credencial: {
				codigo: t.find("[name='codigocredencial']").value,
				emision: t.find("[name='emisionsoat']").value,
				caducidad: t.find("[name='caducidadsoat']").value
			},
			createdAt: new Date(),
			empresaId: FlowRouter.getParam('empresaId')
		}

		if (datos) {
			Meteor.call('agregarConductor', datos, function (err) {
				if (err) {
					alert(err);
				} else {
					Modal.hide('AgregarConductor');
					swal("¡Listo!", "El conductor ha sido agregado.", "success");
				}
			});
		}
	
	}
});

Template.AgregarConductor1.events({
	'click .guardar'(e, t) {

		let datos = {
			datos: {
				nombre: t.find("[name='nombre']").value,
				apellido: t.find("[name='apellido']").value,
				caducidad: t.find("[name='caducidaddni']").value,
				dni: t.find("[name='dni']").value,
				domicilio: t.find("[name='domicilio']").value,
				distrito: t.find("[name='distrito']").value,
				telefono: t.find("[name='telefono']").value
			},
			licencia: {
				codigo: t.find("[name='codigolicencia']").value,
				categoria: t.find("[name='categoria']").value,
				expedicion: t.find("[name='expedicion']").value,
				revalidacion: t.find("[name='revalidacion']").value
			},
			CEV: {
				codigo: t.find("[name='codigocev']").value,
				emision: t.find("[name='emision']").value,
				caducidad: t.find("[name='caducidad']").value 
			},
			credencial: {
				codigo: t.find("[name='codigocredencial']").value,
				emision: t.find("[name='emisionsoat']").value,
				caducidad: t.find("[name='caducidadsoat']").value
			},
			createdAt: new Date(),
			empresaId: Meteor.user().profile.empresaId
		}

		if (datos) {
			Meteor.call('agregarConductor', datos, function (err) {
				if (err) {
					alert(err);
				} else {
					Modal.hide('AgregarConductor1');
					swal("¡Listo!", "El conductor ha sido agregado.", "success");
				}
			});
		}
	
	}
});