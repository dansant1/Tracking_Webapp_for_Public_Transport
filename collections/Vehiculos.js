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

