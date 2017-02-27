Vehiculos = new Mongo.Collection('vehiculos');

if ( Meteor.isServer ) {
  Vehiculos._ensureIndex( { placa: 1, padron: 1} );
}


Vehiculos.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Vehiculos.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

RegistroDeDespachoDeVehiculos = new Mongo.Collection('registrodedespachodevehiculos');

RegistroDeDespachoDeVehiculos.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

RegistroDeDespachoDeVehiculos.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

RecaudacionTPI = new Mongo.Collection('recaudaciontpi');

RecaudacionTPI.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

RecaudacionTPI.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});
