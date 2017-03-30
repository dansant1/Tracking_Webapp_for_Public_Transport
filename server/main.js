import {Meteor} from 'meteor/meteor';
import ROLES from '../Both/Roles'

Meteor.startup(() => {

    if (PlanesHorarios.find({}).fetch().length === 0) {

      for (var i = 1; i <= 8; i++) {

        PlanesHorarios.insert({
          createdAt: new Date(),
          nombre: i,
          frecuencia: 0
        });

      }

    }


    //  	let users = [
    //     	{nombre: "Usuario 1", email: "superadministrador@tpi.com.pe", roles: [ ROLES.administracion.gerente ]},
     //
    //     ]
     //
    //  _.each(users, ( user ) => {
     //
    //   		let id;
     //
    //   	id = Accounts.createUser({
    //   	    email: user.email,
    //   	    password: "password",
    //   	    profile: { nombre: user.nombre }
    //     	})
     //
    //     	switch (user.email) {
    //     		case 'superadministrador@tpi.com.pe':
    //     			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.administracion);
    //     		break;
     //
    //     		case 'soporte@tpi.com.pe':
    //     			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.administracion);
    //     		break;
    //         		case 'director@tpi.com.pe':
    //    			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.empresa);
    //     		break;
     //
    //     		case 'operador@tpi.com.pe':
    //     			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.empresa);
    //     		break;
    //     	}
     //
     //
     //
    //   });

});
