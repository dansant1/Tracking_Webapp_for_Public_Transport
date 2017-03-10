ProgramacionVehiculoHistorial = new Mongo.Collection('programacion_vehiculo')

ProgramacionVehiculoHistorial.allow({
    insert: () => {
        return false
    },
    update: () => {
        return false
    },
    remove: () => {
        return false
    }
});

ProgramacionVehiculoHistorial.deny({
    insert: () => {
        return true
    },
    update: () => {
        return true
    },
    remove: () => {
        return true
    }
});
