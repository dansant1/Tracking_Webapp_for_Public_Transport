Conductores = new Mongo.Collection('conductores');

Conductores.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Conductores.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});