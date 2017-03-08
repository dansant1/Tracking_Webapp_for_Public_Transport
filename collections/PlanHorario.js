PlanHorario = new Mongo.Collection('plan_horario');

PlanHorario.allow({
	insert: () => {return false},
	update: () => {return false},
	remove: () => {return false}
});

PlanHorario.deny({
	insert: () => {return true},
	update: () => {return true},
	remove: () => {return true}
});
