Meteor.publish('PlanesHorarios', function () {
  if (this.userId) {
    return PlanesHorarios.find();
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('ProgramacionVehiculoRutaDiaIda', function (rutaId, dia, ida) {
  if (this.userId) {
    return ProgramacionVehiculo.find({rutaId: rutaId, dia:dia, ida: ida})
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('calendario', function () {
  if (this.userId) {
    return CalendarioPlaneamiento.find();
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('PlanesHorarios2', function (ida) {
  if (this.userId) {
    return PlanesHorarios.find({ida: ida});
  } else {
    this.stop()
    return;
  }
})

Meteor.publish('PlanHorario', function (planHorarioId) {
  if (this.userId) {
    return PlanesHorarios.find({_id: planHorarioId});
  } else {
    this.stop()
    return;
  }
})
