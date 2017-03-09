Meteor.publish('PlanesHorarios', function () {
  if (this.userId) {
    return PlanesHorarios.find();
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
