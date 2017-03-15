PlanesHorarios = new Mongo.Collection('planes_horarios');

PlanesHorarios.allow({
	insert: () => { return false },
	update: () => { return false },
	remove: () => { return false }
});

PlanesHorarios.deny({
	insert: () => { return true },
	update: () => { return true },
	remove: () => { return true }
});


Plan = new Mongo.Collection('plan');

Plan.allow({
	insert: () => { return false },
	update: () => { return false },
	remove: () => { return false }
});

Plan.deny({
	insert: () => { return true },
	update: () => { return true },
	remove: () => { return true }
});

CalendarioPlaneamiento = new Mongo.Collection('calendario_planeamiento')

CalendarioPlaneamiento.allow({
	insert: () => { return false },
	update: () => { return false },
	remove: () => { return false }
});

CalendarioPlaneamiento.deny({
	insert: () => { return true },
	update: () => { return true },
	remove: () => { return true }
});
