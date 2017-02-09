Planeamiento = new Mongo.Collection('planeamiento');

Planeamiento.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

Planeamiento.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});
