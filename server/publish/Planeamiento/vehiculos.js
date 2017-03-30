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

Meteor.publish('VehiculosDespachados', function (ida) {
    if (this.userId) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;

        var yyyy = today.getFullYear();

        if (dd < 10){
            dd = '0' + dd;
        }

        if ( mm < 10){
            mm = '0' + mm;
        }

        let hoy = yyyy + '-' + mm + '-' + dd;
        return VehiculosDespachados.find({ida: ida, dia: hoy});
    } else {
        this.stop();
        return;
    }
});
