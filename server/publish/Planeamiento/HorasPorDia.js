Meteor.publish('HorasPorDia', function (ida) {
  if (this.userId) {
    return HorasPorDia.find({ida: ida})
  } else {
    this.stop();
    return;
  }
})
