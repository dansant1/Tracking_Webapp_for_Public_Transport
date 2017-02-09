Cobradores = new Mongo.Collection('cobradores');

Cobradores.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Cobradores.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});