Meteor.publish('VehiculosHorario', function () {
    if (this.userId) {
        return Vehiculos.find({});
    } else {
        this.stop();
        return;
    }
});


Meteor.publish('Horarios', function (ida, rutaId) {
    if (this.userId) {
        return Plan.find({rutaId: rutaId, ida: ida});
    } else {
        this.stop();
        return;
    }
});
