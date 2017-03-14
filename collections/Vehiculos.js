Vehiculos = new Mongo.Collection('vehiculos');

if ( Meteor.isServer ) {
  Vehiculos._ensureIndex( { posicion: '2dsphere'} );
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
