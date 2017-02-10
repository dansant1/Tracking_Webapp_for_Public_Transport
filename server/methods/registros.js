import { Meteor } from 'meteor/meteor';
import { Excel } from 'meteor/netanelgilad:excel'
import ROLES from '../../Both/Roles'

Meteor.methods({
	agregarEmpresa(datos) {

		Empresas.insert({
			nombre: datos.nombre,
			createdAt: new Date(),
			ruc: datos.ruc,
			domicilio: datos.domicilio,
			representante: datos.representante,
			telefono: datos.telefono,
			email: datos.email
		});

	},
	agregarUsuario(datos, rol) {
		id = Accounts.createUser(datos);

		if (id) {
			
			if (rol === 1) {
				Directores.insert({
					nombre: datos.profile.nombre,
					empresaId: datos.profile.empresaId,
					email: datos.email,
					userId: id
				});
				Roles.addUsersToRoles(id, [ ROLES.empresa.director ], ROLES.grupos.empresa);
			} else if ( rol === 2) {
				Operadores.insert({
					nombre: datos.profile.nombre,
					empresaId: datos.profile.empresaId,
					email: datos.email,
					userId: id,
					tipo: 'Operador de Despacho'
				});
				Roles.addUsersToRoles(id, [ ROLES.empresa.operador ], ROLES.grupos.empresa);
			} else {
				Operadores.insert({
					nombre: datos.profile.nombre,
					empresaId: datos.profile.empresaId,
					email: datos.email,
					userId: id,
					tipo: 'Operador de Monitoreo'
				});
				Roles.addUsersToRoles(id, [ ROLES.empresa.monitoreo ], ROLES.grupos.empresa);
			}

		} else {
			return;
		}
	},
	generarReporte1() {
		var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
		let excel = new Excel('xlsx');
		var wbout = excel.write(workbook,wopts);

		function s2ab (s) {
		  var buf = new ArrayBuffer(s.length);
		  var view = new Uint8Array(buf);
		  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		  return buf;
		}	

		
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx");
	},
	leerExcel(data, id, rutaId) {

	if (this.userId) {

		let excel = new Excel('xlsx');

		let workbook = excel.read(data, {type: 'binary'});

		let sheet_name_list = workbook.SheetNames;
		let sheet = workbook.Sheets[sheet_name_list[0]];
		let hojaDeConductores = workbook.Sheets[sheet_name_list[1]];
		let hojaDeCobradores = workbook.Sheets[sheet_name_list[2]];
	
		let datos = excel.utils.sheet_to_json( sheet, { header: 1 } );
		datos.shift(); 

		let conductores = excel.utils.sheet_to_json( hojaDeConductores, { header: 1 } );
		conductores.shift();

		let cobradores = excel.utils.sheet_to_json( hojaDeCobradores, { header: 1 } );
		cobradores.shift();

		if (Rutas.findOne({_id: rutaId}).nombre !== undefined) {
			// Parsear los Vehiculos e insertar en la BD
		datos.forEach( d => {
			
			let obj = d.reduce( (acc, cur, i) => {
		    	acc[i] = cur;
		    	return acc;
			}, {});

			console.log(rutaId);
			
			if (obj['1'] !== undefined) {
				Vehiculos.insert({
					empresaId: id,
					activo: true,
					rutaId: rutaId,
					padron: obj['0'],
					placa: obj['1'],
					propietario: {
						nombre: obj['2'],
						dni: obj['3'],
						domicilio: obj['4'],
						distrito: obj['5'],
						telefono: obj['6'],
					},
					compania: obj['24'],
					tecnico: {
						marca: obj['7'],
						modelo: obj['8'],
						serie: obj['9'],
						combustible: obj['10'],
						anioDeFabricacion: parseInt(obj['11']),
						longitud: obj['12'],
						asientos: parseInt(obj['13'])
					},
					codigoDeRuta: Rutas.findOne({_id: rutaId}).nombre,
					fechaDePermanenciaEnLaEmpresa: obj['15'],
					TC: {
						numero: obj['16'],
						emision: obj['17'],
						caducidad: obj['18']
					},
					SOAT: {
						numero: obj['19'],
						inicio: obj['21'],
						fin: obj['22']
					},
					CITV: {
						numero: obj['23'],
						inicio: obj['25'],
						fin: obj['26']
					},
					aseguradora: obj['28'],
					RC: {
						numero: obj['27'],
						inicio: obj['29'],
						fin: obj['30']
					},
					TCH: {
						numero: obj['31'],
						emision: obj['32'],
						caducidad: obj['33']
					}
				});
			}
		
		});
		}
		
		

		
		let vehiculoId;
		let placa;

		// Parsear los conductores e insertar en la BD
		conductores.forEach( c => {

			let conductor = c.reduce( (acc, cur, i) => {
		    	acc[i] = cur;
		    	return acc;
			}, {});

			placa = conductor['1'];
			//console.log(placa);
			if (placa !== undefined) {

				if (Vehiculos.find({placa: placa}).fetch()[0]._id === undefined) {
					vehiculoId = "";
				} else {
					vehiculoId = Vehiculos.find({placa: placa}).fetch()[0]._id;
				}
				
			}
			
			if (conductor['2'] !== undefined) {
				Conductores.insert({
					empresaId: id,
					vehiculoId: vehiculoId,
					datos: {
						nombre: conductor['3'],
						apellido: conductor['2'],
						dni: conductor['4'],
						caducidad: conductor['5'],
						domicilio: conductor['6'],
						distrito: conductor['7'],
						telefono: conductor['8']
					},
					licencia: {
						codigo: conductor['9'],
						categoria: conductor['10'],
						expedicion: conductor['11'],
						revalidacion: conductor['12']
					},
					CEV: {
						codigo: conductor['13'],
						emision: conductor['14'],
						caducidad: conductor['15']
					},
					credencial: {
						numero: conductor['16'],
						emision: conductor['17'],
						caducidad: conductor['18']
					},
					chc: conductor['19'],
					fotocheck: conductor['20']
				});
			}

					
		
		});

		

		// Parsear los cobradores e insertar en la BD
		cobradores.forEach( co => {
			
			let cobrador = co.reduce( (acc, cur, i) => {
		    	acc[i] = cur;
		    	return acc;
			}, {});

		

			placa = cobrador['1'];

			if (placa !== undefined) {
				
				vehiculoId = Vehiculos.find({placa: placa}).fetch()[0]._id;
			}
			

			if (cobrador['2'] !== undefined) {
				Cobradores.insert({
					empresaId: id,
					vehiculoId: vehiculoId,
					datos: {
						nombre: cobrador['3'],
						apellido: cobrador['2'],
						dni: cobrador['4'],
						domicilio: cobrador['5'],
						distrito: cobrador['6'],
						telefono: cobrador['7']
					},
					CEV: {
						codigo: cobrador['8'],
						emision: cobrador['9'],
						caducidad: cobrador['10']
					},
					credencial: {
						numero: cobrador['11'],
						emision: cobrador['12'],
						caducidad: cobrador['13']
					},
					chc: cobrador['14'],
					fotocheck: cobrador['15']
				});			
			}

			
		
		});
	
	} else {
		return;
	}
	
	},
	leerPlaneamientoExcel(empresa, ruta, data) {
		let excel = new Excel('xlsx');

		let workbook = excel.read(data, {type: 'binary'});

		let sheet_name_list = workbook.SheetNames;
		let sheet = workbook.Sheets[sheet_name_list[0]];
		
		let datos = excel.utils.sheet_to_json( sheet, { header: 1 } );
		
		datos.shift();
		let plan = {
			horas: {
                lunes: [],
                martes: [],
                miercoles: [],
                jueves: [],
                viernes: [],
                sabado: [],
                domingo: []
        	}
		}
		

		// Parsear los conductores e insertar en la BD
		datos.forEach( c => {

			let hora = c.reduce( (acc, cur, i) => {
		    	acc[i] = cur;
		    	return acc;
			}, {});

			plan.horas.lunes.push({
                lunes: hora['0']
            });

            plan.horas.martes.push({
                martes: hora['0']
            });

            plan.horas.miercoles.push({
                miercoles: hora['0']
            });

            plan.horas.jueves.push({
                jueves: hora['0']
            });

            plan.horas.viernes.push({
                viernes: hora['0']
            });

            plan.horas.sabado.push({
                sabado: hora['1']
            });

            plan.horas.domingo.push({
                domingo: hora['2']
            });		
		
		});

		if (Planeamiento.find({empresaId: empresa, rutaId: ruta}).fetch().length === 0 ) {
			Planeamiento.insert({
				empresaId: empresa,
				rutaId: ruta,
				plan: plan
			});

		} else {
			return 'Ya existe un plan de rodamiento para esta empresa y ruta';
		}

		
	
	},
	agregarVehiculo(datos) {
		if (this.userId) {
			datos.activo = true;
			Vehiculos.insert(datos);
		} else {
			return;
		}
	},
	estadoVehiculo(id, estado) {
		if ( this.userId ) {
			
			Vehiculos.update({_id: id}, {
				$set: {
					activo: estado
				}
			});

		} else {
			return;
		}
	},
	agregarConductor(datos) {
		if (this.userId) {
			Conductores.insert(datos);
		} else {
			return;
		}
	},
	agregarCobrador(datos) {
		if (this.userId) {
			Cobradores.insert(datos);
		} else {
			return;
		}	
	},
	editarVehiculo(vehiculoId, datos) {

		Vehiculos.update({_id: vehiculoId}, {
			$set: {
				placa: datos.placa,
				propietario: datos.propietario,
				tecnico: datos.tecnico,
				compania: datos.compania,
				codigoDeRuta: datos.codigoDeRuta,
				fechaDePermanenciaEnLaEmpresa: datos.fechaDePermanenciaEnLaEmpresa,
				TC: datos.TC,
				SOAT: datos.SOAT,
				CITV: datos.CITV,
				aseguradora: datos.aseguradora,
				RC: datos.RC,
				TCH: datos.TCH
			}
		});
	},
	editarConductor(vehiculoId, datos) {

		Conductores.update({_id: vehiculoId}, {
			$set: {
				datos: datos.datos,
				licencia: datos.licencia,
				CEV: datos.CEV,
				credencial: datos.credencial
			}
		});
	},
	editarCobrador(vehiculoId, datos) {

		Cobradores.update({_id: vehiculoId}, {
			$set: {
				datos: datos.datos,
				CEV: datos.CEV,
				credencial: datos.credencial
			}
		});
	},
	EliminarVehiculo(vehiculoId) {
		Vehiculos.remove({_id: vehiculoId});
	},
	EliminarCobrador(cobradorId) {
		Cobradores.remove({_id: cobradorId});
	},
	EliminarConductor(conductorId) {
		Conductores.remove({_id: conductorId});
	},
	eliminarDirector(directorId) {

		if (this.userId) {
			let userId = Directores.findOne({_id: directorId}).userId;
			Directores.remove({_id: directorId});
			Meteor.users.remove({_id: userId});	
		} else {
			return;
		}
		
	},
	eliminarOperador(operadorId) {
		
		if (this.userId) {
			let userId = Operadores.findOne({_id: directorId}).userId;
			Operadores.remove({_id: directorId});
			Meteor.users.remove({_id: userId});	
		} else {
			return;
		}
		
	},
	editarEmpresa(datos, empresaId) {
		if (this.userId) {
			Empresas.update({_id: empresaId}, {
				$set: datos
			});
		} else {
			return;
		}
	},
	agregarPlaneamientoEmpresa(datos, empresaId) {

		if (this.userId) {
		
			let planeamiento = Planeamiento.find({empresaId: empresaId}).fetch().length
			console.log(planeamiento);
			if (planeamiento > 0) {
				Planeamiento.update({empresaId: empresaId}, {
					$set: {
						plan: datos,
						modificado: new Date()
					}
				});
			} else {
				Planeamiento.insert({
					empresaId: empresaId,
					modificado: new Date(),
					plan: datos
				});
			}

		} else {
			return;
		}

	},
	AgregarRuta(datos) {

		if (this.userId) {



			let rutaId = Rutas.insert(datos);

			if (rutaId) {
				datos.empresasId.forEach( (e) => {
					console.log(e);
					Empresas.update({_id: e}, {
						$push: {
							rutas: rutaId
						}
					});
				});
			}

			

		} else {
			return
		}
	},
	eliminarRuta(rutaId) {
		if (this.userId) {
			Rutas.remove({_id: rutaId});
		} else {
			return;
		}
	}
});