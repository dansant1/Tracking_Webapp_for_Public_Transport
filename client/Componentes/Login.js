Template.Login.events({
	'submit form'(e, t) {

		e.preventDefault();
		
		let email = t.find("[name='email']").value;
		let password = t.find("[name='password']").value;
	
		if (email !== "" && password !== "") {
			Meteor.loginWithPassword(email, password, (err) => {
				if (err) {
					alert('Hubo un error');
				}
				var currentUser = Meteor.users.findOne({_id:Meteor.userId()});
				if(currentUser.roles.Empresa) {
					currentUser.roles.Empresa.forEach(rol=> {
						if(rol == 'Operador Asistente') {
							FlowRouter.go('/vehiculos');
						}
					});
				}
			});
		} else {
			alert('Complete los datos');
		}
	}
});