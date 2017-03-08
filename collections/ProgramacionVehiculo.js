ProgramacionVehiculo = new Mongo.Collection('programacion_vehiculo')

ProgramacionVehiculo.allow({
    insert: () => {return false},
    update: () => {return false},
    remove: () => {return false}
});


ProgramacionVehiculo.deny({
    insert: () => {return true},
    update: () => {return true},
    remove: () => {return true}
});
