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

Monitoreo = new Mongo.Collection('monitoreo');

Monitoreo.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Monitoreo.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

Soporte = new Mongo.Collection('soporte');

Soporte.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Soporte.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

Administradores = new Mongo.Collection('administradores');

Administradores.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Administradores.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});
