Meteor.publish('HorasPorDia', function (ida) {
  if (this.userId) {
    return HorasPorDia.find({ida: ida})
  } else {
    this.stop();
    return;
  }
})

Meteor.publish('GruposHorarios', function () {
  return GruposHorarios.find({});
})
