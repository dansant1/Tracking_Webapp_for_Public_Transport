Checklist = new Mongo.Collection('checklist');

Checklist.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Checklist.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

Listas = new Mongo.Collection('listas');

Listas.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Listas.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});

Horas = new Mongo.Collection('horas');
