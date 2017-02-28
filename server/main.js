import { Meteor } from 'meteor/meteor';
import ROLES from '../Both/Roles'

Meteor.startup(() => {

  	let users = [
     	{nombre: "Usuario 1", email: "superadministrador@tpi.com.pe", roles: [ ROLES.administracion.gerente ]},
     	{nombre: "Usuario 4", email: "soporte@tpi.com.pe", roles: [ ROLES.administracion.soporte ]},
       	{nombre: "Usuario 2", email: "director@tpi.com.pe", roles: [ ROLES.empresa.director ]},
       	{nombre: "Usuario 3", email: "operador@tpi.com.pe", roles: [ ROLES.empresa.operador ]}
     ]

	 _.each(users, ( user ) => {

   		let id;

	 	id = Accounts.createUser({
	 	    email: user.email,
	 	    password: "password",
	 	    profile: { nombre: user.nombre }
	   	})

	   	switch (user.email) {
	   		case 'superadministrador@tpi.com.pe':
	   			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.administracion);
	   		break;

	   		case 'soporte@tpi.com.pe':
	   			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.administracion);
	   		break;

	   		case 'director@tpi.com.pe':
	   			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.empresa);
	   		break;

	   		case 'operador@tpi.com.pe':
	   			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.empresa);
	   		break;
	   	}



	 });

});
