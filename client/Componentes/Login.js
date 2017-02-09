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
			});
		} else {
			alert('Complete los datos');
		}
	}
});