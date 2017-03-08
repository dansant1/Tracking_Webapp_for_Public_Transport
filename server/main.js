import {Meteor} from 'meteor/meteor';
import ROLES from '../Both/Roles'

Meteor.startup(() => {

    // let planes = [
    //     {
    //         "numero": 1,
    //         "nombre": "Plan Horario 1",
    //         "dias": [1, 2, 3, 4, 5],
    //         "empresaId": "4f2dLN68ANPT6NAwu",
    //         "rutaId": "JpfYQBocbvbNPiuks",
    //         "rangos": [
    //             {
    //                 "hora_inicio": "04:00",
    //                 "hora_fin": "08:00",
    //                 "frecuencia": 20
    //             },
    //             {
    //                 "hora_inicio": "08:00",
    //                 "hora_fin": "12:00",
    //                 "frecuencia": 20
    //             },
    //             {
    //                 "hora_inicio": "12:00",
    //                 "hora_fin": "16:00",
    //                 "frecuencia": 15,
    //             }
    //         ]
    //     },
    //     {
    //         "numero": 2,
    //         "nombre": "Plan Horario 2",
    //         "dias": [6, 0],
    //         "empresaId": "4f2dLN68ANPT6NAwu",
    //         "rutaId": "JpfYQBocbvbNPiuks",
    //         "rangos": [
    //             {
    //                 "hora_inicio": "04:00",
    //                 "hora_fin": "08:00",
    //                 "frecuencia": 20
    //             },
    //             {
    //                 "hora_inicio": "08:00",
    //                 "hora_fin": "12:00",
    //                 "frecuencia": 20
    //             },
    //             {
    //                 "hora_inicio": "12:00",
    //                 "hora_fin": "16:00",
    //                 "frecuencia": 15,
    //             }
    //         ]
    //     },
    //     {
    //         "numero": 0,
    //         "nombre": "Plan Horario 0",
    //         "empresaId": "4f2dLN68ANPT6NAwu",
    //         "rutaId": "JpfYQBocbvbNPiuks",
    //         "dias": [0, 1, 2, 3, 4, 5, 6],
    //         "rangos": [
    //             {
    //                 "hora_inicio": "04:00",
    //                 "hora_fin": "20:00",
    //                 "frecuencia": 10
    //             }
    //         ]
    //     }
    // ];
    //
    // planes.forEach(p=> {
    //     PlanHorario.insert(p);
    // });


    // 	let users = [
    //    	{nombre: "Usuario 1", email: "superadministrador@tpi.com.pe", roles: [ ROLES.administracion.gerente ]},
    //    	{nombre: "Usuario 4", email: "soporte@tpi.com.pe", roles: [ ROLES.administracion.soporte ]},
    //      	{nombre: "Usuario 2", email: "director@tpi.com.pe", roles: [ ROLES.empresa.director ]},
    //      	{nombre: "Usuario 3", email: "operador@tpi.com.pe", roles: [ ROLES.empresa.operador ]}
    //    ]
    //
    //  _.each(users, ( user ) => {
    //
    //  		let id;
    //
    //  	id = Accounts.createUser({
    //  	    email: user.email,
    //  	    password: "password",
    //  	    profile: { nombre: user.nombre }
    //    	})
    //
    //    	switch (user.email) {
    //    		case 'superadministrador@tpi.com.pe':
    //    			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.administracion);
    //    		break;
    //
    //    		case 'soporte@tpi.com.pe':
    //    			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.administracion);
    //    		break;
    //
    //    		case 'director@tpi.com.pe':
    //    			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.empresa);
    //    		break;
    //
    //    		case 'operador@tpi.com.pe':
    //    			Roles.addUsersToRoles(id, user.roles, ROLES.grupos.empresa);
    //    		break;
    //    	}
    //
    //
    //
    //  });

});
