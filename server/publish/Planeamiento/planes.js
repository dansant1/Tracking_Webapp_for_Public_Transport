Meteor.publish('planes', function () {
  if (this.userId) {
    return Plan.find()
  } else {
    this.stop()
    return;
  }
})
