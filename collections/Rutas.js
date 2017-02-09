Rutas = new Mongo.Collection('rutas')

Rutas.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});


Rutas.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});
