Empresas = new Mongo.Collection('empresas');

Empresas.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Empresas.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

Directores = new Mongo.Collection('directores');

Directores.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Directores.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

Operadores = new Mongo.Collection('operadores');

Operadores.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Operadores.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});